import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '@consta/uikit/Text';
import { Loader } from '@consta/uikit/Loader';
import { Informer } from '@consta/uikit/Informer';
import { Button } from '@consta/uikit/Button';
import { Badge } from '@consta/uikit/Badge';
import { Card } from '@consta/uikit/Card';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import type { User, Post } from '../types/api';

export function UserCardPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([api.getUser(token, Number(id)), api.getUserPosts(token, Number(id))])
      .then(([u, p]) => {
        if (!cancelled) {
          setUser(u);
          setPosts(p);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  return (
    <div>
      <div className="toolbar">
        <Button label="← К списку пользователей" view="ghost" onClick={() => navigate('/users')} />
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader />
        </div>
      )}

      {error && (
        <Informer status="alert" view="filled" title="Ошибка">
          {error}
        </Informer>
      )}

      {user && !loading && (
        <>
          <Card verticalSpace="l" horizontalSpace="l" className="card-section">
            <Text as="h2" size="2xl" weight="bold" style={{ marginTop: 0 }}>
              {user.name}
            </Text>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Badge
                status={user.status === 'active' ? 'success' : 'system'}
                label={user.status === 'active' ? 'Активен' : 'Неактивен'}
              />
              <Badge view="stroked" label={user.gender === 'male' ? 'Мужской' : 'Женский'} />
            </div>
            <Text size="m">
              <b>ID:</b> {user.id}
            </Text>
            <Text size="m">
              <b>Email:</b> {user.email}
            </Text>
          </Card>

          <Text as="h3" size="xl" weight="bold" style={{ marginBottom: 12 }}>
            Посты пользователя ({posts.length})
          </Text>

          {posts.length === 0 ? (
            <Text view="secondary">Постов нет</Text>
          ) : (
            posts.map((p) => (
              <Card
                key={p.id}
                verticalSpace="m"
                horizontalSpace="m"
                className="card-section row-clickable"
                onClick={() => navigate(`/posts/${p.id}`)}
              >
                <Text size="m" weight="semibold">
                  {p.title}
                </Text>
                <Text size="s" view="secondary" style={{ marginTop: 8 }}>
                  {p.body}
                </Text>
              </Card>
            ))
          )}
        </>
      )}
    </div>
  );
}

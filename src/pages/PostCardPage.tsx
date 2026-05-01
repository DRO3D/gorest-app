import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Text } from '@consta/uikit/Text';
import { Loader } from '@consta/uikit/Loader';
import { Informer } from '@consta/uikit/Informer';
import { Button } from '@consta/uikit/Button';
import { Card } from '@consta/uikit/Card';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import type { Post, Comment } from '../types/api';

export function PostCardPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      api.getPost(token, Number(id)),
      api.getPostComments(token, Number(id)),
    ])
      .then(([p, c]) => {
        if (!cancelled) {
          setPost(p);
          setComments(c);
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
        <Button label="← К списку постов" view="ghost" onClick={() => navigate('/posts')} />
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

      {post && !loading && (
        <>
          <Card verticalSpace="l" horizontalSpace="l" className="card-section">
            <Text size="s" view="secondary">
              Пост #{post.id}
            </Text>
            <Text as="h2" size="2xl" weight="bold" style={{ marginTop: 8 }}>
              {post.title}
            </Text>
            <Text size="m" style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
              {post.body}
            </Text>
            <Button
              label="Открыть автора"
              view="secondary"
              size="s"
              style={{ marginTop: 16 }}
              onClick={() => navigate(`/users/${post.user_id}`)}
            />
          </Card>

          <Text as="h3" size="xl" weight="bold" style={{ marginBottom: 12 }}>
            Комментарии ({comments.length})
          </Text>

          {comments.length === 0 ? (
            <Text view="secondary">Комментариев нет</Text>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text size="m" weight="semibold">
                    {c.name}
                  </Text>
                  <Text size="s" view="secondary">
                    {c.email}
                  </Text>
                </div>
                <Text size="s" style={{ whiteSpace: 'pre-wrap' }}>
                  {c.body}
                </Text>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

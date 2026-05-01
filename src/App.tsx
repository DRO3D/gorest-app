import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Text } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';
import { useAuth } from './hooks/useAuth';
import { HomePage } from './pages/HomePage';
import { UsersPage } from './pages/UsersPage';
import { PostsPage } from './pages/PostsPage';
import { UserCardPage } from './pages/UserCardPage';
import { PostCardPage } from './pages/PostCardPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export function App() {
  const { token, clearToken } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text size="l" weight="bold">
            GoREST Client
          </Text>
        </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {token && (
            <>
              <Link to="/users">
                <Button view="ghost" size="s" label="Пользователи" />
              </Link>
              <Link to="/posts">
                <Button view="ghost" size="s" label="Посты" />
              </Link>
              <Button view="secondary" size="s" label="Выйти" onClick={clearToken} />
            </>
          )}
        </div>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserCardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostCardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

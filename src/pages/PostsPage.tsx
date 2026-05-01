import { useNavigate } from 'react-router-dom';
import { Table } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { Loader } from '@consta/uikit/Loader';
import { Informer } from '@consta/uikit/Informer';
import { Button } from '@consta/uikit/Button';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { Pagination } from '../components/Pagination';
import type { Post } from '../types/api';

interface Row {
  id: string;
  postId: number;
  title: string;
}

export function PostsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const list = usePaginatedList<Post>(
    (page, perPage) => api.getPosts(token, page, perPage),
    [token]
  );

  const rows: Row[] = list.data.map((p) => ({
    id: String(p.id),
    postId: p.id,
    title: p.title,
  }));

  const columns = [
    { title: 'ID', accessor: 'postId' as const, width: 120 },
    { title: 'Заголовок', accessor: 'title' as const },
  ];

  return (
    <div>
      <div className="toolbar">
        <Text as="h2" size="2xl" weight="bold" style={{ margin: 0 }}>
          Посты
        </Text>
        <Button label="← На главную" view="ghost" onClick={() => navigate('/')} />
      </div>

      {list.error && (
        <Informer status="alert" view="filled" title="Ошибка" style={{ marginBottom: 16 }}>
          {list.error}
        </Informer>
      )}

      {list.loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader />
        </div>
      ) : (
        <Table
          rows={rows}
          columns={columns}
          getCellWrap={() => 'truncate'}
          onRowClick={({ id }) => navigate(`/posts/${id}`)}
          zebraStriped="odd"
        />
      )}

      <Pagination
        page={list.page}
        pages={list.pages}
        total={list.total}
        perPage={list.perPage}
        onPageChange={list.setPage}
        onPerPageChange={list.setPerPage}
      />
    </div>
  );
}

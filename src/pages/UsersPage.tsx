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
import type { User } from '../types/api';

interface Row {
  id: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function UsersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const list = usePaginatedList<User>(
    (page, perPage) => api.getUsers(token, page, perPage),
    [token]
  );

  const rows: Row[] = list.data.map((u) => {
    const { first, last } = splitName(u.name);
    return {
      id: String(u.id),
      userId: u.id,
      firstName: first,
      lastName: last,
      email: u.email,
    };
  });

  const columns = [
    { title: 'Имя', accessor: 'firstName' as const, width: 200 },
    { title: 'Фамилия', accessor: 'lastName' as const, width: 200 },
    { title: 'Email', accessor: 'email' as const },
  ];

  return (
    <div>
      <div className="toolbar">
        <Text as="h2" size="2xl" weight="bold" style={{ margin: 0 }}>
          Пользователи
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
          onRowClick={({ id }) => navigate(`/users/${id}`)}
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

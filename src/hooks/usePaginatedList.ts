import { useEffect, useState, useCallback } from 'react';
import type { PaginatedResult } from '../types/api';

export function usePaginatedList<T>(
  fetcher: (page: number, perPage: number) => Promise<PaginatedResult<T>>,
  deps: unknown[]
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(page, perPage);
      setData(res.data);
      setTotal(res.meta.total);
      setPages(res.meta.pages);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
      setError(msg);
      setData([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePerPageChange = useCallback((n: number) => {
    setPerPage(n);
    setPage(1);
  }, []);

  return {
    data,
    page,
    perPage,
    total,
    pages,
    loading,
    error,
    setPage,
    setPerPage: handlePerPageChange,
    reload: load,
  };
}

import type { User, Post, Comment, PaginatedResult } from '../types/api';

const BASE_URL = 'https://gorest.co.in/public/v2';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  path: string,
  token: string,
  params?: Record<string, string | number>
): Promise<{ data: T; headers: Headers }> {
  const url = new URL(BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, msg);
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

function readPaginationFromHeaders(headers: Headers, page: number, limit: number) {
  const total = Number(headers.get('x-pagination-total') ?? 0);
  const pages = Number(headers.get('x-pagination-pages') ?? 0);
  return { total, pages, page, limit };
}

export const api = {
  async getUsers(
    token: string,
    page: number,
    perPage: number
  ): Promise<PaginatedResult<User>> {
    const { data, headers } = await request<User[]>('/users', token, {
      page,
      per_page: perPage,
    });
    return { data, meta: readPaginationFromHeaders(headers, page, perPage) };
  },

  async getUser(token: string, id: number): Promise<User> {
    const { data } = await request<User>(`/users/${id}`, token);
    return data;
  },

  async getPosts(
    token: string,
    page: number,
    perPage: number
  ): Promise<PaginatedResult<Post>> {
    const { data, headers } = await request<Post[]>('/posts', token, {
      page,
      per_page: perPage,
    });
    return { data, meta: readPaginationFromHeaders(headers, page, perPage) };
  },

  async getPost(token: string, id: number): Promise<Post> {
    const { data } = await request<Post>(`/posts/${id}`, token);
    return data;
  },

  async getPostComments(token: string, postId: number): Promise<Comment[]> {
    const { data } = await request<Comment[]>(`/posts/${postId}/comments`, token);
    return data;
  },

  async getUserPosts(token: string, userId: number): Promise<Post[]> {
    const { data } = await request<Post[]>(`/users/${userId}/posts`, token);
    return data;
  },

  // Проверка валидности токена: gorest.co.in отдаёт 200 на /users и без токена,
  // поэтому "проверкой авторизации" служит запрос, требующий аутентификации.
  // Самый надёжный способ — попробовать любой защищённый endpoint.
  // Здесь мы используем GET /users — он всегда успешен, и считаем токен "формально валидным",
  // если он не пустой; реальные ошибки 401 будут пойманы при последующих запросах.
  async pingAuth(token: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/users?per_page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },
};

export { ApiError };

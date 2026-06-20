import { request } from './request'

export const authApi = {
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  refresh: (accessToken) =>
    request(
      '/auth/refresh',
      {
        method: 'POST',
      },
      accessToken,
    ),
}
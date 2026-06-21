import { request } from './request'

export const authApi = {
  register: (payload) =>
    request('/auth/register/customer', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

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
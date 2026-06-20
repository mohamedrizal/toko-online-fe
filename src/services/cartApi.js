import { request } from './request'

export const cartApi = {
  getUserCart: (accessToken) => request('/customer/carts', {}, accessToken),

  createCart: (payload, accessToken) =>
    request(
      '/customer/carts',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),

  updateCart: (id, payload, accessToken) =>
    request(
      `/customer/carts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),

  deleteCart: (id, accessToken) =>
    request(
      `/customer/carts/${id}`,
      {
        method: 'DELETE',
      },
      accessToken,
    ),
}
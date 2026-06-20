import { request } from './request'

export const orderApi = {
  createOrder: (payload, accessToken) =>
    request(
      '/customer/orders',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),

  getAllOrders: ({ page = 1, perPage = 10 } = {}, accessToken) =>
    request(
      `/admin/orders?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
      },
      accessToken,
    ),

  updateOrder: (id, payload, accessToken) =>
    request(
      `/admin/orders/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      accessToken,
    ),

  getOrderDetail: (id, accessToken) =>
    request(`/admin/orders/${id}`, {
      method: 'GET',
      accessToken,
    }),

  deleteOrder: (id, accessToken) =>
    request(`/admin/orders/${id}`, {
      method: 'DELETE',
      accessToken,
    }),
}
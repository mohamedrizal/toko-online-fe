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

  getAllOrders: ({ page = 1, perPage = 10, status, search } = {}, accessToken) => {
    const query = new URLSearchParams()
    query.append('page', page)
    query.append('per_page', perPage)
    if (status) query.append('status', status)
    if (search) query.append('search', search)
    
    return request(
      `/admin/orders?${query.toString()}`,
      {
        method: 'GET',
      },
      accessToken,
    )
  },

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
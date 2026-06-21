import { request } from './request'

const getProductsPrefix = (role) => (role === 'customer' ? '/customer' : '/admin')

export const productsApi = {
  getCategories: (role, accessToken) =>
    request(`${getProductsPrefix(role)}/product-categories`, {}, accessToken),

  createCategory: (payload, accessToken) =>
    request(
      '/admin/product-categories',
      {
        method: 'POST',
        body: payload,
      },
      accessToken,
    ),

  updateCategory: (id, payload, accessToken) =>
    request(
      `/admin/product-categories/${id}`,
      {
        method: 'POST',
        body: payload,
        headers: { 'X-HTTP-Method-Override': 'PUT' },
      },
      accessToken,
    ),

  deleteCategory: (id, accessToken) =>
    request(
      `/admin/product-categories/${id}`,
      {
        method: 'DELETE',
      },
      accessToken,
    ),

  getProducts: (role, accessToken, params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.category_id) query.append('category_id', params.category_id)
    if (params.page) query.append('page', params.page)
    
    const queryString = query.toString() ? `?${query.toString()}` : ''
    return request(`${getProductsPrefix(role)}/products${queryString}`, {}, accessToken)
  },

  createProduct: (payload, accessToken) =>
    request(
      '/admin/products',
      {
        method: 'POST',
        body: payload,
      },
      accessToken,
    ),

  updateProduct: (id, payload, accessToken) =>
    request(
      `/admin/products/${id}`,
      {
        method: 'POST',
        body: payload,
        headers: { 'X-HTTP-Method-Override': 'PUT' },
      },
      accessToken,
    ),

  deleteProduct: (id, accessToken) =>
    request(
      `/admin/products/${id}`,
      {
        method: 'DELETE',
      },
      accessToken,
    ),
}
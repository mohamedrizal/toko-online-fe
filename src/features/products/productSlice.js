import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productsApi } from '../../services/api'

const createInitialState = () => ({
  categories: [],
  items: [],
  meta: null,
  status: 'idle',
  error: null,
  searchQuery: '',
})

const getAccessToken = (getState) => getState().auth?.accessToken
const getUserRole = (getState) => getState().auth?.user?.role || 'customer'
const extractList = (payload) => (Array.isArray(payload?.data) ? payload.data : [])

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { getState, rejectWithValue }) => {
  try {
    const response = await productsApi.getCategories(
      getUserRole(getState),
      getAccessToken(getState),
    )
    return extractList(response)
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal mengambil kategori.')
  }
})

export const createCategory = createAsyncThunk('products/createCategory', async (payload, { getState, rejectWithValue }) => {
  try {
    return await productsApi.createCategory(payload, getAccessToken(getState))
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal membuat kategori.')
  }
})

export const updateCategory = createAsyncThunk('products/updateCategory', async ({ id, payload }, { getState, rejectWithValue }) => {
  try {
    return await productsApi.updateCategory(id, payload, getAccessToken(getState))
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal mengubah kategori.')
  }
})

export const deleteCategory = createAsyncThunk('products/deleteCategory', async (id, { getState, rejectWithValue }) => {
  try {
    await productsApi.deleteCategory(id, getAccessToken(getState))
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal menghapus kategori.')
  }
})

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { getState, rejectWithValue }) => {
  try {
    const response = await productsApi.getProducts(
      getUserRole(getState),
      getAccessToken(getState),
      params || {}
    )
    return {
      data: extractList(response),
      meta: response?.meta || null
    }
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal mengambil produk.')
  }
})

export const createProduct = createAsyncThunk('products/createProduct', async (payload, { getState, rejectWithValue }) => {
  try {
    return await productsApi.createProduct(payload, getAccessToken(getState))
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal membuat produk.')
  }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, payload }, { getState, rejectWithValue }) => {
  try {
    return await productsApi.updateProduct(id, payload, getAccessToken(getState))
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal mengubah produk.')
  }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { getState, rejectWithValue }) => {
  try {
    await productsApi.deleteProduct(id, getAccessToken(getState))
    return id
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal menghapus produk.')
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: createInitialState(),
  reducers: {
    clearProductsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal mengambil kategori.'
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data || action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload
        const index = state.categories.findIndex((item) => item.id === updated.id)
        if (index !== -1) state.categories[index] = updated
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((item) => item.id !== action.payload)
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.searchQuery = action.meta.arg?.search || ''
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data || []
        state.meta = action.payload.meta || null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal mengambil produk.'
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload.data || action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.data || action.payload
        const index = state.items.findIndex((item) => item.id === updated.id)
        if (index !== -1) state.items[index] = updated
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
  },
})

export const { clearProductsError } = productsSlice.actions
export default productsSlice.reducer
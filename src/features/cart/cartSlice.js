import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'
import { cartApi } from '../../services/api'

const initialState = {
  id: null,
  items: [],
  quantity: 0,
  total_price: 0,
  status: 'idle',
  error: null,
}

const getAccessToken = (getState) => getState().auth?.accessToken
const normalizeCart = (payload) => {
  const cart = Array.isArray(payload?.data) ? payload.data[0] : payload?.data
  return {
    id: cart?.id || null,
    quantity: cart?.quantity || 0,
    total_price: cart?.total_price || 0,
    items: Array.isArray(cart?.items)
      ? cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity }))
      : [],
  }
}

export const fetchUserCart = createAsyncThunk('cart/fetchUserCart', async (_, { getState, rejectWithValue }) => {
  try {
    return normalizeCart(await cartApi.getUserCart(getAccessToken(getState)))
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal mengambil cart.')
  }
})

export const saveCart = createAsyncThunk('cart/saveCart', async (items, { getState, rejectWithValue }) => {
  try {
    const state = getState().cart
    const payload = { items }
    if (!items.length && state.id) {
      await cartApi.deleteCart(state.id, getAccessToken(getState))
      return { id: null, items: [], quantity: 0, total_price: 0 }
    }
    const response = state.id
      ? await cartApi.updateCart(state.id, payload, getAccessToken(getState))
      : await cartApi.createCart(payload, getAccessToken(getState))
    return normalizeCart(response)
  } catch (error) {
    return rejectWithValue(error.message || 'Gagal menyimpan cart.')
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        Object.assign(state, { ...state, ...action.payload, status: 'succeeded', error: null })
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal mengambil cart.'
      })
      .addCase(saveCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(saveCart.fulfilled, (state, action) => {
        Object.assign(state, { ...state, ...action.payload, status: 'succeeded', error: null })
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal menyimpan cart.'
      })
      .addCase(logout, () => initialState)
  },
})

export default cartSlice.reducer
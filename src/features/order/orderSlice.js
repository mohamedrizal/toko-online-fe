import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { orderApi } from '../../services/api'

const initialState = {
  orders: [],
  meta: null,
  status: 'idle',
  error: null,
  successMessage: null,
}

const getAccessToken = (getState) => getState().auth?.accessToken

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      return await orderApi.getAllOrders(params, getAccessToken(getState))
    } catch (error) {
      return rejectWithValue(error.message || 'Gagal mengambil daftar order.')
    }
  },
)

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload, { getState, rejectWithValue }) => {
    try {
      return await orderApi.createOrder(payload, getAccessToken(getState))
    } catch (error) {
      return rejectWithValue(error.message || 'Gagal membuat order.')
    }
  },
)

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
      return await orderApi.updateOrder(id, payload, getAccessToken(getState))
    } catch (error) {
      return rejectWithValue(error.message || 'Gagal mengubah status order.')
    }
  },
)

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.orders = []
      state.meta = null
      state.status = 'idle'
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.orders = action.payload?.data || []
        state.meta = action.payload?.meta || null
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal mengambil daftar order.'
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.successMessage = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.successMessage = action.payload?.message || 'Order berhasil dibuat.'
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal membuat order.'
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.successMessage = action.payload?.message || 'Status order berhasil diperbarui.'
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Gagal mengubah status order.'
      })
  },
})

export const { clearOrderState } = orderSlice.actions
export default orderSlice.reducer
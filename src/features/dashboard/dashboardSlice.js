import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request } from '../../services/api'

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().auth.accessToken
      const response = await request('/admin/dashboard', {}, accessToken)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Gagal mengambil data dashboard.',
      )
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
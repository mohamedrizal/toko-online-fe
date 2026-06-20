import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from '../../services/api'

const STORAGE_KEY = 'toko-online-auth'

const createInitialState = () => ({
  user: null,
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  lastTokenRefreshAt: null,
  isAuthenticated: false,
  status: 'idle',
  refreshStatus: 'idle',
  error: null,
  authMode: 'login',
})

const saveSession = (session) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const clearSession = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

const loadSession = () => {
  if (typeof window === 'undefined') {
    return createInitialState()
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return createInitialState()
    }

    const parsed = JSON.parse(saved)

    return {
      ...createInitialState(),
      ...parsed,
      isAuthenticated: Boolean(parsed.accessToken && parsed.user),
    }
  } catch {
    return createInitialState()
  }
}

const createSessionFromResponse = (payload) => ({
  user: payload.user,
  accessToken: payload.access_token,
  tokenType: payload.token_type,
  expiresIn: payload.expires_in,
  lastTokenRefreshAt: Date.now(),
})

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login gagal.',
      )
    }
  },
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const accessToken = getState().auth.accessToken

      if (!accessToken) {
        return rejectWithValue('Token belum tersedia.')
      }

      return await authApi.refresh(accessToken)
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Refresh token gagal.',
      )
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: loadSession(),
  reducers: {
    logout: () => {
      clearSession()
      return createInitialState()
    },
    setAuthMode: (state, action) => {
      state.authMode = action.payload
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const session = createSessionFromResponse(action.payload)

        saveSession(session)

        state.user = session.user
        state.accessToken = session.accessToken
        state.tokenType = session.tokenType
        state.expiresIn = session.expiresIn
        state.isAuthenticated = true
        state.status = 'succeeded'
        state.refreshStatus = 'idle'
        state.error = null
        state.authMode = 'login'
        state.lastTokenRefreshAt = session.lastTokenRefreshAt
      })
      .addCase(login.rejected, (state, action) => {
        clearSession()
        state.user = null
        state.accessToken = null
        state.tokenType = null
        state.expiresIn = null
        state.isAuthenticated = false
        state.status = 'failed'
        state.refreshStatus = 'idle'
        state.error = action.payload || 'Login gagal.'
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.refreshStatus = 'loading'
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const session = createSessionFromResponse(action.payload)

        saveSession(session)

        state.user = session.user
        state.accessToken = session.accessToken
        state.tokenType = session.tokenType
        state.expiresIn = session.expiresIn
        state.lastTokenRefreshAt = session.lastTokenRefreshAt
        state.isAuthenticated = true
        state.refreshStatus = 'succeeded'
        state.error = null
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshStatus = 'failed'
        state.error = action.payload || 'Refresh token gagal.'
      })
  },
})

export const { logout, setAuthMode } = authSlice.actions
export default authSlice.reducer
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import productsReducer from '../features/products/productSlice'
import orderReducer from '../features/order/orderSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  order: orderReducer,
  dashboard: dashboardReducer,
})

export default rootReducer
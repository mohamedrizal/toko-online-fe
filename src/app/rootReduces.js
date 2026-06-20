import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import productsReducer from '../features/products/productSlice'
import orderReducer from '../features/order/orderSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  order: orderReducer,
})

export default rootReducer
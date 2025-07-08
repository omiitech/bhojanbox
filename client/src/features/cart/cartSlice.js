import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ itemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart({ itemId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue('Failed to remove from cart');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  cartTotal: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.cartTotal = 0;
      state.itemCount = 0;
    },
    calculateTotals: (state) => {
      let total = 0;
      let count = 0;
      state.items.forEach((item) => {
        total += item.quantity * item.price;
        count += item.quantity;
      });
      state.cartTotal = total;
      state.itemCount = count;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.cartTotal = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => item._id === action.payload.item._id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push({ ...action.payload.item, quantity: action.payload.quantity });
        }
        state.itemCount += action.payload.quantity;
        state.cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const item = state.items.find(item => item._id === action.payload.itemId);
        if (item) {
          state.itemCount += action.payload.quantity - item.quantity;
          item.quantity = action.payload.quantity;
          state.cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload);
        if (index !== -1) {
          state.itemCount -= state.items[index].quantity;
          state.items.splice(index, 1);
          state.cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
      });
  },
});

export const { clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;

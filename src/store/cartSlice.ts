
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Book, CartItem } from '../types';
import type { RootState } from './index';

type CartState = {
  items: CartItem[];
  hydrated: boolean;
};

const initialState: CartState = {
  items: [],
  hydrated: false,
};

const clamp = (qty: number, stock: number) =>
  Math.max(1, Math.min(qty, stock));

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Book>) {
      const book = action.payload;
      if (book.stock <= 0) return;

      const item = state.items.find(i => i.book.id === book.id);

      if (item) {
        item.book = book;
        item.quantity = clamp(item.quantity + 1, book.stock);
      } else {
        state.items.push({ book, quantity: 1 });
      }
    },

    setQuantity(state, action: PayloadAction<{id: string; quantity: number}>) {
      const item = state.items.find(i => i.book.id === action.payload.id);
      if (item && item.book.stock > 0) {
        item.quantity = clamp(action.payload.quantity, item.book.stock);
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.book.id !== action.payload);
    },

    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
        .filter(i => i.book.stock > 0)
        .map(i => ({
          ...i,
          quantity: clamp(i.quantity, i.book.stock),
        }));
      state.hydrated = true;
    },
  },
});

export const {
  addToCart, setQuantity, removeFromCart, hydrateCart
} = cartSlice.actions;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../types';
import type { RootState } from './index';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [] as Book[],
    hydrated: false,
  },
  reducers: {
    toggleWishlist(state, action: PayloadAction<Book>) {
      const index = state.items.findIndex(b => b.id === action.payload.id);

      if (index >= 0) state.items.splice(index, 1);
      else state.items.push(action.payload);
    },

    hydrateWishlist(state, action: PayloadAction<Book[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
  },
});

export const { toggleWishlist, hydrateWishlist } = wishlistSlice.actions;
export const selectWishlist = (s: RootState) => s.wishlist.items;
export const selectIsFavorite = (id: string) => (s: RootState) =>
  s.wishlist.items.some(b => b.id === id);

export default wishlistSlice.reducer;


import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PayloadAction } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootState } from '../store';
import { hydrateCart } from '../store/cartSlice';
import { hydrateWishlist } from '../store/wishlistSlice';
import type { Book, CartItem } from '../types';

function usePersistSlice<T>({
  key, selectItems, selectHydrated, hydrate,
}: {
  key: string;
  selectItems: (s: RootState) => T[];
  selectHydrated: (s: RootState) => boolean;
  hydrate: (items: T[]) => PayloadAction<T[]>;
}) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const hydrated = useAppSelector(selectHydrated);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then(raw => {
        if (active) dispatch(hydrate(raw ? JSON.parse(raw) : []));
      })
      .catch(() => {
        if (active) dispatch(hydrate([]));
      });

    return () => { active = false; };
  }, [dispatch, key]);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(key, JSON.stringify(items)).catch(console.warn);
    }
  }, [key, items, hydrated]);

  return hydrated;
}

export function useAppPersistence() {
  const cartReady = usePersistSlice<CartItem>({
    key: '@bookstore/cart',
    selectItems: s => s.cart.items,
    selectHydrated: s => s.cart.hydrated,
    hydrate: hydrateCart,
  });

  const wishlistReady = usePersistSlice<Book>({
    key: '@bookstore/wishlist',
    selectItems: s => s.wishlist.items,
    selectHydrated: s => s.wishlist.hydrated,
    hydrate: hydrateWishlist,
  });

  return cartReady && wishlistReady;
}

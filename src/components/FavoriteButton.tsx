
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { Book } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleWishlist, selectIsFavorite } from '../store/wishlistSlice';

export default function FavoriteButton({ book }: {book: Book}) {
  const dispatch = useAppDispatch();
  const liked = useAppSelector(selectIsFavorite(book.id));

  return (
    <Pressable
      style={styles.heart}
      onPress={() => dispatch(toggleWishlist(book))}
    >
      <Text style={{fontSize: 24, color: liked ? 'red' : '#777'}}>
        {liked ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});

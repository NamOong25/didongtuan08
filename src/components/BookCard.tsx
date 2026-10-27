
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Book } from '../types';
import FavoriteButton from './FavoriteButton';
import { formatVND } from '../utils/format';

type Props = {
  book: Book;
  onPress: (id: string) => void;
};

export default function BookCard({ book, onPress }: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Pressable onPress={() => onPress(book.id)}>
          <Image source={{uri: book.cover}} style={styles.cover} />
        </Pressable>
        <FavoriteButton book={book} />
      </View>

      <Pressable onPress={() => onPress(book.id)}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      </Pressable>

      <Text style={styles.price}>{formatVND(book.price)}</Text>
      <Text>{book.stock === 0 ? 'Hết hàng' : `Còn ${book.stock}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '49%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  cover: {width: '100%', height: 185, borderRadius: 5},
  title: {fontWeight: 'bold', marginTop: 8},
  price: {color: 'red', marginVertical: 5},
});

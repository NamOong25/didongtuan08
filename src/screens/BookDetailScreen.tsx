
import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Image, Pressable,
  ActivityIndicator, StyleSheet
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { Book } from '../types';
import { fetchBookById } from './../api/books';
import FavoriteButton from '../components/FavoriteButton';
import { formatVND } from '../utils/format';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetailScreen({route, navigation}: Props) {
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchBookById(route.params.bookId)
      .then(setBook)
      .catch(e => setError(e.message));
  }, [route.params.bookId]);

  if (error) return <Text style={{padding: 20}}>{error}</Text>;
  if (!book) return <ActivityIndicator style={{flex: 1}} />;

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <View style={{width: 200, alignSelf: 'center'}}>
        <Image source={{uri: book.cover}} style={styles.cover} />
        <FavoriteButton book={book} />
      </View>

      <Text style={styles.title}>{book.title}</Text>
      <Text>Tác giả: {book.author}</Text>
      <Text>Thể loại: {book.category}</Text>
      <Text>Đánh giá: {book.rating}/10</Text>
      <Text style={styles.price}>{formatVND(book.price)}</Text>
      <Text>{book.description}</Text>
      <Text style={{marginVertical: 12}}>Tồn kho: {book.stock}</Text>

      <Pressable
        disabled={book.stock === 0}
        style={[styles.button, book.stock === 0 && {opacity: 0.4}]}
        onPress={() => {
          dispatch(addToCart(book));
          navigation.navigate('MainTabs', {screen: 'Cart'});
        }}
      >
        <Text style={{color: 'white'}}>
          {book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cover: {width: 200, height: 280},
  title: {fontSize: 22, fontWeight: 'bold', marginTop: 15},
  price: {color: 'red', fontSize: 20, marginVertical: 12},
  button: {
    backgroundColor: '#2878d0',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
});

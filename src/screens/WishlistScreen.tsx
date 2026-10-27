
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { selectWishlist } from '../store/wishlistSlice';
import BookGrid from '../components/BookGrid';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

export default function WishlistScreen({navigation}: Props) {
  const books = useAppSelector(selectWishlist);

  const empty = (
    <View style={styles.empty}>
      <Text style={{fontSize: 48}}>♡</Text>
      <Text>Chưa có sách yêu thích</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs', {screen: 'Home'})}
      >
        <Text style={{color: 'white'}}>Khám phá sách</Text>
      </Pressable>
    </View>
  );

  return (
    <BookGrid
      books={books}
      onPressBook={id => navigation.navigate('BookDetail', {bookId: id})}
      empty={empty}
    />
  );
}

const styles = StyleSheet.create({
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12},
  button: {backgroundColor: '#2878d0', padding: 12, borderRadius: 6},
});

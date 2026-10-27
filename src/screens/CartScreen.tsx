
import React, { useCallback, useState } from 'react';
import {
  View, Text, FlatList, TextInput,
  Pressable, Alert, Platform, StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CartItem } from '../types';
import { useAppSelector, useAppDispatch } from '../store';
import { removeFromCart, selectCartItems } from '../store/cartSlice';
import { useDebouncedQuantities } from '../hooks/useDebouncedQuantities';
import { formatVND } from '../utils/format';
import CartItemRow from '../components/CartItemRow';

export default function CartScreen() {
  const items = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  const {drafts, changeQuantity, discard, flush} = useDebouncedQuantities();
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState('');

  useFocusEffect(useCallback(() => () => flush(), [flush]));

  const remove = (item: CartItem) => {
    const execute = () => {
      discard(item.book.id);
      dispatch(removeFromCart(item.book.id));
    };

    if (Platform.OS === 'web') {
      if (globalThis.confirm('Xóa ' + item.book.title + '?')) execute();
    } else {
      Alert.alert('Xóa sản phẩm', `Xóa "${item.book.title}"?`, [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Xóa', style: 'destructive', onPress: execute},
      ]);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const quantity = drafts[item.book.id] ?? item.quantity;
    return sum + item.book.price * quantity;
  }, 0);

  const discount =
    coupon === 'SALE10' ? Math.round(subtotal * 0.1) :
    coupon === 'BOOK50K' && subtotal >= 200000 ? 50000 : 0;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();

    if (code === 'SALE10' || code === 'BOOK50K') {
      setCoupon(code);
    } else {
      setCoupon('');
      if (Platform.OS === 'web') {
        globalThis.alert('Mã không hợp lệ');
      } else {
        Alert.alert('Thông báo', 'Mã không hợp lệ');
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={items}
        keyExtractor={item => item.book.id}
        contentContainerStyle={{padding: 12, flexGrow: 1}}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Giỏ hàng đang trống</Text>
          </View>
        }
        renderItem={({item}) => (
          <CartItemRow
            item={item}
            quantity={drafts[item.book.id] ?? item.quantity}
            onChange={changeQuantity}
            onRemove={remove}
          />
        )}
      />

      <View style={styles.footer}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Mã giảm giá"
            value={couponInput}
            onChangeText={setCouponInput}
            autoCapitalize="characters"
          />
          <Pressable style={styles.button} onPress={applyCoupon}>
            <Text style={{color: 'white'}}>Áp dụng</Text>
          </Pressable>
        </View>

        {!!coupon && (
          <Pressable onPress={() => {setCoupon(''); setCouponInput('');}}>
            <Text style={{color: 'green'}}>✓ {coupon} (bấm để bỏ)</Text>
          </Pressable>
        )}

        <Text>Tạm tính: {formatVND(subtotal)}</Text>
        <Text>Giảm giá: {formatVND(discount)}</Text>
        <Text style={styles.total}>
          Tổng cộng: {formatVND(subtotal - discount)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  footer: {padding: 15, backgroundColor: 'white', gap: 10},
  row: {flexDirection: 'row', gap: 10},
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    borderRadius: 5, flex: 1,
  },
  button: {backgroundColor: '#2878d0', padding: 12, borderRadius: 5},
  total: {fontSize: 19, fontWeight: 'bold'},
});


import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { CartItem } from '../types';
import { formatVND } from '../utils/format';

type Props = {
  item: CartItem;
  quantity: number;
  onChange: (id: string, quantity: number) => void;
  onRemove: (item: CartItem) => void;
};

export default function CartItemRow({
  item, quantity, onChange, onRemove
}: Props) {
  const { book } = item;

  return (
    <View style={styles.row}>
      <Image source={{uri: book.cover}} style={styles.image} />

      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>{book.title}</Text>
        <Text>{formatVND(book.price)}</Text>

        <View style={styles.qtyRow}>
          <Pressable
            style={[styles.btn, quantity <= 1 && styles.disabled]}
            disabled={quantity <= 1}
            onPress={() => onChange(book.id, quantity - 1)}
          ><Text>−</Text></Pressable>

          <Text>{quantity}</Text>

          <Pressable
            style={[styles.btn, quantity >= book.stock && styles.disabled]}
            disabled={quantity >= book.stock}
            onPress={() => onChange(book.id, quantity + 1)}
          ><Text>+</Text></Pressable>

          <Text>Còn {book.stock}</Text>
        </View>

        <Text style={{color: 'red', marginTop: 6}}>
          {formatVND(book.price * quantity)}
        </Text>
      </View>

      <Pressable onPress={() => onRemove(item)}>
        <Text style={{fontSize: 20}}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    gap: 12,
  },
  image: {width: 70, height: 100},
  qtyRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8},
  btn: {backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6},
  disabled: {opacity: 0.3},
});

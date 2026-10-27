
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store';
import { selectWishlist } from '../store/wishlistSlice';

export default function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const count = useAppSelector(selectWishlist).length;

  return (
    <View style={{padding: 20}}>
      <Text style={styles.title}>Tài khoản</Text>

      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate('Wishlist')}
      >
        <Text>♥ Danh sách yêu thích</Text>
        <Text>{count} ›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 8,
  },
});

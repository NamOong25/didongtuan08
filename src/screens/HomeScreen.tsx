
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/types';
import { fetchBooks } from '../api/books';
import type { Book } from '../types';
import BookGrid from '../components/BookGrid';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Lấy danh sách sách từ API
  const load = useCallback(async () => {
    try {
      setError('');
      setBooks(await fetchBooks());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Tải dữ liệu khi mở màn hình
  useEffect(() => {
    load();
  }, [load]);

  // Đang tải dữ liệu
  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // Xử lý lỗi API
  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Không tải được sách: {error}</Text>
        <Button title="Thử lại" onPress={load} />
      </View>
    );
  }

  // Hiển thị danh sách sách
  return (
    <BookGrid
      books={books}
      onPressBook={(id) =>
        navigation.navigate('BookDetail', { bookId: id })
      }
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        load();
      }}
    />
  );
}

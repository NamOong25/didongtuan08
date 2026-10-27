
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import type { Book } from '../types';
import BookCard from './BookCard';

type Props = {
  books: Book[];
  onPressBook: (id: string) => void;
  empty?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function BookGrid({
  books, onPressBook, empty, refreshing, onRefresh
}: Props) {
  return (
    <FlatList
      data={books}
      numColumns={2}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <BookCard book={item} onPress={onPressBook} />
      )}
      columnWrapperStyle={{gap: 10}}
      contentContainerStyle={{padding: 12, gap: 10, flexGrow: 1}}
      ListEmptyComponent={empty}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

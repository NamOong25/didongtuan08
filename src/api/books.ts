
import { Platform } from 'react-native';
import type { Book } from '../types';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error('Không tải được sách');
  return res.json();
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error('Không tìm thấy sách');
  return res.json();
}

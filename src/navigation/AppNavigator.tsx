
import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import AccountScreen from '../screens/AccountScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import WishlistScreen from '../screens/WishlistScreen';

import { useAppSelector } from '../store';
import { selectCartCount } from '../store/cartSlice';
import type { TabParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  const count = useAppSelector(selectCartCount);

  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#2878d0'}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: () => <Text>⌂</Text>,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Giỏ hàng',
          tabBarBadge: count || undefined,
          tabBarIcon: () => <Text>🛒</Text>,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: 'Tài khoản',
          tabBarIcon: () => <Text>♙</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{title: 'Chi tiết sách'}}
      />
      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{title: 'Yêu thích'}}
      />
    </Stack.Navigator>
  );
}

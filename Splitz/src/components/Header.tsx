// Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  showBackButton?: boolean;
  notificationCount?: number;
  title?: string; // optional title for pages
}

// Define the navigation stack types that this header might use
type RootStackParamList = {
  MainApp: undefined;
  DistributeContent: { type: string };
};

export default function Header({
  showBackButton = true,
  notificationCount = 0,
  title,
}: HeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isFirstPage = !title; // if no title is passed, assume first page

  return (
    <View style={styles.header}>
      {/* Back Button */}
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.sideButton}
        >
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}

      {/* Logo or Title */}
      {isFirstPage ? (
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.titleText}>{title}</Text>
      )}

      {/* Notifications */}
      <TouchableOpacity
        onPress={() => alert('Notifications')}
        style={styles.notificationButton}
      >
        <Ionicons name="notifications-outline" size={24} color="#fff" />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#000',
  },
  sideButton: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(128,128,128,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    flex: 1,
    alignSelf: 'center',
  },
  titleText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});

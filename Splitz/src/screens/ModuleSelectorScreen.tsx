import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ModuleSelectorScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient colors={['#050816', '#121212']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.header}>Choose Your Module</Text>
          <Text style={styles.sub}>
            Pick your experience. You can always switch later.
          </Text>

          {/* CREATOR MODULE */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigation.navigate('MainApp')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Ionicons name="sparkles-outline" size={26} color="#fff" />
              <Text style={styles.cardTitle}>Content Creator Module</Text>
              <Text style={styles.cardDesc}>
                For influencers, streamers, and multi-platform creators.
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* MUSIC ARTIST MODULE */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={() => navigation.navigate('StreamActivity')}
            activeOpacity={0.85}
          >
            <View style={[styles.card, styles.cardSecondary]}>
              <Ionicons name="musical-notes-outline" size={26} color="#9CA3AF" />
              <Text style={styles.cardTitleSecondary}>Music Artist Module</Text>
              <Text style={styles.cardDescSecondary}>
                For artists, producers, and songwriters.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ModuleSelectorScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 30,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    padding: 22,
  },
  cardSecondary: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  cardTitleSecondary: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#F3F4F6',
  },
  cardDesc: {
    marginTop: 6,
    color: '#F9FAFB',
    fontSize: 13,
  },
  cardDescSecondary: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 13,
  },
});

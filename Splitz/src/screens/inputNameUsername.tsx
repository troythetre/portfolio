import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

// Global store for onboarding promises
type OnboardingJobs = {
  createUserPromise: Promise<Response>;
  createTokenPromise: Promise<Response>;
  createLinkPromise: Promise<Response>;
};

type OnboardingStore = Map<string, OnboardingJobs>;
function getOnboardingStore(): OnboardingStore {
  const g = globalThis as any;
  if (!g.__onboardingStore) g.__onboardingStore = new Map<string, OnboardingJobs>();
  return g.__onboardingStore as OnboardingStore;
}

export default function InputNameUsername() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and username.');
      return;
    }

    setLoading(true);
    const userKey = username;

    try {
      // 1) Create user
      const createUserPromise = fetch(
        'https://i7ww5qgoa1.execute-api.us-east-1.amazonaws.com/Prod/cc-analytics/create-user',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, external_id: username }),
        }
      );

      // 2) Create SDK token
      const createTokenPromise = fetch(
        'https://i7ww5qgoa1.execute-api.us-east-1.amazonaws.com/Prod/cc-analytics/create-sdk-token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ external_id: username }),
        }
      );

      // 3) Create connection link
      const createLinkPromise = fetch(
        'https://i7ww5qgoa1.execute-api.us-east-1.amazonaws.com/Prod/cc-analytics/create-connection-link',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name, 
            external_id: username, 
            platforms: ['instagram', 'youtube', 'tiktok'],
          }),
        }
      );

      // Cache all 3 promises
      const store = getOnboardingStore();
      store.set(userKey, { createUserPromise, createTokenPromise, createLinkPromise });

      // Navigate to ConnectAccounts using React Navigation
      navigation.navigate("ConnectAccounts" as never, {
        userId: username,
        username,
        name
      } as never);

    } catch (err: any) {
      console.error('Error starting onboarding:', err);
      Alert.alert('Error', err.message || 'Something went wrong while connecting.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Deals" notificationCount={3} />
      <Text style={styles.infoTitle}>Sign Up</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.underlinedInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
          />
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.underlinedInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </View>

      <PrimaryButton
        title={loading ? 'Loading...' : 'Next'}
        onPress={handleNext}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15, backgroundColor: '#000' },
  infoTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'left' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#fff', paddingVertical: 4 },
  underlinedInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 6 },
});

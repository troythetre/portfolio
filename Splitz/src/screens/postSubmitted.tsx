import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';

const DealSubmitted = () => {
  const navigation = useNavigation();

  // Get params the React Navigation way
  const route = useRoute();
  const { userId } = route.params || {};

  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Distribute Content" notificationCount={3} />

        <View style={styles.content}>
          <Ionicons name="checkmark-circle" size={90} color="#fff" style={styles.icon} />
          <Text style={styles.title}>Posted</Text>
          <Text style={styles.subtitle}>We've posted your content!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title="Done" 
            onPress={() => navigation.navigate("MainApp")} 
          />
        </View>

        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: -10, y: 0 }}
          fadeOut
          autoStart={true}
          fallSpeed={3000}
          explosionSpeed={300}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, backgroundColor: '#000' },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  icon: { marginBottom: 20 },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 4,
  },

  buttonContainer: { padding: 20 },
});

export default DealSubmitted;

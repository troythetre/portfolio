import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import React, { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen(): JSX.Element {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Header with notification count */}
      <Header notificationCount={3} showBackButton={false} />

      <View style={styles.content}>
        {/* Text block with spacing between lines */}
        <View style={styles.textContainer}>
          <Text style={styles.line}>Sign up to Earn Up To</Text>
          <Text style={styles.line}>80% of Your Brand</Text>
          <Text style={styles.line}>Deals Up-Front</Text>

          <Text style={styles.subLine}>No fees until you get paid</Text>
          <Text style={styles.subLine}>Takes 2 minutes to qualify</Text>
        </View>

        {/* Get Started button */}
        <PrimaryButton 
          title="Get Started" 
          onPress={() => navigation.navigate("InputNameUsername")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 135, // space between text block and button
  },
  line: {
    fontWeight: '700',
    fontSize: 32,
    color: '#fff',
    marginBottom: 5,
  },
  subLine: {
    fontWeight: '500',
    fontSize: 18,
    color: '#ccc',
    marginTop: 5,
  },
});

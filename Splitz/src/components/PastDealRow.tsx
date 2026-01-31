// PastDealRow.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PastDealRowProps {
  name: string;
  subText: string;
  onPress?: () => void;
}

export default function PastDealRow({ name, subText, onPress }: PastDealRowProps) {
  return (
    <TouchableOpacity style={styles.dealRow} onPress={onPress}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.dealTextContainer}>
        <Text style={styles.dealName}>{name}</Text>
        <Text style={styles.dealSubText}>{subText}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 10, // optional spacing between rows
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 15,
  },
  dealTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dealSubText: {
    color: 'gray',
    fontSize: 13,
    marginTop: 2,
  },
});

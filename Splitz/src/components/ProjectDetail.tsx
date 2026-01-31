import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProjectDetailProps {
  project: { id: string; title: string; owner: string; date: string; type: string };
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{project.title}</Text>
          <View style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>
        </View>

        {/* Content Row */}
        <View style={styles.contentRow}>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt ex eu mauris pharetra, at ultrices libero elementum.
          </Text>
          <View style={styles.imagePlaceholder} />
        </View>

        <Text style={styles.caption}>Published on 2025/04/11 at 3:38 pm</Text>

        {/* Post Analytics */}
        <Text style={styles.subHeader}>Post Analytics</Text>
        <View style={styles.analyticsContainer}>
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsText}>
              View Count  -  {Math.floor(Math.random() * 1000)}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsText}>
              Likes Count  -  {Math.floor(Math.random() * 500)}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.analyticsItem}>
            <Text style={styles.analyticsText}>
              Comment Count  -  {Math.floor(Math.random() * 200)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 80,          // your manual spacing
  },
  container: {
    paddingHorizontal: 15,   // moved padding here
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '600', marginLeft: 12 },
  contentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  paragraph: { flex: 1, color: '#fff', fontSize: 16, marginRight: 12 },
  imagePlaceholder: { width: 120, height: 120, backgroundColor: '#333', borderRadius: 12 },
  subHeader: { color: '#fff', fontSize: 28, fontWeight: '600', marginBottom: 12 },
  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  analyticsContainer: {
    borderWidth: 2,
    borderColor: 'rgba(138, 43, 226, 0.8)',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#111',
  },
  analyticsItem: { paddingVertical: 10 },
  line: { height: 1, backgroundColor: 'white', marginVertical: 4 },
  analyticsText: { color: '#ccc', fontSize: 16 },
  caption: { color: '#888', fontSize: 14, marginBottom: 16, fontStyle: 'italic' },
  notificationWrapper: { position: 'relative', padding: 5 },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  backButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
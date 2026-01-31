import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppStack';

 type Props = {
   onOpenDrafts: () => void;
   onOpenPublished: () => void;
 };

export default function HomeDashboard({ onOpenDrafts, onOpenPublished }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicture} />
          <Text style={styles.welcomeText}>Welcome, John</Text>
          <Text style={styles.emailText}>john@example.com</Text>
        </View>

        {/* Analytics Summary */}
        <View style={styles.analyticsSection}>
          <View style={styles.analyticsHeader}>
            <Text style={styles.sectionTitle}>Analytics Summary</Text>

            {/* <TouchableOpacity 
              style={styles.detailsRow} 
              onPress={() => navigation.navigate('StreamActivity')}
            >
              <Text style={styles.detailsText}>Details</Text>
              <Ionicons name="chevron-forward" size={18} color="#007AFF" />
            </TouchableOpacity> */}
          </View>

          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Views This Month</Text>
              <Text style={styles.analyticsValue}>1,245</Text>
              <View style={styles.analyticsChange}>
                <Ionicons name="arrow-up" size={16} color="#4CAF50" />
                <Text style={styles.changeText}>+4.5% since last month</Text>
              </View>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Followers This Month</Text>
              <Text style={styles.analyticsValue}>326</Text>
              <View style={styles.analyticsChange}>
                <Ionicons name="arrow-up" size={16} color="#4CAF50" />
                <Text style={styles.changeText}>+4.5% since last month</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Projects Section */}
        <View style={styles.projectsRow}>
          <TouchableOpacity 
            style={styles.projectCard}
            onPress={onOpenDrafts}
          >
            <Text style={styles.projectNumber}>8</Text>
            <Text style={styles.projectTitle}>Project Drafts</Text>
            <Text style={styles.projectSubtitle}>View Drafts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.projectCard}
            onPress={onOpenPublished}
          >
            <Text style={styles.projectNumber}>3</Text>
            <Text style={styles.projectTitle}>Posts Published</Text>
            <Text style={styles.projectSubtitle}>View Published</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { paddingHorizontal: 16, paddingTop: 30, paddingBottom: 50 },

  // Profile
  profileSection: { alignItems: 'center', marginBottom: 30 },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    marginBottom: 12,
  },
  welcomeText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  emailText: { fontSize: 14, color: '#aaa', marginTop: 2 },

  // Analytics
  analyticsSection: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  analyticsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#fff' },
  detailsRow: { flexDirection: 'row', alignItems: 'center' },
  detailsText: { color: '#007AFF', fontSize: 14, marginRight: 4 },

  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  analyticsCard: { alignItems: 'flex-start', flex: 1 },
  analyticsLabel: { fontSize: 14, color: 'white', marginBottom: 4, fontWeight: 'bold' },
  analyticsValue: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  analyticsChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeText: { color: '#4CAF50', fontSize: 12 },

  // Projects
  projectsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  projectCard: {
    backgroundColor: '#222', // slightly brighter gray
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    flex: 1,
    alignItems: 'flex-start', // left align
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  projectNumber: { fontSize: 42, fontWeight: '700', color: '#fff', marginBottom: 6 },
  projectTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  projectSubtitle: { fontSize: 16, color: 'white' },
});

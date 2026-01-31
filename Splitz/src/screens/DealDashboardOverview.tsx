import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Drafts from './Drafts';
import Published from './Published';

type DealTab = 'Drafts' | 'Published';

type DealDashboardOverviewProps = {
    selectedTab: DealTab;
    onChangeTab: (tab: DealTab) => void;
};

export default function DealDashboardOverview({
  selectedTab,
  onChangeTab,
}: DealDashboardOverviewProps) {

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Text style={styles.headerTitle}>Projects</Text>

      <View style={styles.tabsContainer}>
        {(['Drafts', 'Published'] as DealTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => onChangeTab(tab as DealTab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === 'Drafts' ? <Drafts /> : <Published />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingHorizontal: 15 },
  headerTitle: { fontSize: 44, fontWeight: '500', color: '#fff' },
  tabsContainer: { flexDirection: 'row', marginVertical: 20, gap: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#fff', backgroundColor: 'transparent' },
  activeTab: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  tabText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  activeTabText: { color: '#000' },
});

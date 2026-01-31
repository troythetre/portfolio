// StreamActivity.tsx
import Header from '@/src/components/Header';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function StreamActivity() {
  const [filter, setFilter] = useState<'24h' | '7d' | '30d'>('7d');

  // Dummy data (you can swap based on `filter` later)
  const data7d = [12000, 24500, 18000, 30000, 21000, 15000, 27500];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const yMax = 50000; // max for scaling bars

  const filterOptions = [
    { label: 'Last 24h', value: '24h' as const },
    { label: '7 Days', value: '7d' as const },
    { label: '30 Days', value: '30d' as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Stream Activity" notificationCount={0} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Analytics Summary */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Analytics Summary</Text>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Views This Month</Text>
              <Text style={styles.analyticsValue}>1,245</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Followers This Month</Text>
              <Text style={styles.analyticsValue}>326</Text>
            </View>
          </View>
        </View>

        {/* Weekly Statistics */}
        <View style={styles.weeklySection}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.sectionTitle}>Weekly Statistics</Text>
            <View style={styles.filterRow}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setFilter(option.value)}
                  style={styles.filterButton}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === option.value && styles.filterActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Simple Bar Chart using Views */}
          <View style={styles.chartCard}>
            {/* Y-axis labels */}
            <View style={styles.yAxis}>
              {[0, 10000, 20000, 30000, 40000, 50000].map((val) => (
                <View key={val} style={styles.yLabelRow}>
                  <Text style={styles.yLabelText}>
                    {val >= 1000 ? `${val / 1000}k` : val}
                  </Text>
                </View>
              ))}
            </View>

            {/* Bars */}
            <View style={styles.chartArea}>
              {/* Horizontal grid lines */}
              {[0, 10000, 20000, 30000, 40000, 50000].map((val) => (
                <View key={val} style={styles.gridLineContainer}>
                  <View style={styles.gridLine} />
                </View>
              ))}

              {/* Bars row */}
              <View style={styles.barsRow}>
                {data7d.map((value, index) => {
                  const heightPct = (value / yMax) * 100;
                  return (
                    <View key={labels[index]} style={styles.barWrapper}>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${heightPct}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.xLabel}>{labels[index]}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 50 },

  analyticsSection: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },

  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  analyticsCard: { alignItems: 'flex-start', flex: 1 },
  analyticsLabel: { fontSize: 14, color: '#aaa', marginBottom: 4 },
  analyticsValue: { fontSize: 22, fontWeight: '700', color: '#fff' },

  weeklySection: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    marginLeft: 12,
  },
  filterText: { color: '#aaa', fontSize: 14 },
  filterActive: { color: '#9b59b6', fontWeight: '600' },

  chartCard: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  yLabelRow: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  yLabelText: {
    color: '#777',
    fontSize: 10,
  },

  chartArea: {
    flex: 1,
    marginLeft: 8,
    height: 180,
  },
  gridLineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    // We'll stack them using transform in a simple way
  },
  gridLine: {
    borderBottomWidth: 1,
    borderColor: '#333',
  },

  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    alignItems: 'center',
    width: 30,
  },
  barTrack: {
    height: 130,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#222',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#9b59b6',
    borderRadius: 8,
  },
  xLabel: {
    marginTop: 6,
    color: '#aaa',
    fontSize: 12,
  },
});
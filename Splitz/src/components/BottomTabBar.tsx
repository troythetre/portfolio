import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
  plusIconSize?: number;
};

export default function BottomTabBar({
  tabs,
  activeTab,
  onTabPress,
  plusIconSize = 50,
}: Props) {
  return (
    <View style={styles.container}>
      {/* LEFT tabs */}
      <View style={styles.sideTabs}>
        {tabs
          .filter((t) => t !== 'Plus')
          .slice(0, 1)
          .map((tab) => {
            const isActive = tab === activeTab;
            const iconName = 'home-outline';
            return (
              <TouchableOpacity key={tab} style={styles.tab} onPress={() => onTabPress(tab)}>
                <Ionicons name={iconName} size={22} color={isActive ? '#fff' : '#888'} />
                <Text style={[styles.label, isActive && styles.labelActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
      </View>

      {/* CENTER Floating Plus Button */}
      <TouchableOpacity
        style={[styles.plusButtonContainer, { left: SCREEN_WIDTH / 2 - 32 }]} // 32 = half button width
        onPress={() => onTabPress('Plus')}
      >
        <View style={styles.plusButton}>
          <Ionicons name="add" size={plusIconSize * 0.6} color="#000" />
        </View>
      </TouchableOpacity>

      {/* RIGHT tabs */}
      <View style={styles.sideTabs}>
        {tabs
          .filter((t) => t !== 'Plus')
          .slice(1, 2)
          .map((tab) => {
            const isActive = tab === activeTab;
            const iconName = 'folder-outline';
            return (
              <TouchableOpacity key={tab} style={styles.tab} onPress={() => onTabPress(tab)}>
                <Ionicons name={iconName} size={22} color={isActive ? '#fff' : '#888'} />
                <Text style={[styles.label, isActive && styles.labelActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  sideTabs: {
    flexDirection: 'row',
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  labelActive: {
    color: '#fff',
    fontWeight: '600',
  },

  /** CENTER FLOATING PLUS */
  plusButtonContainer: {
    position: 'absolute',
    bottom: 18,
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});

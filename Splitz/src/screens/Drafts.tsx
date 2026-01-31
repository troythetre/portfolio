import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppStack';

interface Project {
  id: string;
  title: string;
  owner: string;
  date: string;
  type: string;
  contentType: "Instagram Post" | "Instagram Reel" | "YouTube Video" | "YouTube Short" | "TikTok Video";
  projectName?: string;
}

const draftProjects: Project[] = [
  {
    id: '1',
    title: 'YT Video 9.2.24',
    owner: 'You',
    date: 'Oct 30, 2025',
    type: 'Draft',
    contentType: 'YouTube Video',
    projectName: 'YT Video 9.2.24'
  },
  {
    id: '2',
    title: 'YT Video Brand Deal 3.1',
    owner: 'You',
    date: 'Oct 29, 2025',
    type: 'Draft',
    contentType: 'YouTube Video',
    projectName: 'YT Video Brand Deal 3.1'
  },
];

type DraftsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Drafts() {
  const navigation = useNavigation<DraftsNavigationProp>();

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigation.navigate('DistributeContent', {
        type: item.contentType,
        projectName: item.projectName
      })}
    >
      <View style={styles.imagePlaceholder} />
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectMeta}>{item.owner} • {item.date}</Text>
        <View style={styles.projectLabel}>
          <Text style={styles.projectLabelText}>{item.type}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={draftProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  projectCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  imagePlaceholder: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#333', marginRight: 12 },
  projectInfo: { flex: 1 },
  projectTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  projectMeta: { color: '#aaa', fontSize: 14, marginBottom: 6 },
  projectLabel: { alignSelf: 'flex-start', backgroundColor: '#007AFF', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  projectLabelText: { color: '#fff', fontSize: 12, fontWeight: '500' },
});

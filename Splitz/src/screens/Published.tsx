import ProjectDetail from '@/src/components/ProjectDetail';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Project {
  id: string;
  title: string;
  owner: string;
  date: string;
  type: string;
}

const publishedProjects: Project[] = [
  { id: '3', title: 'YT Video 9.20.24', owner: 'You', date: 'Oct 28, 2025', type: 'Published' },
];

export default function Published() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.projectCard} onPress={() => setSelectedProject(item)}>
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
        data={publishedProjects}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal
        visible={selectedProject !== null}
        animationType="slide"
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </View>
      </Modal>
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

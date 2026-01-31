import PrimaryButton from '@/src/components/PrimaryButton';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

export default function EditTitleDescription({ route, navigation }: any) {
  const { postTitle, postDescription, setPostTitle, setPostDescription } = route.params;

  const [title, setTitle] = useState(postTitle || '');
  const [description, setDescription] = useState(postDescription || '');

  const handleSave = () => {
    setPostTitle(title);
    setPostDescription(description);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Input Title and Description'/>
      <View style={styles.section}>
        <Text style={styles.label}>Post Title</Text>
        <TextInput
          placeholder="Enter title"
          placeholderTextColor="#888"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Enter description"
          placeholderTextColor="#888"
          style={[styles.input, { minHeight: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 20, marginHorizontal: 20 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  section: { marginBottom: 20, paddingHorizontal: 20 },
  label: { color: '#aaa', marginBottom: 6 },
  input: { color: '#fff', fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#555', paddingVertical: 8 },
});

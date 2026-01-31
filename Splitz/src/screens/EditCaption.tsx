import PrimaryButton from '@/src/components/PrimaryButton';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

export default function EditCaption({ route, navigation }: any) {
  const { caption, setCaption } = route.params;
  const [localCaption, setLocalCaption] = useState(caption || '');

  const handleSave = () => {
    setCaption(localCaption);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Edit Caption' />

      <View style={styles.section}>
        <Text style={styles.label}>Caption</Text>
        <TextInput
          placeholder="Write your caption..."
          placeholderTextColor="#888"
          style={[styles.input, { minHeight: 60 }]} // smaller input box
          multiline
          value={localCaption}
          onChangeText={setLocalCaption}
        />
      </View>

      <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 20, marginHorizontal: 20 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  section: { marginBottom: 20, paddingHorizontal: 20 },
  label: { color: '#aaa', marginBottom: 6, fontSize: 16 },
  input: {
    color: '#fff',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingVertical: 8,
  },
});

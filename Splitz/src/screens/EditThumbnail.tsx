import PrimaryButton from '@/src/components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

export default function EditThumbnail({ route, navigation }: any) {
  const { customThumbnailUri, setCustomThumbnailUri } = route.params;
  const [localUri, setLocalUri] = useState(customThumbnailUri);

  const pickThumbnail = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setLocalUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setCustomThumbnailUri(localUri);
    navigation.goBack();
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Thumbnail',
      'Are you sure you want to remove this custom thumbnail?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setLocalUri(null);
            setCustomThumbnailUri(null);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title='Add Thumbnail'/>
      <View style={styles.content}>
        <TouchableOpacity onPress={pickThumbnail} style={styles.uploadButton}>
          <Text style={{ color: '#A259FF' }}>{localUri ? 'Change Thumbnail' : 'Add Thumbnail'}</Text>
        </TouchableOpacity>

        {localUri && <Image source={{ uri: localUri }} style={styles.thumbnail} />}

        <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 20 }} />

        {localUri && (
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Text style={styles.removeText}>Remove Thumbnail</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { paddingHorizontal: 20 },
  uploadButton: { padding: 16, borderWidth: 1, borderColor: '#A259FF', borderRadius: 12, alignItems: 'center' },
  thumbnail: { width: 120, height: 120, borderRadius: 8, marginTop: 20 },
  removeButton: { padding: 16, borderWidth: 1, borderColor: '#ff4d4d', borderRadius: 12, alignItems: 'center', marginTop: 15 },
  removeText: { color: '#ff4d4d', fontSize: 16 },
});

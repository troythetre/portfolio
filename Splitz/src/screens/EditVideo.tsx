import PrimaryButton from '@/src/components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

export default function EditVideo({ route, navigation }: any) {
  const {
    videoUri,
    videoFileName,
    videoDuration,
    setVideoUri,
    setVideoFileName,
    setVideoDuration,
  } = route.params;

  const [localUri, setLocalUri] = useState(videoUri);
  const [localFileName, setLocalFileName] = useState(videoFileName || '');
  const [localDuration, setLocalDuration] = useState(videoDuration);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos
    });

    if (!result.canceled && result.assets.length > 0) {
      const video = result.assets[0];
      const filename = video.fileName ?? video.uri.split('/').pop() ?? 'video.mp4';

      setLocalUri(video.uri);
      setLocalFileName(filename);
      setLocalDuration(video.duration ?? null);

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(video.uri, { time: 1000 });
        setThumbnailUri(uri);
      } catch (err) {
        console.log('Thumbnail error:', err);
      }
    }
  };

  const handleSave = () => {
    if (!localUri) {
      Alert.alert('Missing Video', 'Please select a video first.');
      return;
    }

    setVideoUri(localUri);
    setVideoFileName(localFileName); // auto filename only
    setVideoDuration(localDuration);

    if (route.params.setThumbnailUri) {
      route.params.setThumbnailUri(thumbnailUri ?? null);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Video" />

      <View style={styles.content}>
        <TouchableOpacity onPress={pickVideo} style={styles.uploadButton}>
          <Text style={{ color: '#A259FF' }}>
            {localUri ? 'Change Video' : 'Add Video'}
          </Text>
        </TouchableOpacity>

        {localUri && thumbnailUri && (
          <View style={{ marginTop: 20 }}>
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
            <Text style={{ color: '#fff', marginTop: 6 }}>{localFileName}</Text>
          </View>
        )}

        <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { paddingHorizontal: 20 },
  uploadButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#A259FF',
    borderRadius: 12,
    alignItems: 'center'
  },
  thumbnail: { width: 120, height: 120, borderRadius: 8 },
});

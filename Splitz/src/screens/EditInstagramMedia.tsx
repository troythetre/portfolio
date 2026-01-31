import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableGrid from 'react-native-draggable-grid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditInstagramMedia() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const mediaList = route.params?.mediaList || [];
  const setMediaList = route.params?.setMediaList;

  const [localList, setLocalList] = useState(mediaList);

  const generateVideoThumbnail = async (videoUri: string) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1000,
      });
      return uri;
    } catch (e) {
      console.warn('Failed to generate thumbnail:', e);
      return null;
    }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.9,
    });

    if (!result.canceled) {
      const newFiles = await Promise.all(
        result.assets.map(async (asset) => {
          let thumbnailUri = null;
          if (asset.type === 'video') {
            thumbnailUri = await generateVideoThumbnail(asset.uri);
          }
          return {
            uri: asset.uri,
            type: asset.type,
            thumbnailUri,
            key: `${Date.now()}-${Math.random()}`,
          };
        })
      );

      const updated = [...localList, ...newFiles].slice(0, 10);
      setLocalList(updated);
    }
  };

  const removeItem = (key: string) => {
    const updated = localList.filter((item: any) => item.key !== key);
    setLocalList(updated);
  };

  const handleSave = () => {
    setMediaList(localList);
    navigation.goBack();
  };

  const renderItem = (item: any) => {
    const displayUri = item.type === 'video' && item.thumbnailUri ? item.thumbnailUri : item.uri;

    return (
      <View style={styles.itemWrapper}>
        <Image
          source={{ uri: displayUri }}
          style={styles.media}
          resizeMode="cover"
        />

        {item.type === 'video' && (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={20} color="#fff" />
          </View>
        )}

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeItem(item.key)}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  // Add the "Add" button as a special item
  const gridData = [
    ...localList,
    ...(localList.length < 10 ? [{ key: 'add-button', isAddButton: true }] : []),
  ];

  const renderAddButton = () => (
    <TouchableOpacity style={styles.addBox} onPress={pickMedia}>
      <Ionicons name="add" size={32} color="#fff" />
      <Text style={styles.addText}>Add</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Header title="Instagram Media" />

      <View style={styles.container}>
        <Text style={styles.caption}>Add multiple photos or videos (up to 10)</Text>
        <Text style={styles.hint}>Long press and drag to reorder</Text>

        <DraggableGrid
          numColumns={3}
          data={gridData}
          renderItem={(item: any) => {
            if (item.isAddButton) {
              return renderAddButton();
            }
            return renderItem(item);
          }}
          onDragRelease={(data: any[]) => {
            // Filter out the add button from the data
            const filtered = data.filter((item) => !item.isAddButton);
            setLocalList(filtered);
          }}
          itemHeight={120}
        />
      </View>

      <PrimaryButton
        title="Save"
        onPress={handleSave}
        style={{ position: 'absolute', bottom: 20, alignSelf: 'center', width: '90%' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 10, flex: 1 },
  caption: { color: '#aaa', fontSize: 14, marginBottom: 4 },
  hint: { color: '#888', fontSize: 12, marginBottom: 12, fontStyle: 'italic' },

  itemWrapper: {
    width: 110,
    height: 110,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
  },

  media: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },

  playBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 3,
  },

  addBox: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addText: { color: '#fff', marginTop: 4, fontSize: 13 },
});

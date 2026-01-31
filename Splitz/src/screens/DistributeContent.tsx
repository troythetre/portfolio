import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function DistributeContent() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const contentType = route.params?.type || 'Content';

  const [mediaList, setMediaList] = useState([]);
  const [projectName, setProjectName] = useState(route.params?.projectName || '');

  // Instagram / TikTok / Reels
  const [caption, setCaption] = useState('');

  // YouTube
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [customThumbnailUri, setCustomThumbnailUri] = useState<string | null>(null);

  // Validation
  const isCaptionComplete = caption.trim() !== '';
  const isTitleComplete = postTitle.trim() !== '';
  const isVideoComplete = !!videoUri;
  const isMediaComplete = mediaList.length > 0;

  // Checklist
  let checklist = [];

  if (contentType === "Instagram Post") {
    checklist = [
      { id: '1', title: 'Caption', type: 'text', onPress: () => navigation.navigate('EditCaption', { caption, setCaption }) },
      { id: '2', title: 'Media (Photos/Videos)', type: 'media', onPress: () => navigation.navigate('EditInstagramMedia', { mediaList, setMediaList }) },
    ];
  } else if (contentType === "Instagram Reel" || contentType === "TikTok Video") {
    checklist = [
      { id: '1', title: 'Caption', type: 'text', onPress: () => navigation.navigate('EditCaption', { caption, setCaption }) },
      { id: '2', title: 'Video', type: 'video', onPress: () => navigation.navigate('EditVideo', { videoUri, videoFileName, videoDuration, setVideoUri, setVideoFileName, setVideoDuration, setThumbnailUri }) },
      { id: '3', title: 'Thumbnail (Optional)', type: 'thumbnail', onPress: () => navigation.navigate('EditThumbnail', { customThumbnailUri, setCustomThumbnailUri }) },
    ];
  } else if (contentType === "YouTube Short" || contentType === "YouTube Video") {
    checklist = [
      { id: '1', title: 'Title & Description', type: 'text', onPress: () => navigation.navigate('EditTitleDescription', { postTitle, postDescription, setPostTitle, setPostDescription }) },
      { id: '2', title: 'Video', type: 'video', onPress: () => navigation.navigate('EditVideo', { videoUri, videoFileName, videoDuration, setVideoUri, setVideoFileName, setVideoDuration, setThumbnailUri }) },
      { id: '3', title: 'Thumbnail (Optional)', type: 'thumbnail', onPress: () => navigation.navigate('EditThumbnail', { customThumbnailUri, setCustomThumbnailUri }) },
    ];
  }

  // Form completion
  const isFormComplete =
    !!projectName &&
    (
      (contentType === "Instagram Post" && isCaptionComplete && isMediaComplete) ||
      ((contentType === "Instagram Reel" || contentType === "TikTok Video") && isCaptionComplete && isVideoComplete) ||
      ((contentType === "YouTube Short" || contentType === "YouTube Video") && isTitleComplete && isVideoComplete)
    );

  const handleContinue = () => {
    if (!projectName) return alert('Project name is required.');

    if (contentType === "Instagram Post") {
      if (!caption.trim()) return alert('Caption is required.');
      if (!isMediaComplete) return alert('Please add at least one photo or video.');
    } else if (contentType === "Instagram Reel" || contentType === "TikTok Video") {
      if (!caption.trim()) return alert('Caption is required.');
      if (!isVideoComplete) return alert('Please add a video.');
    } else if (contentType === "YouTube Short" || contentType === "YouTube Video") {
      if (!postTitle.trim()) return alert('Title is required.');
      if (!isVideoComplete) return alert('Please add a video.');
    }

    navigation.navigate('ConfirmContent', {
      projectName,
      caption: (contentType === "Instagram Post" || contentType === "Instagram Reel" || contentType === "TikTok Video") ? caption : null,
      postTitle: (contentType === "YouTube Short" || contentType === "YouTube Video") ? postTitle : null,
      postDescription: (contentType === "YouTube Short" || contentType === "YouTube Video") ? postDescription : null,
      videoUri,
      videoFileName,
      videoDuration,
      thumbnailUri,
      customThumbnailUri,
      setThumbnailUri,
      contentType,
      mediaList,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Header title={`Create ${contentType}`} />

        {/* Project Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Project Name (Internal Use Only)</Text>
          <TextInput
            placeholder="Enter project name"
            placeholderTextColor="#888"
            style={styles.input}
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Checklist */}
        <View style={styles.section}>
          <Text style={styles.distributionTitle}>Distribution Checklist</Text>
          <Text style={styles.distributionCaption}>Tap the arrow to edit each section</Text>

          <LinearGradient colors={['#8A2BE2', '#6A0DAD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientBorder}>
            <View style={styles.checklistContainer}>
              {checklist.map((item, index) => {
                const showRed =
                  item.id === '1'
                    ? (contentType === "Instagram Post" && !isCaptionComplete) ||
                      ((contentType === "Instagram Reel" || contentType === "TikTok Video") && !isCaptionComplete) ||
                      ((contentType === "YouTube Short" || contentType === "YouTube Video") && !isTitleComplete)
                    : (item.type === 'media' && !isMediaComplete) ||
                      (item.title === 'Video' && !isVideoComplete);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.checkItemRow, index !== checklist.length - 1 && styles.rowDivider]}
                    onPress={item.onPress}
                  >
                    <Text style={[styles.checkItemText, showRed && { color: '#ff4d4d' }]}>{item.title}</Text>
                    <Ionicons name="chevron-forward" size={24} color={showRed ? '#ff4d4d' : '#fff'} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!isFormComplete}
          style={{ marginTop: 20, opacity: isFormComplete ? 1 : 0.4 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 25, paddingHorizontal: 20 },
  label: { color: '#aaa', fontSize: 14, marginBottom: 6 },
  input: { color: '#fff', fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#555', paddingVertical: 8 },
  distributionTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  distributionCaption: { fontSize: 14, color: '#aaa', marginBottom: 10 },
  gradientBorder: { borderRadius: 14, padding: 3 },
  checklistContainer: { backgroundColor: 'rgba(30,50,100,0.9)', borderRadius: 11, margin: 1, overflow: 'hidden' },
  checkItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  checkItemText: { color: '#fff', fontSize: 16 },
});

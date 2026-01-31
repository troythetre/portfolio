import Header from '@/src/components/Header';
import PrimaryButton from '@/src/components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmContent({ route, navigation }: any) {
  const {
    projectName,
    caption,
    postTitle,
    postDescription,
    videoUri,
    videoDuration,
    customThumbnailUri,
    thumbnailUri,
    contentType,
    mediaList,
  } = route.params;

  const [showTermsModal, setShowTermsModal] = useState(false);

  const formatDuration = (durationMs: number | null) => {
    if (durationMs == null) return '—';
    const totalSeconds = Math.round(durationMs / 1000); // Convert ms to seconds
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePostContent = () => {
    // Validation
    if (!projectName) {
      Alert.alert('Missing fields', 'Please add a project name.');
      return;
    }

    if (contentType === "Instagram Post") {
      if (!caption || !caption.trim()) {
        Alert.alert('Missing fields', 'Please add a caption.');
        return;
      }
      if (!mediaList || mediaList.length === 0) {
        Alert.alert('Missing fields', 'Please add at least one photo or video.');
        return;
      }
    } else if (contentType === "Instagram Reel" || contentType === "TikTok Video") {
      if (!caption || !caption.trim()) {
        Alert.alert('Missing fields', 'Please add a caption.');
        return;
      }
      if (!videoUri) {
        Alert.alert('Missing fields', 'Please add a video.');
        return;
      }
    } else if (contentType === "YouTube Short" || contentType === "YouTube Video") {
      if (!postTitle || !postTitle.trim()) {
        Alert.alert('Missing fields', 'Please add a title.');
        return;
      }
      if (!videoUri) {
        Alert.alert('Missing fields', 'Please add a video.');
        return;
      }
    }

    setShowTermsModal(true);
  };

  const handleAgreeAndSubmit = () => {
    setShowTermsModal(false);
    navigation.navigate('postSubmitted');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ padding: 20 }}>

        <Header title="Confirm Your Post" />

        <Text style={styles.mainTitle}>Review Your Content</Text>

        {/* Project Name */}
        <Text style={styles.label}>Project Name</Text>
        <Text style={styles.value}>{projectName}</Text>

        {/* Instagram Post */}
        {contentType === "Instagram Post" && (
          <>
            <Text style={styles.label}>Caption</Text>
            <Text style={styles.value}>{caption || "(No caption)"}</Text>

            <Text style={styles.label}>Media</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              {mediaList?.map((m: any, index: number) => {
                const displayUri = m.type === 'video' && m.thumbnailUri ? m.thumbnailUri : m.uri;
                return (
                  <View key={index} style={{ marginRight: 10, position: 'relative' }}>
                    <Image
                      source={{ uri: displayUri }}
                      style={styles.mediaThumb}
                    />
                    {m.type === 'video' && (
                      <View style={styles.videoBadge}>
                        <Ionicons name="play" size={20} color="#fff" />
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Instagram Reel / TikTok Video */}
        {(contentType === "Instagram Reel" || contentType === "TikTok Video") && (
          <>
            <Text style={styles.label}>Caption</Text>
            <Text style={styles.value}>{caption || "(No caption)"}</Text>

            {videoUri && (
              <>
                <Text style={styles.label}>Video</Text>

                <Text style={styles.value}>
                  Duration: {formatDuration(videoDuration)}
                </Text>

                {thumbnailUri && (
                  <View style={{ marginBottom: 15 }}>
                    <Image
                      source={{ uri: thumbnailUri }}
                      style={styles.thumbnail}
                    />
                  </View>
                )}
              </>
            )}

            {customThumbnailUri && (
              <>
                <Text style={styles.label}>Custom Thumbnail</Text>
                <View style={{ marginBottom: 15 }}>
                  <Image
                    source={{ uri: customThumbnailUri }}
                    style={styles.thumbnail}
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* YouTube Short / YouTube Video */}
        {(contentType === "YouTube Short" || contentType === "YouTube Video") && (
          <>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{postTitle}</Text>

            {postDescription ? (
              <>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{postDescription}</Text>
              </>
            ) : null}

            {videoUri && (
              <>
                <Text style={styles.label}>Video</Text>

                <Text style={styles.value}>
                  Duration: {formatDuration(videoDuration)}
                </Text>

                {thumbnailUri && (
                  <View style={{ marginBottom: 15 }}>
                    <Image
                      source={{ uri: thumbnailUri }}
                      style={styles.thumbnail}
                    />
                  </View>
                )}
              </>
            )}

            {customThumbnailUri && (
              <>
                <Text style={styles.label}>Custom Thumbnail</Text>
                <View style={{ marginBottom: 15 }}>
                  <Image
                    source={{ uri: customThumbnailUri }}
                    style={styles.thumbnail}
                  />
                </View>
              </>
            )}
          </>
        )}

        <PrimaryButton title="Submit" onPress={handlePostContent} style={{ marginTop: 30 }} />
      </ScrollView>

      {/* TERMS POPUP MODAL */}
      <Modal animationType="slide" transparent visible={showTermsModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* HEADER */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agree to the terms</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTermsModal(false)}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* CHECKMARK ROWS */}
            <View style={styles.checkRow}>
              <Ionicons name="checkmark-circle" size={22} color="#4da6ff" />
              <Text style={styles.checkText}>
                I confirm that I have all the necessary rights to submit this content for
                distribution
              </Text>
            </View>

            <View style={styles.checkRow}>
              <Ionicons name="checkmark-circle" size={22} color="#4da6ff" />
              <Text style={styles.checkText}>
                I own the specified content and have full rights to receive any and all revenue
                generated from the advertising of this content
              </Text>
            </View>

            <View style={styles.checkRow}>
              <Ionicons name="checkmark-circle" size={22} color="#4da6ff" />
              <Text style={styles.checkText}>
                I have read and agree to the{" "}
                <Text style={styles.agreementLink}>Splitz Distribution Agreement</Text>
              </Text>
            </View>

            {/* POST BUTTON */}
            <PrimaryButton
              title="Agree & Submit"
              onPress={handleAgreeAndSubmit}
              style={{ marginTop: 15, height: 50 }}
            />

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 10,
  },
  label: {
    color: '#aaa',
    marginTop: 20,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  mediaThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  videoBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#111",
    padding: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },

  closeButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "#333",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },

  checkText: {
    color: "#fff",
    fontSize: 18,
    flex: 1,
    lineHeight: 22,
  },

  agreementLink: {
    fontWeight: "700",
    color: "#4da6ff",
  },
});

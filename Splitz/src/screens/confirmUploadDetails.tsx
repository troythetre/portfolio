import Header from "@/src/components/Header";
import PrimaryButton from "@/src/components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmUploadDetails() {
  const navigation = useNavigation();
  const [previouslyPublished, setPreviouslyPublished] = useState<"yes" | "no" | null>(null);
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = () => {
    setShowTermsModal(true);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) setReleaseDate(selectedDate);
    if (Platform.OS === "android") setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header title="Distribute Content" />

        <Text style={styles.mainTitle}>Let's confirm your upload details</Text>

        {/* Previously Published */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Has this work been previously published?</Text>

          <TouchableOpacity style={styles.optionRow} onPress={() => setPreviouslyPublished("yes")}>
            <View style={[styles.circle, previouslyPublished === "yes" && styles.circleSelected]}>
              {previouslyPublished === "yes" && <View style={styles.innerDot} />}
            </View>
            <Text style={styles.optionText}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={() => setPreviouslyPublished("no")}>
            <View style={[styles.circle, previouslyPublished === "no" && styles.circleSelected]}>
              {previouslyPublished === "no" && <View style={styles.innerDot} />}
            </View>
            <Text style={styles.optionText}>No</Text>
          </TouchableOpacity>
        </View>

        {/* Release Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Release Date</Text>
          <Text style={styles.caption}>
            You can increase chance of getting added to playlists by releasing at least 1-week from
            now
          </Text>

          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{releaseDate.toDateString()}</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={releaseDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              minimumDate={new Date()}
              textColor="#ffffff"
            />
          )}
        </View>

        <PrimaryButton title="Post Content" onPress={handleSubmit} style={styles.submitButton} />
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
              title="Post Content"
              onPress={() => navigation.navigate('postSubmitted')}
              style={{ marginTop: 15, height: 50 }}
            />

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000" },
  container: { paddingHorizontal: 20, paddingBottom: 40 },

  mainTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 25,
  },

  section: { marginBottom: 30 },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  caption: { color: "#aaa", fontSize: 14, marginBottom: 12 },

  optionRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  circleSelected: { backgroundColor: "#A259FF", borderColor: "#A259FF" },
  innerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#000" },
  optionText: { color: "#fff", fontSize: 16 },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginTop: 8,
  },
  dateText: { color: "#fff", fontSize: 16 },

  submitButton: { marginTop: 30 },

  // MODAL
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

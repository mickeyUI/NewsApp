import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../config/firebaseConfig";

const CATEGORIES = [
  "Politics",
  "Business",
  "Sports",
  "Health",
  "Entertainment",
  "International",
  "Neutral",
  "Technology",
  "Religion",
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedPreferences.length >= 5) {
      setDisable(true);
    }
    if (selectedPreferences.includes(category)) {
      setSelectedPreferences((prev) =>
        prev.filter((item) => item !== category),
      );
    } else {
      setSelectedPreferences((prev) => [...prev, category]);
    }
  };

  const handleSavePreferences = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }

    if (selectedPreferences.length === 0) {
      Alert.alert(
        "Select Preferences",
        "Please pick at least one category to continue.",
      );
      return;
    }

    setLoading(true);

    try {
      await firestore()
        .collection("users")
        .doc(user.uid)
        .set(
          {
            uid: user.uid,
            email: user.email,
            preferences: selectedPreferences,
            isOnboarded: true,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

      navigation.reset({
        index: 0,
        routes: [{ name: "TabGroup" }],
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Could not save preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Select the topics you want to follow:</Text>

      <View style={styles.chipContainer}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedPreferences.includes(category);
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleCategory(category)}
              disabled={disable}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Pressable
        onPress={() => {
          setSelectedPreferences([]);
          setDisable(false);
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <Text>reset</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSavePreferences}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  chipText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: "#0066cc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

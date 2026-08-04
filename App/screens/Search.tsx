import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    // Prevent empty queries or submitting while already loading
    if (!query.trim() || isLoading) return;

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      // TODO: Replace this timeout with your actual backend fetch call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example backend call:
      // const response = await fetch(`YOUR_API_URL?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      // setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.searchRow}>
          <View style={[styles.inputContainer, isLoading && styles.disabled]}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              editable={!isLoading} // Lock input during search
            />
            {query.length > 0 && !isLoading && (
              <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
                <X color="gray" size={18} strokeWidth={2} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={[styles.searchBtn, isLoading && styles.disabled]}
            onPress={handleSearch}
            disabled={isLoading} // Lock button during search
          >
            {isLoading ? (
              <ActivityIndicator color="gray" size="small" />
            ) : (
              <Search color="gray" size={20} strokeWidth={2} />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#04040444",
  },
  container: {
    backgroundColor: "#ebebeb",
  },
  searchRow: {
    margin: 10,
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "black",
    paddingHorizontal: 15,
  },
  clearBtn: {
    padding: 10,
  },
  searchBtn: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
  },
  disabled: {
    opacity: 0.7,
  },
});

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
  Image,
  Text,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, Eye, BookOpen, Rss } from "lucide-react-native";

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

  type IMGG = {
    url: string;
  };
  const IMGG = ({ url }: IMGG) => {
    if (!url) {
      return;
    }
    return (
      <Image source={{ uri: url }} resizeMode="cover" style={{ height: 200 }} />
    );
  };
  // formatting date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium", // Options: 'short', 'medium', 'long', 'full'
      timeStyle: "short", // Options: 'short', 'medium'
    }).format(date);
  };

  const Posts = ({ post }: { post: any }) => {
    return (
      <View style={styles.PostContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("PostView", { postId: post.id });
          }}
        >
          <IMGG url={post.headerImage} />

          <View style={styles.textContainer}>
            <Text style={{ fontSize: 13, fontWeight: "bold" }}>
              {post.summarizedText}
            </Text>
            <View style={{ height: 35 }}>
              <Text numberOfLines={2} style={{ fontSize: 11 }}>
                {post.originalText}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-start",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Eye color="gray" size={15} strokeWidth={2} />
              <Text style={{ color: "gray", fontSize: 10 }}>{post.views}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <BookOpen color="gray" size={15} strokeWidth={2} />
              <Text style={{ color: "gray", fontSize: 10 }}>{post.read}</Text>
            </View>
            {post.channelSource != "unknown" ? (
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Rss color="gray" size={15} strokeWidth={2} />
                <Text style={{ color: "gray", fontSize: 10 }}>
                  {post.channelSource}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: 10,
            }}
          >
            <Text style={styles.metaData}>{post.channelUsername}</Text>
            <Text style={styles.metaData}>{formatDate(post.scrapedAt)}</Text>
          </View>
          {/* for debuging */}
          {/* <Text>{post.category || "none"}</Text>
          <Text>impo:{post.importance || "none"}</Text>
          <Text>score: {post.score}</Text> */}
        </Pressable>
      </View>
    );
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

        <View style={styles.lstContainer}>
          <FlatList
            data={null}
            renderItem={(item) => <Posts post={item} />}
            keyExtractor={(item) => item.id}
          />
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
    flex: 1,
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
  lstContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  PostContainer: {
    flex: 1,
    backgroundColor: "#ffff",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  metaData: {
    color: "gray",
    fontSize: 10,
  },
});

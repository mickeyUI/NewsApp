import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { incrementUniqueReads } from "../hooks/fireStoreOperations";
import { Repeat, ChevronLeft, Rows } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Manrope_500Medium } from "@expo-google-fonts/manrope";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDoc, doc } from "@react-native-firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function PostView() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { postId } = route.params;
  const [post, setPost] = useState<any>();
  const [content, setContent] = useState("");
  const [lang, setLang] = useState("");

  const [fontsLoaded] = useFonts({
    Manrope_500Medium,
  });

  const loadPost = async () => {
    const querySnapshot = await getDoc(doc(db, "posts", postId));
    if (querySnapshot.exists()) {
      const data = querySnapshot.data();
      setPost(data);
      setContent(data.originalText);
      setLang(data.originalLanguage);
    }
  };

  useEffect(() => {
    loadPost();
    incrementUniqueReads(postId);
  }, []);

  const lastY = useRef(0);
  const [showToolbar, setShowToolbar] = useState(true);

  const handleScroll = (e: any) => {
    const currentY = e.nativeEvent.contentOffset.y;

    if (currentY > lastY.current + 10) {
      // Scrolling down
      setShowToolbar(false);
    } else if (currentY < lastY.current - 10) {
      // Scrolling up
      setShowToolbar(true);
    }

    lastY.current = currentY;
  };

  const changeLang = () => {
    if (lang == "Amh") {
      setContent(post.textEn);
      setLang("En");
    } else {
      setContent(post.textAm);
      setLang("Amh");
    }
  };

  type imagee = {
    image: string;
  };

  const IMG = ({ image }: imagee) => {
    if (!image) {
      return;
    }
    return (
      <Image
        source={{ uri: image }}
        style={{ height: 200, width: "auto", margin: 10, borderRadius: 10 }}
      />
    );
  };

  if (!fontsLoaded || !post) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0606063e" }}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ paddingTop: 20, backgroundColor: "#f9f5f5" }}
      >
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 30 }}>{post.summarizedText}</Text>
        </View>

        <IMG image={post.headerImage} />

        <View style={{ padding: 10 }}>
          <Text style={styles.article}>{content}</Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 40,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        ></View>
      </ScrollView>

      {showToolbar && (
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <ChevronLeft color="white" size={32} strokeWidth={2} />
        </Pressable>
      )}
      {showToolbar && post.textEn && (
        <Pressable onPress={changeLang} style={styles.tools}>
          <Repeat color="white" size={32} strokeWidth={2} />
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  article: {
    fontFamily: "Manrope_500Medium",
    textAlign: "justify",
    fontSize: 15,
    fontWeight: "400",
    color: "#2D2D2D",
    lineHeight: 25,
    letterSpacing: 0.1,
  },
  backButton: {
    position: "absolute",
    bottom: 30,
    left: "5%",
    borderRadius: 12,
    backgroundColor: "#101010c2",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  tools: {
    position: "absolute",
    bottom: 30,
    right: "5%",
    borderRadius: 12,
    backgroundColor: "#101010c2",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  footer: {
    color: "#363535e7",
    fontSize: 12,
  },
});

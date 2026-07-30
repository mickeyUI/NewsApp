import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import { incrementUniqueReads } from "../hooks/fireStoreOperations";
import { Repeat, ChevronLeft, Rows } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function PostView() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { post } = route.params;
  const [content, setContent] = useState(post.originalText);
  const [lang, setLang] = useState(post.originalLanguage);

  useEffect(() => {
    incrementUniqueReads(post.id);
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
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ paddingTop: 30 }}
      >
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 30 }}>{post.summarizedText}</Text>
        </View>

        <IMG image={post.headerImage} />

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, paddingBottom: 10 }}>{content}</Text>
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
      {showToolbar && (
        <Pressable onPress={changeLang} style={styles.tools}>
          <Repeat color="white" size={32} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    bottom: 20,
    left: "5%",
    borderRadius: 12,
    backgroundColor: "#101010c2",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  tools: {
    position: "absolute",
    bottom: 20,
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

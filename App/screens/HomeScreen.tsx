import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
} from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { getFromStorage } from "../hooks/fireStoreOperations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post } from "../config/types";
import { pullFeed, lastDoc } from "../hooks/fireStoreOperations";

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [breakingNews, setBreakingNews] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const loadedProducts = await pullFeed();
        setProducts(loadedProducts);
        // i'm gonna add this later after finishing he core stuff
        // const breakingNewsData: any = loadedProducts.filter( post => post?.isBreaking == true);
        // setBreakingNews(breakingNewsData);
      } catch (error: any) {
        console.error("Native Firestore Error: ", error);
      } finally {
        console.log("recived");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
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

  // Usage output: "Jul 17, 2026, 6:15 PM"

  const Posts = ({ post }: { post: any }) => {
    return (
      <View style={Styles.PostContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("PostView", { post });
          }}
        >
          <IMGG url={post.headerImage} />

          <View style={Styles.textContainer}>
            <Text style={{ fontSize: 13, fontWeight: "bold" }}>
              {post.summarizedText}
            </Text>
            <View style={{ height: 35 }}>
              <Text style={{ fontSize: 11 }}>{post.originalText}</Text>
            </View>
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
            <Text style={Styles.metaData}>{post.channelUsername}</Text>
            <Text style={Styles.metaData}>{formatDate(post.scrapedAt)}</Text>
          </View>
          {/* for debuging */}
          <Text>read: {post.read}</Text>
          <Text>views:{post.views || 0}</Text>
          <Text>{post.category || "none"}</Text>
          <Text>impo:{post.importance || "none"}</Text>
          <Text>score: {post.score}</Text>
        </Pressable>
      </View>
    );
  };

  const BreakingNewsCards = ({ content }: { content: any }) => {
    if (!content) {
      return;
    }
    return (
      <View
        style={{
          height: 150,
          backgroundColor: "gray",
          borderRadius: 30,
          marginVertical: 20,
          opacity: 0.8,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={{ uri: content.headerImage }}
          style={{ flex: 1, padding: 10 }}
        >
          <Text>{content.summarizedText}</Text>
        </ImageBackground>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={Styles.ParentContainer}>
      {/* <ScrollView horizontal={true} style={{ padding: 10, backgroundColor: "", flexDirection: "row", }}>
        <View style={{height: 40,width: 100,marginHorizontal: 5, backgroundColor: "white", borderRadius: 20,  justifyContent: "center", shadowColor: "black", shadowOffset: {width: 0, height: 4,}, shadowOpacity: 0.3, shadowRadius: 6, elevation: 14,}}>
          <Text style={{color: "black", textAlign: "center",}}>Sports</Text>
        </View>
      </ScrollView> */}
      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
            <BreakingNewsCards content={breakingNews[0]} />
            <Text
              style={{
                color: "red",
                fontSize: 30,
                fontWeight: "bold",
                fontFamily: "",
              }}
            >
              Todays News
            </Text>
          </View>
        }
        data={products}
        renderItem={({ item }) => <Posts post={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const Styles = StyleSheet.create({
  ParentContainer: {
    flex: 1,
  },
  PostContainer: {
    flex: 1,
    backgroundColor: "#ffff",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    // shadowColor: "black",
    // shadowOffset: {width: 0, height: 4,},
    //  shadowOpacity: 0.3,
    //  shadowRadius: 6,
    //  elevation: 14
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

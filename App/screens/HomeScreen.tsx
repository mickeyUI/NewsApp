import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation= useNavigation<any>();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getFirestore();
        const productsRef = collection(db, 'posts');
        const snapshot: any = await getDocs(productsRef);
        
        const loadedProducts = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as any;

        setProducts(loadedProducts);
      } catch (error: any) {
        console.error("Native Firestore Error: ", error);
      } finally {
        console.log("recived");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const Posts= ({post}: {post: string}) => (
    <View style={Styles.PostContainer}>
      <View style={Styles.textContainer}>
          <Text style={{ fontSize: 16 }}>
            {post}
          </Text>

      </View>
          <Pressable style={Styles.ReadMoreButton} onPress={() => navigation.navigate("PostView")}>
           <LinearGradient
  colors={['rgba(0, 0, 0, 0)', 'rgb(0, 120, 120)']} 
  start={{ x: 1, y: 0 }}
  end={{ x: 1, y: 0.8 }}
  
  // Fills the entire parent container
  style={StyleSheet.absoluteFillObject} 
/>
            <Text style= {{textAlign: "center", color: "white", opacity: 0.9, fontSize: 18, fontWeight: "bold", marginTop: 40}}>Read More</Text>
          </Pressable>
        </View>
  )
      

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={Styles.ParentContainer}>
      <FlatList 
      data={products}
      renderItem={ ({item}) => <Posts post= {item.summarizedText}/>}
      keyExtractor={item => item.id} />
    </View>
  );
}

const Styles = StyleSheet.create({
  ParentContainer: {
    flex: 1,
    
  },
  PostContainer: {
    flex: 1,
    backgroundColor: "lightblue",
    margin: 10,
    borderRadius: 10,
    
  }, 
  textContainer: {
    flex: 1,
    padding: 10,
    maxHeight: 160,
  
    
  },
  ReadMoreButton: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: "100%",
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
   
  }
})
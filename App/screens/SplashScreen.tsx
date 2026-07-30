import { View, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../config/firebaseConfig";
import { getDoc, doc } from "@react-native-firebase/firestore";

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState();
  const handleAuthStateChange = async (user: any) => {
    setUser(user);
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data()?.isOnboarded) {
        navigation.reset({
          index: 0,
          routes: [{ name: "TabGroup" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "OnBoardingScreen" }],
        });
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "SignupScreen" }],
      });
    }
  };

  useEffect(() => {
    const subscribed = onAuthStateChanged(auth, handleAuthStateChange);
    return subscribed;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        backgroundColor: "#14141d",
      }}
    >
      <View
        style={{
          backgroundColor: "black",
          height: 200,
          width: 200,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100%",
          shadowColor: "white",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 6,
          elevation: 34,
        }}
      >
        <View
          style={{
            overflow: "hidden",
            borderRadius: "100%",
            height: 200,
            width: 200,
          }}
        >
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 25,
          fontWeight: "light",
          width: 200,
          textAlign: "center",
        }}
      >
        Stay Informed with us
      </Text>
    </View>
  );
}

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  PermissionsAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { signOut } from "@react-native-firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { User, Moon, Sun, LogOut, ChevronRight } from "lucide-react-native";

const Profile = () => {
  const navigation = useNavigation<any>();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    const user: any = auth.currentUser;
    if (user) {
      setEmail(user.email);
      setName(user.displayName);
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    navigation.reset({
      index: 0,
      routes: [{ name: "SplashScreen" }],
    });
  };

  const theme = darkMode
    ? {
        background: "#0F172A",
        card: "#1E293B",
        text: "#FFFFFF",
        secondary: "#94A3B8",
        border: "#334155",
      }
    : {
        background: "#F8FAFC",
        card: "#FFFFFF",
        text: "#0F172A",
        secondary: "#64748B",
        border: "#E2E8F0",
      };

  const requestNotificationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert("Permission Granted");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.avatar}>
          <User color="#FFFFFF" size={38} />
        </View>

        {/* <Text style={[styles.name, { color: theme.text }]}>{name}</Text> */}

        <Text style={[styles.email, { color: theme.secondary }]}>{email}</Text>
      </View>

      <View
        style={[
          styles.menu,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        {/* <View style={styles.menuItem}>
          <View style={styles.left}>
            {darkMode ? (
              <Moon color={theme.text} size={20} />
            ) : (
              <Sun color={theme.text} size={20} />
            )}
            <Text style={[styles.menuText, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>

          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View> */}

        <TouchableOpacity onPress={handleSignOut} style={styles.menuItem}>
          <View style={styles.left}>
            <LogOut color="#EF4444" size={20} />
            <Text style={[styles.logoutText]}>Logout</Text>
          </View>

          <ChevronRight color="#64748B" size={18} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={requestNotificationPermission}
          style={styles.menuItem}
        >
          <View>
            <Text>Request Permission</Text>
          </View>

          <ChevronRight color="#64748B" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: 28,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 24,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#101825",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
  },

  email: {
    marginTop: 6,
    fontSize: 15,
  },

  menu: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },

  menuItem: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
  },

  logoutText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
  },
});

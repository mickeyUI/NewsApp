import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  createStaticNavigation,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import Search from "./screens/Search";
import ProfileScreen from "./screens/ProfileScreen";
import PostView from "./screens/PostView";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import SignupScreen from "./screens/SignupScreen";
import { Home, SearchIcon, UserRound } from "lucide-react-native";
import {
  onMessage,
  subscribeToTopic,
  onNotificationOpenedApp,
  getInitialNotification,
} from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";
import { useEffect, createContext } from "react";
import { messaging } from "./config/firebaseConfig";
import { getContext, NotificationProvider } from "./hooks/context";

type RootStackParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  OnBoardingScreen: undefined;
  TabGroup: undefined;
  PostView: {
    postId: string;
  };
};

const TabGroup = createBottomTabNavigator({
  screenOptions: {
    tabBarActiveTintColor: "#2c2b2e",
    tabBarInactiveTintColor: "gray",
    tabBarActiveSize: 20,
    tabBarInactiveSize: 10,
    tabBarShowLabel: true,
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => (
          <Home color={color} size={20} strokeWidth={3} />
        ),
      },
    },
    Search: {
      screen: Search,
      options: {
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => (
          <SearchIcon color={color} size={20} strokeWidth={3} />
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => (
          <UserRound color={color} size={20} strokeWidth={3} />
        ),
      },
    },
  },
});

const Stack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    SplashScreen: {
      screen: SplashScreen,
      options: {
        headerShown: false,
      },
    },
    LoginScreen: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    SignupScreen: {
      screen: SignupScreen,
      options: {
        headerShown: false,
      },
    },
    OnBoardingScreen: {
      screen: OnBoardingScreen,
      options: {
        headerShown: false,
      },
    },
    TabGroup: {
      screen: TabGroup,
      options: {
        headerShown: false,
      },
    },
    PostView: {
      screen: PostView,
      options: {
        headerShown: false,
      },
    },
  },
});

const Navigation = createStaticNavigation(Stack);
function AppContent() {
  const { setPendingPostId } = getContext();
  useEffect(() => {
    // foreground setup
    // const unsubscribeForeground = onMessage(
    //   messaging,
    //   async (remoteMessage) => {
    //     console.log("FOREGROUND:", remoteMessage);

    //     const postId = remoteMessage.data?.postId;

    //     console.log("Post ID:", postId);
    //   },
    // );

    const unsubscribeOpened = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        const postId = remoteMessage.data?.postId;
        console.log("OPENED APP:");
        if (postId) {
          setPendingPostId(postId);
        }
      },
    );

    async function checkInitialNotification() {
      await subscribeToTopic(messaging, "BreakingNews");
      console.log("subscribed");
      const remoteMessage = await getInitialNotification(messaging);

      if (remoteMessage) {
        console.log("CLOSED APP OPEN:");
        const postId = remoteMessage.data?.postId;
        if (postId) {
          setPendingPostId(postId);
        }
      }
    }

    checkInitialNotification();

    // Cleanup listeners
    return () => {
      // unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  return <Navigation />;
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStaticNavigation } from "@react-navigation/native";
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

const Stack = createNativeStackNavigator({
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

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Search from './screens/Search';
import ProfileScreen from './screens/ProfileScreen';
import PostView from './screens/PostView';

const TabGroup = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Search: {
      screen: Search,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
});

const Stack= createNativeStackNavigator({
  screens: {
    TabGroup: {
      screen: TabGroup,
      options: {
        headerShown: false
  },
    },
    PostView: PostView,
  }
});


const Navigation = createStaticNavigation(Stack);

export default function App() {

  return (
    <Navigation/>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

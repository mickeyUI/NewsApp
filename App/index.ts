import { registerRootComponent } from "expo";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { messaging } from "./config/firebaseConfig";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  //   console.log(remoteMessage);
});

registerRootComponent(App);

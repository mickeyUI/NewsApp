import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Main Base Content */}
      <View style={styles.baseCard}>
        <Text>Main Content Layer</Text>
      </View>

      <View style={styles.overlayFloatingBadge}>
        <Text style={styles.badgeText}>New</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     
    width: 200,
    height: 100,
  },
  baseCard: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayFloatingBadge: {
    position: 'absolute', 
    bottom: 0,     
    right: 0,
    backgroundColor: 'red',
    flex: 1,
    width: "100%" ,         
  },
  badgeText: {
    color: 'white',
  }
});
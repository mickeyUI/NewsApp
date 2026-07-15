import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable} from 'react-native';

export default function Search() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style= {{ margin: 10, flex: 1, flexDirection: "row", gap: 5}}>
          <TextInput style= {{backgroundColor: "white", borderRadius: 10, flex: 1}}></TextInput>
          <Pressable style= {{height:40, width: 40,backgroundColor: "white", borderRadius: "100%"}} onPress={() => {console.log("search")}}/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
  }
});
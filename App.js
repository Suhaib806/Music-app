import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import PlaybackBar from "./app/components/playbackbar";

export default function App() {
  return (
    <AudioProvider>
      <View style={styles.container}>
        <NavigationContainer style={styles.navigator}>
          <AppNavigator />
        </NavigationContainer>
        <PlaybackBar  />
      </View>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make sure the container takes the full height of the screen
  },
  navigator: {
    flex: 1, // Make the navigator take up the remaining space
  },
});

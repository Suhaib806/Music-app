import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import PlaybackBar from "./app/components/playbackbar";

export default function App() {
  const navigatorRef = React.createRef();

  return (
    <AudioProvider>
      <View style={styles.container}>
        <NavigationContainer
          ref={navigatorRef}
          style={styles.navigator}
        >
          <AppNavigator />
        </NavigationContainer>
        <PlaybackBar navigation={navigatorRef} />
      </View>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
});

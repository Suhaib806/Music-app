import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import PlaybackBar from "./app/components/playbackbar";

export default function App() {
  const [currentRouteName, setCurrentRouteName] = useState("");
  const navigatorRef = React.createRef();

  const handleStateChange = () => {
    const routeName = navigatorRef.current.getCurrentRoute().name;
    setCurrentRouteName(routeName);
  };

  return (
    <AudioProvider>
      <View style={styles.container}>
        <NavigationContainer
          ref={navigatorRef}
          style={styles.navigator}
          onStateChange={handleStateChange}
        >
          <AppNavigator />
        </NavigationContainer>
        
        {/* Conditionally render PlaybackBar */}
        {currentRouteName !== "AudioDetails" && <PlaybackBar navigation={navigatorRef} />}
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

import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const PlaybackBar = ({ navigation }) => {
  const {
    currentUri,
    isPlaying,
    playSound,
    pauseSound,
    forward,
    backward,
    positionMillis,
    durationMillis,
    seek,
    currentTitle,
    currentimage,
    currentArtist,
    currentTimestamps,
  } = useContext(AudioContext);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSound();
    } else if (currentUri) {
      playSound(currentUri);
    }
  };

  const handleNavigateToDetail = () => {
    if (currentUri) {
      navigation.current.navigate("AudioDetails", {
        item: { title: currentTitle, url: currentUri, artwork: currentimage, artist: currentArtist, timestamps: currentTimestamps },
      });
    }
  };



  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return currentUri ? (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateToDetail}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {currentTitle || "Now Playing"}
          </Text>
          
        </View>
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={backward} disabled={!isPlaying}>
          <FontAwesome name="backward" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={30}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={forward} disabled={!isPlaying}>
          <AntDesign name="forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationMillis / 1000}
          value={positionMillis / 1000}
          onSlidingComplete={(value) => seek(value * 1000)}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#fff"
        />
        <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 49,
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  playPauseButton: {
    marginHorizontal: 20,
  },
  sliderContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    width: "100%",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#fff",
  },
});

export default PlaybackBar;

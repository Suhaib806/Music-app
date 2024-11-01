import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { AudioContext } from "../context/AudioProvider";

const AudioDetails = ({ route }) => {
  const { item } = route.params;
  const {
    playSound,
    pauseSound,
    forward,
    backward,
    currentUri,
    isPlaying,
    durationMillis,
    positionMillis,
    seek,
  } = useContext(AudioContext);

  
  const handlePlayPause = () => {
    if (currentUri === item.url && isPlaying) {
      pauseSound();
    } else {
      playSound(item.url);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSeek = (value) => {
    seek(value * 1000); // Convert slider seconds to milliseconds
  };

  const handleJumpToTime = (time) => {
    const [minutes, seconds] = time.split(":").map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    seek(timeInSeconds * 1000); // Jump to specified time in milliseconds
    if (!isPlaying) {
      playSound(item.url); // Play the sound if it is not already playing
    }
  };

  return (
    <View style={styles.container}>
      {item.artwork ? (
        <View style={styles.artworkContainer}>
          <Image source={{ uri: item.artwork }} style={styles.artwork} />
        </View>
      ) : null}

      <ScrollView
        style={[styles.scrollView, { flexGrow: 1 }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist || "Unknown Artist"}</Text>

          <View style={styles.jumpTimesContainer}>
            {item.timestamps && item.timestamps.length > 0 ? (
              item.timestamps.map((timestamp, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleJumpToTime(timestamp.time)}
                >
                  <View style={styles.jumpTimeWrapper}>
                    <Text style={styles.jumpTimeText}>
                      {timestamp.time}
                    </Text>
                    <Text style={styles.descriptionText}>{timestamp.label}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noTimestampsText}>No timestamps available</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom fixed component */}
      <View style={styles.bottomFixed}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={durationMillis / 1000}
            value={positionMillis / 1000}
            onSlidingComplete={(value) => handleSeek(value)} // Update only after user releases
            minimumTrackTintColor="#333"
            maximumTrackTintColor="#ccc"
            thumbTintColor="#333"
          />
          <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={backward} disabled={!isPlaying}>
            <FontAwesome name="backward" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPause} disabled={!currentUri}>
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              size={40}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={forward} disabled={!isPlaying}>
            <AntDesign name="forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  artworkContainer: {
    marginTop: 40,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    paddingBottom: 200,
  },
  detailsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  artist: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  jumpTimesContainer: {
    width: "100%",
    marginTop: 20,
  },
  jumpTimeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  jumpTimeText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  progressContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
   noTimestampsText: {
    textAlign: "center",
    color: "#999",
    padding: 10,
  },
  controlsContainer: {
    width: "100%",
    marginTop: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  bottomFixed: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    elevation: 2,
    zIndex: 100,
  },
});

export default AudioDetails;

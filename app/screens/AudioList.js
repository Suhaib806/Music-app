import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { Entypo } from "@expo/vector-icons";
import OptionModal from "../components/OptionModal";
import PlaybackBar from "../components/playbackbar";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
      currentItem: {},
    };
  }

  toggleOptionModal = (item) => {
    this.setState((prevState) => ({
      optionModalVisible: !prevState.optionModalVisible,
      currentItem: item,
    }));
  };

  handlePlayAndNavigate = () => {
    const { playSound } = this.context;
    const { currentItem } = this.state;

    playSound(currentItem.url);
    
    // Navigate after starting playback
    this.props.navigation.navigate('AudioDetails', {
      item: currentItem
    });

    // Close the option modal
    this.setState({ optionModalVisible: false });
  };

  handleNavigateToDetail = (item) => {
    const { playSound } = this.context;

    // Start playback before navigating
    playSound(item.url);

    // Navigate directly to the detail page
    this.props.navigation.navigate('AudioDetails', {
      item: item
    });
  };

  render() {
    const { audioFiles, currentUri, isPlaying } = this.context;

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {audioFiles.map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => this.handleNavigateToDetail(item)}>
              <View style={styles.songContainer}>
                {item.artwork && (
                  <Image source={{ uri: item.artwork }} style={styles.artwork} />
                )}
                <View style={styles.songDetails}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.artist && <Text style={styles.artist}>{item.artist}</Text>}
                </View>

                <TouchableOpacity onPress={() => this.toggleOptionModal(item)}>
                  <Entypo
                    name="dots-three-vertical"
                    size={18}
                    color="#333"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
        
        <OptionModal
          OnPlayPress={() => this.handlePlayAndNavigate()}
          onPlayListPress={() => console.log("Playlist Pressed")}
          currentItem={this.state.currentItem}
          onClose={() => this.setState({ optionModalVisible: false })}
          visible={this.state.optionModalVisible}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use flex to allow the container to take up full height
  },
  scrollViewContent: {
    padding: 10,
    paddingBottom: 100, // Ensures enough space for content above the PlaybackBar
  },
  songContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  songDetails: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
    color: "#666",
  },
  icon: {
    
    borderRadius: 100,
    padding: 4,
  },
});

export default AudioList;

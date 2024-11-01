import React, { Component, createContext } from "react";
import { Audio } from "expo-av";
import PlaybackBar from "../components/playbackbar";

const libraryData = require("../../assets/data/library.json");

export const AudioContext = createContext();

class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      currentSound: null,
      isPlaying: false,
      isLoading: false,
      error: null,
      currentUri: '',
      durationMillis: 0,
      positionMillis: 0,
    };
    this.soundRef = new Audio.Sound();
    this.updateInterval = null;
  }

  componentDidMount() {
    this.setState({ audioFiles: libraryData });
  }

  // componentWillUnmount() {
  //   this.cleanupAudio();
  //   clearInterval(this.updateInterval);
  // }

  playSound = async (uri) => {
    if (this.state.isLoading || !uri) return;

    try {
      // If the same sound is requested, just play it
      if (this.state.currentUri === uri) {
        if (this.state.isPlaying) {
          return; // Already playing, so do nothing
        }
        await this.soundRef.playAsync(); // Resume playback
        this.setState({ isPlaying: true });
        this.startUpdatingProgress();
        return;
      }

      // Clean up the previous sound if a different sound is requested
      await this.cleanupAudio();
      this.setState({ isLoading: true });

      // Load the new sound
      await this.soundRef.loadAsync({ uri }, { shouldPlay: false });

      // Set the position if resuming from a pause
      if (!this.state.isPlaying) {
        await this.soundRef.setPositionAsync(this.state.positionMillis);
      }

      // Play the sound
      await this.soundRef.playAsync();

      // Update the state
      this.setState({
        currentSound: uri,
        isPlaying: true,
        isLoading: false,
        currentUri: uri,
        durationMillis: (await this.soundRef.getStatusAsync()).durationMillis,
      });

      this.startUpdatingProgress();
    } catch (error) {
      console.error("Error playing sound:", error);
      this.setState({ error: "Failed to play audio", isLoading: false });
    }
  };

  pauseSound = async () => {
    if (this.state.currentSound && this.state.isPlaying) {
      await this.soundRef.pauseAsync();
      const status = await this.soundRef.getStatusAsync(); // Get the current position
      this.setState({ isPlaying: false, positionMillis: status.positionMillis }); // Update positionMillis on pause
      clearInterval(this.updateInterval);
    }
  };

  forward = async () => {
    const newPosition = this.state.positionMillis + 10000; // 10 seconds forward
    await this.soundRef.setPositionAsync(newPosition);
    this.setState({ positionMillis: newPosition });
  };

  backward = async () => {
    const newPosition = Math.max(this.state.positionMillis - 10000, 0); // 10 seconds backward
    await this.soundRef.setPositionAsync(newPosition);
    this.setState({ positionMillis: newPosition });
  };

  // PlayNext = async () => {
  //   const { audioFiles, currentUri } = this.state;
  //   const currentIndex = audioFiles.findIndex(audio => audio.url === currentUri);

  //   if (currentIndex >= 0 && currentIndex < audioFiles.length - 1) {
  //     const nextAudio = audioFiles[currentIndex + 1];
  //     await this.playSound(nextAudio.url, nextAudio); // Pass next audio metadata
  //   }
  // };

  // // Play previous method
  // PlayPrevious = async () => {
  //   const { audioFiles, currentUri } = this.state;
  //   const currentIndex = audioFiles.findIndex(audio => audio.url === currentUri);

  //   if (currentIndex > 0) {
  //     const previousAudio = audioFiles[currentIndex - 1];
  //     await this.playSound(previousAudio.url, previousAudio); // Pass previous audio metadata
  //   }
  // };

  seek = async (position) => {
    await this.soundRef.setPositionAsync(position);
    this.setState({ positionMillis: position });
  };

  updatePositionMillis = async () => {
    const status = await this.soundRef.getStatusAsync();
    if (status.isLoaded) {
      this.setState({ positionMillis: status.positionMillis });
    }
  };

  startUpdatingProgress = () => {
    this.updateInterval = setInterval(this.updatePositionMillis, 1000); // Update position every second
  };

  cleanupAudio = async () => {
    if (this.state.currentSound) {
      await this.pauseSound();
      await this.soundRef.unloadAsync();
      this.setState({ 
        currentSound: null, 
        isPlaying: false, 
        currentUri: '', 
        durationMillis: 0, 
        positionMillis: 0 
      });
    }
  };

  render() {
    return (
      
      <AudioContext.Provider value={{
        audioFiles: this.state.audioFiles,
        playSound: this.playSound,
        pauseSound: this.pauseSound,
        forward: this.forward,
        backward: this.backward,
        currentSound: this.state.currentSound,
        isPlaying: this.state.isPlaying,
        isLoading: this.state.isLoading,
        error: this.state.error,
        currentUri: this.state.currentUri,
        durationMillis: this.state.durationMillis,
        positionMillis: this.state.positionMillis,
        cleanupAudio: this.cleanupAudio,
        seek: this.seek,
      }}>
        {this.props.children}
    
      </AudioContext.Provider>
      
    );
  }
}

export default AudioProvider;

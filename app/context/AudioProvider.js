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
      currentTitle: '',
      durationMillis: 0,
      positionMillis: 0,
      currentimage:'',
      currentArtist: '',
      currentTimestamps: [],
    };
    this.soundRef = new Audio.Sound();
    this.updateInterval = null;
  }

  componentDidMount() {
    this.setState({ audioFiles: libraryData });
  }

  playSound = async (uri) => {
    if (this.state.isLoading || !uri) return;
  
    try {
      // Find the audio file with matching URI to get its title and artwork
      const audioFile = this.state.audioFiles.find(file => file.url === uri);
      const title = audioFile?.title || 'Now Playing';
      const artist = audioFile?.artist || 'Unknown Artist';
      const timestamps = audioFile?.timestamps || [];
      const image = audioFile?.artwork;


      if (this.state.currentUri === uri) {
        if (this.state.isPlaying) {
          return; // Already playing, so do nothing
        }
        await this.soundRef.playAsync(); // Resume playback
        this.setState({ isPlaying: true, currentTitle: title });
        this.startUpdatingProgress();
        return;
      }
  
      await this.cleanupAudio();
      this.setState({ isLoading: true });
  
      await this.soundRef.loadAsync({ uri }, { shouldPlay: false });
      if (!this.state.isPlaying) {
        await this.soundRef.setPositionAsync(this.state.positionMillis);
      }
  
      await this.soundRef.playAsync();
  
      this.setState({
        currentSound: uri,
        isPlaying: true,
        isLoading: false,
        currentUri: uri,
        currentTitle: title,
        currentimage: image,  // Set the artwork URL
        currentArtist: artist,
        currentTimestamps: timestamps,
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
      const status = await this.soundRef.getStatusAsync();
      this.setState({ isPlaying: false, positionMillis: status.positionMillis });
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
    this.updateInterval = setInterval(this.updatePositionMillis, 1000);
  };

  cleanupAudio = async () => {
    if (this.state.currentSound) {
      await this.pauseSound();
      await this.soundRef.unloadAsync();
      this.setState({ 
        currentSound: null, 
        isPlaying: false, 
        currentUri: '', 
        currentTitle: '',
        currentimage:'',
        durationMillis: 0, 
        positionMillis: 0 ,
        currentArtist: '',
        currentTimestamps: [],
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
        currentTitle: this.state.currentTitle,
        durationMillis: this.state.durationMillis,
        positionMillis: this.state.positionMillis,
        cleanupAudio: this.cleanupAudio,
        seek: this.seek,
        currentimage:this.state.currentimage,
        currentArtist: this.state.currentArtist,
        currentTimestamps: this.state.currentTimestamps,
      }}>
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
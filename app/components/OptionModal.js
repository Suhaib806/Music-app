import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const OptionModal = ({ visible, currentItem, onClose,OnPlayPress,onPlayListPress }) => {
  const { title } = currentItem;
  return (
    <>
      <StatusBar hidden />

      <Modal transparent animationType="slide" visible={visible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.options}>
            <TouchableWithoutFeedback onPress={OnPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={onPlayListPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
  },
  options: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: Colors.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    color: Colors.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.06)",
    justifyContent: "flex-end", // Ensures the modal content aligns at the bottom
  },
});

export default OptionModal;

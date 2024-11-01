import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

const Player = () =>  {
    return (
      <View style={styles.container}> 
      <Text>Player</Text>
       </View>
    ) 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default Player

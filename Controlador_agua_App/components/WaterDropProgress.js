import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const WaterDropProgress = ({ progress }) => {
  return (
    <View style={styles.container}>
      <FontAwesome name="tint" size={70} color="#1e90ff" style={styles.dropIcon} />
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    backgroundColor: 'black',
    borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:50,
  },
  dropIcon: {
    marginLeft: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1e90ff',
  },
});

export default WaterDropProgress;

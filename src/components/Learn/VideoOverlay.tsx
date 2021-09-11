import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const VideoOverlay = () => {
  return (
    <View style={style.container}>
      <View style={style.iconWrapper}>
        <Icon name="play" style={style.playButtonStyle} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 15,
    backgroundColor: '#0006',

    justifyContent: 'center',
    alignContent: 'center',
  },

  iconWrapper: {
    alignSelf: 'center',

    justifyContent: 'center',
    alignContent: 'center',
  },

  playButtonStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
  },
});

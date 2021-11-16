import { widthPercentageToDP } from 'common';
import React, {FC} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const VideoOverlay: FC<{
  loader: boolean;
}> = ({loader}) => {
  return (
    <View style={style.container}>
      <View style={style.iconWrapper}>
        {loader ? (
          <View style={style.indicatorContainer}>
            <ActivityIndicator color="grey" size="large" />
          </View>
        ) : (
          <Icon name="play" style={style.playButtonStyle} />
        )}
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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

  indicatorContainer: {
    height: '100%',
    width: widthPercentageToDP('100'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

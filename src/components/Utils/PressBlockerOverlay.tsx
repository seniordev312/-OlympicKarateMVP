import {accentColorDisabled} from 'common';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

export const PressBlockerOverlay: FC = ({children}) => {
  return (
    <View style={style.container} pointerEvents={'none'}>
      {children}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 2,
    height: '100%',
    width: '100%',

    backgroundColor: accentColorDisabled,
    // backgroundColor: 'red',

    display: 'none',

    flexDirection: 'column-reverse',
  },
});

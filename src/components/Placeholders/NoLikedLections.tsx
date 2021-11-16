import {accentColor} from '@common';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type NoLikedLectionsProps = {
  message: string;
  customStyle?: {
    messageWrapperStyle?: Record<string, any>;
    messageStyle?: Record<string, any>;
  };
};
export const NoLikedLections: FC<NoLikedLectionsProps> = ({
  message,
  customStyle,
}) => {
  return (
    <View style={customStyle?.messageWrapperStyle || style.messageWrapperStyle}>
      <Text style={customStyle?.messageStyle || style.messageStyle}>
        {message}
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  messageWrapperStyle: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: '70%',
    backgroundColor: 'transparent',
  },
  messageStyle: {
    fontSize: 24,
    fontWeight: '300',

    letterSpacing: 1.2,
    color: accentColor,
  },
});

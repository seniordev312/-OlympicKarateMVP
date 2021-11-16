import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type HeaderProps = {
  title: string;
  icon: React.ReactNode;
  headerStyle?: Record<string, unknown>;
  titleStyle?: Record<string, unknown>;
  fontStyle?: Record<string, unknown>;
  leftButton?: {onPress: () => void; component: React.ReactNode};
};
export const Header: FC<HeaderProps> = ({
  title,
  icon,
  headerStyle,
  titleStyle,
  leftButton,
}) => {
  return (
    <View style={headerStyle || style.header}>
      <View style={style.item}>
        {leftButton && (
          <TouchableOpacity
            style={style.iconWrapper}
            onPress={leftButton.onPress}>
            {leftButton.component}
          </TouchableOpacity>
        )}
      </View>
      <View style={titleStyle || style.item4x}>
        <Text style={style.fontStyle}>{title}</Text>
      </View>
      <View style={style.favorites}>
        <View style={style.favoriteIconWrapper}>{icon}</View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  fontStyle: {
    alignSelf: 'center',
    fontWeight: 'bold',
    textAlign: 'center',

    fontSize: 16,
    letterSpacing: -0.4,
    fontFamily: 'SFUIText-Italic',
  },
  item: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  item4x: {flex: 4, alignSelf: 'center', justifyContent: 'center'},
  iconWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    height: '100%',
    // paddingLeft: 20,
    // backgroundColor: 'blue',
    // borderColor: 'red',
    // borderWidth: 1,
    paddingVertical: '5%',
  },
  favorites: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',

    // paddingRight: 40,
    // justifyContent: 'center',
    // marginLeft: 60,
  },
  favoriteIconWrapper: {
    height: '100%',
    // marginRight: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: 'red',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 60,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'white',
    color: 'black',
  },
});

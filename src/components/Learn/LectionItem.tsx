import {accentColor, EMPTY_FN, getThumbnailLink, makeSource} from '@common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@routes';
import React, {FC, useState, useEffect} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Favorites} from './Favorites';
import Lock from './Lock';

type LectionProps = {
  id: string;
  thumbnail?: string;
  title: string;
  duration: string;
  locked?: boolean;
  isFavorite: boolean;
  url: string;

  onFavoritePress?: (event: GestureResponderEvent) => void;
};
export const LectionItem: FC<LectionProps> = ({
  id,
  url,
  title,
  duration,
  locked,
  isFavorite,
  onFavoritePress,
}) => {
  const navigator = useNavigation();
  const navigateTo = (route: keyof RootStackNavigation, params: any) =>
    navigator.navigate(route, params);

  const [stdToken, setStdToken] = useState('');
  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => navigateTo('lection', {lectionId: id})}
        disabled={locked}>
        <Image
          style={
            locked ? {...style.thumbnail, ...style.lockedImg} : style.thumbnail
          }
          source={{
            ...makeSource(
              getThumbnailLink(url ?? 'https://via.placeholder.com/150'),
            ),
            priority: Image.priority.high,
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={style.textContainer}
        onPress={() => navigateTo('lection', {lectionId: id})}
        disabled={locked}>
        <View style={style.textWrapper}>
          <Text
            style={locked ? {...style.title, ...style.disabled} : style.title}
            numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={style.textWrapper}>
          <Text style={style.duration}>{duration}</Text>
        </View>
        <View style={style.textWrapper}>
          <Text style={style.points}>+1 $STUD</Text>
        </View>
      </TouchableOpacity>
      <View style={style.right}>
        {locked && (
          <View style={{...style.lockWrapper, ...style.zIndex100}}>
            <Lock />
          </View>
        )}
        {!locked && (
          <Favorites
            fill={isFavorite ? 'red' : '#DDDDDD'}
            onPress={onFavoritePress || EMPTY_FN}
            wrapperStyle={style.lockWrapper}
            iconName={'heart'}>
            {/* <Icon
              name="unlock"
              size={12}
              color={'black'}
              style={style.unlockIcon}
            /> */}
          </Favorites>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  disabled: {color: accentColor},
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: '3%',
  },
  lockWrapper: {
    paddingHorizontal: '25%',
    paddingVertical: '5%',
    borderRadius: 24,

    marginRight: '5%',

    // borderColor: 'green',
    // borderWidth: 1,
  },
  unlockIcon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: '5%',

    // borderColor: 'red',
    // borderWidth: 1,
  },
  zIndex100: {zIndex: 100},

  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',

    alignContent: 'center',
    justifyContent: 'center',

    // borderColor: 'red',
    // borderWidth: 1,

    // paddingHorizontal: 10,
  },
  thumbnail: {
    flex: 1,

    height: 86,
    maxHeight: 86,
    width: 86,
    maxWidth: 86,
    borderRadius: 16,
  },
  lockedImg: {
    opacity: 0.4,
  },

  textContainer: {
    flex: 2,
    flexDirection: 'column',
    padding: '1%',
  },

  textWrapper: {
    // flex: 2,
    // flexDirection: 'row',
    // alignContent: 'space-between',

    marginHorizontal: '5%',
    paddingTop: '1%',

    // minHeight: 100,

    // borderColor: 'red',
    // borderWidth: 1,
  },
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 23,

    flexShrink: 1,
    flexWrap: 'wrap',
  },
  duration: {
    marginTop: '2%',

    color: accentColor,
    fontSize: 14,
    lineHeight: 24,
  },
  points: {
    marginTop: '2%',
    color: accentColor,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 24,
  },
});

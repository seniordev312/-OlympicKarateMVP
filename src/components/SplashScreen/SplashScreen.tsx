import {BASE_URL, makeSource} from '@common';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Image from 'react-native-fast-image';
import {OlympicKarate} from './OlympicKarate';
import {PoweredBy} from './PoweredBy';
import * as Animatable from 'react-native-animatable';
import {useNavigation, StackActions} from '@react-navigation/native';

export const SplashScreen: FC = () => {
  const navigation = useNavigation();
  const [isShow, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1500);
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('landing'));
    }, 4000);
  }, []);
  return (
    <View style={style.container}>
      {isShow ? (
        <View style={style.container}>
          <View style={style.upperLogo}>
            <Image style={style.upperLogoImg} source={makeSource(LOGO_1)} />
            <View
              // duration={1500}
              // delay={1000}
              // animation={zoomIn}
              style={style.upperLogoLabel}>
              <OlympicKarate width={110} height={55} />
            </View>
          </View>

          <View style={style.bottomLogo}>
            <View style={style.bottomLogoLabel}>
              <PoweredBy />
            </View>
            <Image style={style.bottomLogoImg} source={makeSource(LOGO_2)} />
          </View>
        </View>
      ) : (
        <View
          // duration={1500}
          // delay={800}
          // animation={zoomOut}
          style={style.upperLogo}>
          <Image style={style.upperLogoImg} source={makeSource(LOGO_1)} />
        </View>
      )}
    </View>
  );
};

const zoomOut = {
  0: {
    opacity: 1,
    scale: 1,
  },
  0.5: {
    opacity: 1,
    scale: 0.3,
  },
  1: {
    opacity: 0,
    scale: 0,
  },
};

const zoomIn = {
  0: {
    opacity: 0,
    scale: 0,
  },
  0.5: {
    opacity: 1,
    scale: 0.3,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const LOGO_1 = `${BASE_URL}/wp-content/uploads/2020/12/olympic-karate-logo-1-1.png`;
const LOGO_2 = `${BASE_URL}/wp-content/uploads/2020/12/studyum-1-2.png`;

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'white',

    // borderColor: 'red',
    // borderWidth: 5,
  },
  upperLogo: {
    // borderColor: 'blue',
    // borderWidth: 1,
    width: '100%',
    minHeight: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  upperLogoLabel: {
    alignSelf: 'center',

    // borderColor: 'red',
    // borderWidth: 1,
  },
  upperLogoImg: {
    height: 80,
    width: 80,
    marginRight: 20,
    marginLeft: 20,
    resizeMode: 'center',
    alignSelf: 'center',
  },
  bottomLogo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // borderColor: 'green',
    // borderWidth: 5,
    width: '100%',
    minHeight: 100,
    flex: 1,
    flexDirection: 'column',
    maxHeight: 2000,
    alignContent: 'center',
    justifyContent: 'center',
  },
  bottomLogoLabel: {
    alignSelf: 'center',
  },
  bottomLogoImg: {
    height: 30,
    width: 110,
    maxWidth: 110,
    marginTop: '2%',
    alignSelf: 'center',
    overflow: 'visible',
    resizeMode: 'center',
  },
});

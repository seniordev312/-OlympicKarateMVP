import {BASE_URL, makeSource} from '@common';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import Image from 'react-native-fast-image';
import {OlympicKarate} from './OlympicKarate';
import {PoweredBy} from './PoweredBy';

export const SplashScreen: FC = () => {
  return (
    <View style={style.container}>
      <View style={style.upperLogo}>
        <Image style={style.upperLogoImg} source={makeSource(LOGO_1)} />
        <View style={style.upperLogoLabel}>
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
  );
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

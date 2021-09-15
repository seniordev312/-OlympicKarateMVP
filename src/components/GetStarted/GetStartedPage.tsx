/* eslint-disable react-native/no-inline-styles */
import {activeColor} from '@common';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigation} from '@routes';
import {translateContext} from '@services/Translations/translate';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Banner} from './Banner';
import {BannerImage} from './types';

const images: BannerImage[] = [
  {
    url: 'https://studumapp.ru/wp-content/uploads/2020/12/load1.png',
    bg_img: 'first',
    title: 'Now you have a chance to have a black belt in karate',
    headingStyle: StyleSheet.create({marginTopStyle: {marginTop: '5%'}})
      .marginTopStyle,
  },
  {
    url: 'https://studumapp.ru/wp-content/uploads/2020/12/load2.png',
    bg_img: 'second',
    title: 'Learn the correct way from the first day from Elite Athletes',
    // 'Learn Karate the correct way from day one with one of the best instructors in the world.',
    headingStyle: StyleSheet.create({marginTopStyle: {marginTop: '5%'}})
      .marginTopStyle,
  },
  {
    getStart: 'Get Started Now',
    url: 'https://studumapp.ru/wp-content/uploads/2020/12/load3.png',
    bg_img: 'third',
    title: 'Get your black belt knowledge certificate and enrich your life',
    // 'Get your black belt certificate for the new Olympic sport of Karate',
    headingStyle: StyleSheet.create({marginTopStyle: {marginTop: '5%'}})
      .marginTopStyle,
  },
];

export const GetStartedPage = () => {
  const {t} = useContext(translateContext);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const navigateTo = (route: keyof RootStackNavigation) => {
    navigation.navigate(route);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0.5,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSliderMove = (value: React.SetStateAction<number>) => {
    setIndex(value);
  };

  return (
    <View // Special animatable View
      style={style.container}>
      <Banner
        page={index}
        customStyle={style.banner}
        images={images}
        handleSlider={handleSliderMove}
      />
      <Animated.View // Special animatable View
        style={{
          ...style.btnGroup,
          opacity: fadeAnim, // Bind opacity to animated value
        }}>
        <TouchableOpacity
          style={[
            style.signupBtn,
            {backgroundColor: index === 2 ? activeColor : 'transparent'},
          ]}
          onPress={() => navigateTo('register')}>
          <Text
            style={[
              style.signupBtnFont,
              {color: index === 2 ? 'white' : 'rgba(0,0,0,0.5)'},
            ]}>
            {index === 2 ? t('getStarted') : t('skip')}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={style.loginBtn}
          onPress={() => navigateTo('login')}>
          <Text style={style.loginBtnFont}>{t('signIn')}</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
};

const loginBtnFontColor = '#2f3134';

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',

    // backgroundColor: 'green',
  },

  btnGroup: {
    flex: 0.14,
    flexDirection: 'column',
    // backgroundColor: 'red',
    // paddingVertical: '5%',

    // borderColor: 'red',
    // borderWidth: 1,
  },

  banner: {flex: 0.86},
  bannerItem: {
    height: '100%',
    flexDirection: 'column',
  },

  buttonsContainer: {
    // marginTop: 10,
    // padding: 20,
  },

  signupBtn: {
    paddingVertical: '4.5%',
    paddingHorizontal: '4%',
    marginHorizontal: '10%',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: activeColor,
  },

  signupBtnFont: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '500',
    letterSpacing: -0.3,
    fontFamily: 'SFUIText-Regular', //Regular,Bold
  },

  loginBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,

    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  loginBtnFont: {
    color: loginBtnFontColor,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

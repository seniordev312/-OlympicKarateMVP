/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  activeColor,
  heightPercentageToDP,
  makeSource,
  widthPercentageToDP,
} from '@common';
import React, {FC, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {BannerImage} from './types';

const {width: viewportWidth} = Dimensions.get('window');

export type BannerProps = {
  images: BannerImage[];
  customStyle?: any;
  handleSlider?: any;
  page?: number;
};
export const Banner: FC<BannerProps> = ({
  page,
  images,
  customStyle,
  handleSlider,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = (
    item: {
      url: any;
      bg_img: any;
      title: any;
      imageStyle?: any;
      headingStyle?: any;
      getStart?: any;
    },
    index: number,
  ) => {
    return (
      <View key={index} style={style.item}>
        <ImageBackground
          key={index}
          source={
            item.bg_img === 'first'
              ? require('../../assets/png/images/1_circles.png')
              : item.bg_img === 'second'
              ? require('../../assets/png/images/2_circles.png')
              : require('../../assets/png/images/3_circles.png')
          }
          resizeMode="contain"
          style={style.imageBg}>
          <Image
            key={item.url}
            style={{...style.image, ...(item.imageStyle || {})}}
            resizeMode="contain"
            source={
              item.bg_img === 'first'
                ? require('../../assets/png/images/1_image.png')
                : item.bg_img === 'second'
                ? require('../../assets/png/images/2_image.png')
                : require('../../assets/png/images/3_image.png')
            }
            // source={makeSource(item.url)}
          />
        </ImageBackground>
        <View style={{...style.headingWrapper, ...(item.headingStyle || {})}}>
          <Text style={style.heading}>{item.title}</Text>
        </View>
      </View>
    );
  };

  const swiperCompnent = () => {
    return (
      <Swiper
        index={page || 0}
        loop={false}
        showsButtons={false}
        activeDotColor={'rgba(0,0,0,0.2)'}
        dotStyle={style.dotStyle}
        activeDotStyle={style.activeDotStyle}
        onIndexChanged={index => handleSlider(index)}
        style={style.wrapper}>
        {images.map((item, index) => {
          return <View key={index}>{renderItem(item, index)}</View>;
        })}
      </Swiper>
    );
  };

  return (
    <View style={{...style.container, ...(customStyle || {})}}>
      {swiperCompnent()}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  paginationContainer: {
    marginTop: -heightPercentageToDP('3'),
    // backgroundColor: 'red',
  },

  paginationInactiveDot: {
    width: 5,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 5,
    opacity: 0.2,
    marginHorizontal: '1.5%',
  },
  paginationActiveDot: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    opacity: 0.2,
    marginHorizontal: '1.5%',
  },
  item: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'yellow',
    // marginVertical: '20%',
    // borderColor: 'orange',
    // borderWidth: 1,
    // paddingTop: '10%',
  },

  image: {
    alignSelf: 'center',
    width: widthPercentageToDP('55'),
    height: heightPercentageToDP('45'),
    resizeMode: 'contain',
    // backgroundColor: 'green',
  },

  imageBg: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: widthPercentageToDP('65'),
    height: heightPercentageToDP('55'),
    resizeMode: 'contain',
    marginTop: heightPercentageToDP('5'),
    // backgroundColor: 'green',
  },

  headingWrapper: {
    paddingHorizontal: '5%',
    // paddingBottom: '5%',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    height: heightPercentageToDP('15'),
  },

  heading: {
    fontSize: 27,
    fontFamily: 'SFUIText-Heavy', //Heavy,Bold
    letterSpacing: -0.5,
    lineHeight: 32,
    textAlign: 'center',
    bottom: -5,
  },

  wrapper: {
    // backgroundColor: 'red',
  },
  activeDotStyle: {
    height: 12,
    width: 12,
    borderRadius: 100,
  },
  dotStyle: {
    height: 6,
    width: 6,
    borderRadius: 100,
  },
});

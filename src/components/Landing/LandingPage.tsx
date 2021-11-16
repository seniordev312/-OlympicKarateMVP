import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP, widthPercentageToDP} from 'common';
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LandingPageImage} from './types';

export const LandingPage = () => {
  const navigation = useNavigation();

  setTimeout(() => {
    navigation.navigate('getStarted');
  }, 3000);
  const renderList = () => {
    return (
      <>
        {images.map((item, index) => {
          return (
            <View key={`${item.title}#${index}`} style={styles.cardContainer}>
              <ImageBackground source={item.bgImage} style={styles.bgImg} />
              <Text style={styles.titleStyle}>{item.title}</Text>
              <Image
                source={item.image}
                style={[styles.itemImg, item.imageStyle]}
              />
            </View>
          );
        })}
      </>
    );
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.gridContainer}>{renderList()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  cardContainer: {
    height: heightPercentageToDP('27'),
    width: widthPercentageToDP('32'),
    justifyContent: 'center',
    marginTop: heightPercentageToDP('1'),
    // backgroundColor: 'green',
  },
  bgImg: {
    height: heightPercentageToDP('10'),
    width: widthPercentageToDP('21.5'),
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  itemImg: {
    height: heightPercentageToDP('20'),
    width: widthPercentageToDP('27.5'),
    resizeMode: 'contain',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20,
    bottom: 0,
  },
  titleStyle: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'SFUIText-Regular',
    alignSelf: 'center',
    bottom: -heightPercentageToDP('5.5'),
  },
});

const images: LandingPageImage[] = [
  {
    image: require('../../assets/png/images/children.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'children',
    title: 'for children',
    imageStyle: {left: -8},
  },
  {
    image: require('../../assets/png/images/adults.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'adult',
    title: 'for adults',
    imageStyle: {left: -12},
  },
  {
    image: require('../../assets/png/images/all.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for all levels',
    imageStyle: {left: -2},
  },
  {
    image: require('../../assets/png/images/women.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for women',
    imageStyle: {left: 7},
  },
  {
    image: require('../../assets/png/images/men.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for men',
    imageStyle: {left: -5},
  },
  {
    image: require('../../assets/png/images/parents.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for parents',
    imageStyle: {left: -10},
  },
  {
    image: require('../../assets/png/images/instructor.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for instructors',
    imageStyle: {left: 4},
  },
  {
    image: require('../../assets/png/images/athlets.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for athletes',
    imageStyle: {left: -5},
  },
  {
    image: require('../../assets/png/images/master.png'),
    bgImage: require('../../assets/png/images/bg_circle.png'),
    type: 'all',
    title: 'for masters',
    imageStyle: {left: 5, height: heightPercentageToDP('23'), top: 10},
  },
];

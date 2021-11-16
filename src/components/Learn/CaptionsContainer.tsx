import {Caption} from 'models';
import React, {FC, useEffect, useRef} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';

export const CaptionsContainer: FC<{
  captions: Caption[];
  activeCaption: Caption;
  paused: boolean;
}> = ({captions, activeCaption, paused}) => {
  const wrapperRef = useRef<FlatList>(null);
  useEffect(() => {
    wrapperRef.current?.scrollToItem({
      item: activeCaption,
      animated: true,
      viewPosition: 0.5,
    });
  }, [activeCaption, captions]);

  const renderCaption = (caption: Caption) => {
    return (
      <Animatable.Text
        key={caption.id}
        transition="fontSize"
        easing="ease-in"
        duration={2000}
        delay={1000}
        style={{
          ...style.captions,
          ...(caption === activeCaption ? style.active : {fontSize: 13}),
        }}>
        {caption.text}
      </Animatable.Text>
    );
  };

  return (
    <View style={style.captionsWrapper}>
      <FlatList
        ref={wrapperRef}
        data={captions}
        renderItem={({item}) => renderCaption(item)}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const style = StyleSheet.create({
  captionsWrapper: {
    height: '31%',
    paddingHorizontal: 20,
    alignContent: 'stretch',
    // backgroundColor: 'green',
  },

  captions: {
    color: '#333',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Robot Medium',
    fontWeight: '500',
    letterSpacing: -0.4,
    lineHeight: 23,
    opacity: 0.4,
  },
  active: {
    color: '#333',
    fontWeight: '300',
    fontSize: 18,
    fontFamily: 'Roboto Light',
    opacity: 1,
    zIndex: 5,
    overflow: 'visible',
  },
});

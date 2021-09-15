import {Caption} from 'models';
import React, {FC, useEffect, useRef} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

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
    });
  }, [activeCaption, captions]);

  const renderCaption = (caption: Caption) => {
    return (
      <Text
        key={caption.id}
        style={{
          ...style.captions,
          ...(caption === activeCaption ? style.active : {}),
        }}>
        {caption.text}
      </Text>
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
    height: '35%',
    paddingHorizontal: 20,
    alignContent: 'stretch',
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
    fontFamily: 'Roboto Light',
    opacity: 1,

    zIndex: 5,

    overflow: 'visible',
  },
});

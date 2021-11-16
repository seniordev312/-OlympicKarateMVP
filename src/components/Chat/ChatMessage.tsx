import {accentColor, chatAnswerColor, makeSource} from '@common';
import {MESSAGE_DELAY} from 'components/Learn/common';
import df from 'dateformat';
import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';

type User = {
  profileThumbnail: string;
};
export type Message = {id: string; text: string; user?: User; delay?: number};
export enum Side {
  FROM = 'from',
  TO = 'to',
}
type ChatMessageProps = {
  message: Message;
  side: Side;
  messageAnimationDuration: number;
};

const MSG_TIMESTAMP_FORMAT = 'HH:MM';

export const ChatMessage: FC<ChatMessageProps> = ({
  message,
  side,
  messageAnimationDuration,
}) => {
  const sideStyle = Side.FROM === side ? style.flexStart : style.flexEnd;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useMemo(
    () => new Animated.Value(Side.FROM === side ? 0 : 1),
    [side],
  );
  const animationOptions = useMemo(
    () => ({
      toValue: Side.FROM === side ? 1 : 0,
      duration: messageAnimationDuration,
      delay: message.delay ?? MESSAGE_DELAY,
      easing: Easing.quad,
      useNativeDriver: true,
    }),
    [message.delay, messageAnimationDuration, side],
  );

  const [dimensions, setDimensions] =
    useState<{width: number; height: number}>();

  const outputRangeX = useMemo(
    () =>
      Side.FROM === side
        ? [(dimensions?.width ?? 0) * -1, 0]
        : [0, dimensions?.width ?? 0],
    [dimensions?.width, side],
  );
  const outputRangeY = useMemo(
    () =>
      Side.FROM === side
        ? [(dimensions?.height ?? 0) * 2, 0]
        : [0, dimensions?.height ?? 0],
    [dimensions?.height, side],
  );

  const chatBubbleStyle = useMemo(
    () => ({
      ...style.chatBubble,
      ...sideStyle,
      ...(Side.TO === side ? style.userChatBackgroundStyle : {}),
    }),
    [side, sideStyle],
  );
  const timestampStyle = useMemo(
    () => ({...style.timestamp, ...sideStyle}),
    [sideStyle],
  );

  const formatTimestamp = (timestamp: Date, format: string) =>
    df(timestamp, format);

  useEffect(() => {
    Animated.timing(scaleValue, animationOptions).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: messageAnimationDuration,
      delay: message.delay ?? 0,
      easing: Easing.quad,
      useNativeDriver: true,
    }).start();
  }, [
    animationOptions,
    fadeAnim,
    message.delay,
    messageAnimationDuration,
    scaleValue,
  ]);

  const onLayout = (event: {
    nativeEvent: {layout: {x: any; y: any; height: any; width: any}};
  }) => {
    const {height, width} = event.nativeEvent.layout;
    setDimensions({height, width});
  };

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        ...style.container,
        opacity: fadeAnim,
        transform: [
          {
            translateX: scaleValue.interpolate({
              inputRange: [0, 1],
              outputRange: outputRangeX,
            }),
          },
          {
            translateY: scaleValue.interpolate({
              inputRange: [0, 1],
              outputRange: outputRangeY,
            }),
          },
          {
            scale: fadeAnim.interpolate({
              inputRange: [0.2, 0.35, 0.75, 1.0],
              outputRange: [0, 0.3, 1, 1],
            }),
          },
        ],
      }}>
      <View style={style.row}>
        {Side.FROM === side && (
          <Image
            style={style.avatar}
            source={makeSource(message.user?.profileThumbnail ?? '')}
          />
        )}
        <View style={style.column}>
          <View style={chatBubbleStyle}>
            <Text style={(Side.TO === side && style.userChatFontStyle) || {}}>
              {message.text}
            </Text>
          </View>
          <View>
            <Text style={timestampStyle}>
              {formatTimestamp(new Date(), MSG_TIMESTAMP_FORMAT)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    marginHorizontal: '5%',
    marginVertical: '2%',

    width: '90%',
    height: 'auto',

    paddingHorizontal: '1%',
    paddingVertical: '2%',
    borderRadius: 30,
  },
  avatar: {
    height: 34,
    width: 34,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  column: {
    flexDirection: 'column',
    marginLeft: '5%',
  },
  chatBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,

    maxWidth: '90%',

    backgroundColor: '#f4f5f6',
  },

  timestamp: {
    color: accentColor,
    fontWeight: 'bold',
  },

  flexStart: {borderBottomLeftRadius: 0},
  flexEnd: {
    borderBottomRightRadius: 0,
    marginLeft: '40%',
    width: '60%',
    minWidth: '60%',
    maxWidth: '60%',
    textAlign: 'right',
  },
  userChatBackgroundStyle: {
    backgroundColor: chatAnswerColor,
  },
  userChatFontStyle: {
    color: '#000',
    flexWrap: 'wrap',
  },
});

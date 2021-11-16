import {accentColor, activeColor} from '@common';
import React, {FC} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {convert, isRunning, progressBarWidth, TimeConversions} from './common';

type ControlsProps = {
  showPlayBtn: boolean;
  progress: string;
  currentTime: number;
  duration: number;
  onPlayPress: () => void;
  onRewindPress: () => void;
  onForwardPress: () => void;
  onProgressPress: (
    e:
      | GestureEvent<PanGestureHandlerEventPayload>
      | HandlerStateChangeEvent<TapGestureHandlerEventPayload>
      | HandlerStateChangeEvent<Record<string, unknown>>,
  ) => void;
};

const play = 'play';
const pause = 'pause';
const inputRange = [0, 1];
const rewindBtnOutputRange = ['0deg', '-90deg'];
const forwardBtnOutputRange = ['0deg', '90deg'];

const getRotation = (
  inputRangeValue: Array<number>,
  outputRangeValue: Array<string>,
  duration = 200,
) => {
  const animation = new Animated.Value(0);
  const rotation = animation.interpolate({
    inputRange: inputRangeValue,
    outputRange: outputRangeValue,
  });

  const onPressIn = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }).start();
  };

  return {onPressIn, onPressOut, rotation};
};

export const Controls: FC<ControlsProps> = ({
  showPlayBtn,
  progress,
  currentTime,
  duration,
  onForwardPress,
  onPlayPress,
  onRewindPress,
  onProgressPress,
}) => {
  const rewindBtnRotation = getRotation(inputRange, rewindBtnOutputRange);
  const forwardBtnRotation = getRotation(inputRange, forwardBtnOutputRange);

  const onSingleTapEvent = (
    event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>,
  ) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onProgressPress(event);
    }
  };

  return (
    <View style={style.controlsWrapper}>
      {/* PlayPauseBtn */}
      {/* <TouchableOpacity style={style.playPauseBtn} onPress={onPlayPress}>
        <Icon name={showPlayBtn ? play : pause} style={style.activeBtnFont} />
      </TouchableOpacity> */}
      {/* -- PlayPauseBtn -- */}
      {/* <View style={style.btnGroup}>
        <TouchableOpacity
          style={style.rewindBtn}
          disabled={!isRunning(currentTime, duration)}
          onPress={onRewindPress}
          onPressIn={rewindBtnRotation.onPressIn}
          onPressOut={rewindBtnRotation.onPressOut}>
          <Animated.View
            style={[
              style.rewindBtnIcon,
              {transform: [{rotate: rewindBtnRotation.rotation}]},
            ]}>
            <Rewind
              fill={
                isRunning(currentTime, duration) ? undefined : buttonDisabled
              }
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.forwardBtn}
          disabled={!isRunning(currentTime, duration)}
          onPress={onForwardPress}
          onPressIn={forwardBtnRotation.onPressIn}
          onPressOut={forwardBtnRotation.onPressOut}>
          <Animated.View
            style={[
              style.forwardBtnIcon,
              {transform: [{rotate: forwardBtnRotation.rotation}]},
            ]}>
            <Forward
              fill={
                isRunning(currentTime, duration) ? undefined : buttonDisabled
              }
            />
          </Animated.View>
        </TouchableOpacity>
      </View> */}

      <View style={style.timeRow}>
        <TapGestureHandler
          onHandlerStateChange={onSingleTapEvent}
          enabled={isRunning(currentTime, duration)}>
          <PanGestureHandler
            onEnded={e => onProgressPress(e)}
            enabled={isRunning(currentTime, duration)}>
            <View style={style.progressBarWrapper}>
              <View
                style={{
                  ...style.progressBar,
                  ...(showPlayBtn ? style.whiteBackground : {}),
                }}>
                <View
                  style={{
                    ...style.progress,
                    width: progress,
                  }}>
                  <View style={style.progressIndicator} />
                </View>
              </View>
            </View>
          </PanGestureHandler>
        </TapGestureHandler>
      </View>
      <View style={style.timeRow}>
        <View style={style.timeWrapper}>
          <Text style={style.time}>
            {convert(TimeConversions.S2M, currentTime)}
          </Text>
        </View>
        <View style={style.flex6} />
        <View style={style.timeWrapper}>
          <Text style={style.time}>
            {convert(TimeConversions.S2M, duration - currentTime)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const BUTTON_SCALE_FACTOR = 0.2;
// const FORWARD_REWIND_BUTTON_SCALE_FACTOR_W = 0.07;
// const FORWARD_REWIND_BUTTON_SCALE_FACTOR_H = 0.07 * 0.45;

const style = StyleSheet.create({
  flex6: {flex: 6},

  controlsWrapper: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 0,
    minHeight: 100,
  },

  btnGroup: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '-17%',
    height: 60,

    minWidth: '33%',

    // borderColor: 'green',
    // backgroundColor: 'blue',
    // borderWidth: 0,
    // borderColor: 'transparent',
    padding: 0,
    overflow: 'hidden',

    shadowColor: 'rgb(6, 123, 255)',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.44,
    shadowRadius: 20,

    elevation: 1,
  },

  timeRow: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'center',

    flex: 1,
    marginTop: '-18.5%',
  },
  playPauseBtn: {
    backgroundColor: activeColor,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',

    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * BUTTON_SCALE_FACTOR,
    height: Dimensions.get('window').width * BUTTON_SCALE_FACTOR,
    // padding: 20,
    zIndex: 100,

    shadowColor: 'rgb(6, 123, 255)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 10,
  },
  activeBtnFont: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 40,
  },

  forwardBtn: {
    height: 'auto',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  rewindBtn: {
    height: 'auto',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
  },

  rewindBtnIcon: {
    minHeight: 24,
    minWidth: 24,
    marginRight: 70,
    marginLeft: 40,
    marginVertical: 18,
    resizeMode: 'contain',
    backgroundColor: 'white',

    // width:
    //   Dimensions.get('window').width * FORWARD_REWIND_BUTTON_SCALE_FACTOR_W,
    // height:
    //   Dimensions.get('window').height * FORWARD_REWIND_BUTTON_SCALE_FACTOR_H,
  },
  forwardBtnIcon: {
    minHeight: 24,
    minWidth: 24,
    marginLeft: 70,
    marginRight: 40,
    marginVertical: 18,
    resizeMode: 'contain',
    backgroundColor: 'white',

    // width:
    //   Dimensions.get('window').width * FORWARD_REWIND_BUTTON_SCALE_FACTOR_W,
    // height:
    //   Dimensions.get('window').height * FORWARD_REWIND_BUTTON_SCALE_FACTOR_H,
  },

  progressBarWrapper: {
    marginTop: '10%',
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    // backgroundColor: 'trans',
  },
  progressBar: {
    width: progressBarWidth,

    height: 2,
    backgroundColor: 'rgba(159, 159, 159, 0.2)',
    borderRadius: 10,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 2,

    // borderWidth: 1,
    borderColor: activeColor,
    backgroundColor: activeColor,
  },
  progressIndicator: {
    marginRight: -2,
    marginTop: -2.5,
    height: 8,
    width: 8,

    borderRadius: 4,
    backgroundColor: activeColor,

    shadowColor: 'rgb(6, 123, 255)',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10,

    elevation: 6,
  },

  timeWrapper: {
    // justifyContent: 'center',
    // alignItems: 'center',
    flex: 1,
    minHeight: 30,

    marginTop: '2%',
    overflow: 'visible',
  },
  time: {
    color: accentColor,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 28,

    fontWeight: '100',
  },

  whiteText: {
    color: 'white',
  },
  whiteBackground: {
    backgroundColor: '#fff5',
  },
});

import {accentColor} from 'common';
import {throttle} from 'lodash';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Badge, TouchableRipple} from 'react-native-paper';
import {ToggleContext} from 'store';

type RedirectButton = {
  label: string;
  message: string;
  onPress: () => void;
  timeLeft: number;
  totalTime: number;
  onTimerEnd: () => void;
};

export const RedirectButton: FC<RedirectButton> = ({
  label,
  message,
  onPress,
  timeLeft,
  totalTime,
  onTimerEnd,
}) => {
  const [currentTime, setCurrentTime] = useState(timeLeft);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {togglePaused} = useContext(ToggleContext);
  const active = useMemo(
    () => timeLeft >= totalTime - elapsedTime,
    [elapsedTime, timeLeft, totalTime],
  );

  const tick = useCallback(() => {
    !togglePaused.state && setElapsedTime(elapsed => elapsed + 1);

    console.log(
      'tick - paused:',
      togglePaused.state,
      'active:',
      active,
      `${currentTime}/${timeLeft} (${elapsedTime}/${totalTime})`,
      'timerValue/initialTimerValue (elapsedTime/totalTime)',
    );

    if (!togglePaused.state && active && currentTime > 0) {
      setCurrentTime(current => current - 1);
    }
  }, [
    active,
    currentTime,
    elapsedTime,
    timeLeft,
    togglePaused.state,
    totalTime,
  ]);

  useEffect(() => {
    if (!totalTime || !timeLeft) {
      return;
    }

    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [elapsedTime, tick, timeLeft, totalTime]);

  useEffect(() => {
    if (currentTime === 0) {
      console.log('onTimerEnd called');
      onTimerEnd();
    }
  }, [currentTime, onTimerEnd]);

  useEffect(() => {
    active &&
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
  }, [active, fadeAnim]);

  return active ? (
    <TouchableRipple style={style.button} onPress={throttle(onPress, 1000)}>
      <Animated.View style={{...style.labelWrapper, opacity: fadeAnim}}>
        <View style={style.messageContainer}>
          <Text style={style.label}>{message}</Text>
        </View>
        <View style={style.labelContainer}>
          <Text style={style.label}>{label}</Text>
        </View>
        <Badge size={24} style={style.timeLeftWrapper}>
          {currentTime}
        </Badge>
      </Animated.View>
    </TouchableRipple>
  ) : (
    <View />
  );
};

const style = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',

    zIndex: 5,
    marginHorizontal: '2%',
    marginVertical: '2%',
    minHeight: '10%',
    width: '90%',
    height: 'auto',
    paddingHorizontal: '1%',
    paddingVertical: '4.8%',

    textAlign: 'center',
    backgroundColor: '#F4F5F6',
    borderRadius: 8,
  },

  labelWrapper: {
    flex: 2,
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageContainer: {
    flex: 0.65,
    backgroundColor: 'transparent',
    paddingLeft: '10%',
    justifyContent: 'center',
  },

  timeLeftWrapper: {
    position: 'absolute',
    left: '4%',

    justifyContent: 'center',
    alignContent: 'center',
    // alignSelf: 'center',

    backgroundColor: '#2F3134',
  },

  timeLeftText: {color: '#F4F5F6', fontSize: 14, fontWeight: '300'},

  label: {
    // alignSelf: 'center',
    color: accentColor,

    fontFamily: 'SFUIText-Regular',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.3125,
    bottom: 1,
  },

  labelContainer: {
    flex: 0.25,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
});

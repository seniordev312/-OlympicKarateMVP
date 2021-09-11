import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {
  BackHandler,
  BackPressEventName,
  Platform,
  ToastAndroid,
} from 'react-native';

type DoubleTabToCloseProps = {
  message: string;
  backPressEventName?: BackPressEventName;
  waitForSecondBackEventMs?: number;
};

export const ExecuteOnlyOnAndroid: FC<DoubleTabToCloseProps> = ({
  message,
  backPressEventName,
  waitForSecondBackEventMs,
}) => {
  const [exitApp, setExitApp] = useState(0);

  const backAction = () => {
    setTimeout(() => {
      setExitApp(0);
    }, waitForSecondBackEventMs || 2000); // 2 seconds to tap second-time

    if (exitApp === 0) {
      setExitApp(exitApp + 1);

      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (exitApp === 1) {
      BackHandler.exitApp();
    }
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      backPressEventName,
      backAction,
    );
    return () => backHandler.remove();
  });
  return <></>;
};

export const DoubleTapToClose: FC<DoubleTabToCloseProps> = props => {
  const {message} = props;

  return Platform.OS !== 'ios' ? (
    <ExecuteOnlyOnAndroid
      message={message}
      backPressEventName={'hardwareBackPress'}
    />
  ) : (
    <></>
  );
};

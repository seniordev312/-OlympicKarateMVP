import {Dimensions, PixelRatio} from 'react-native';
// @ts-ignore
import {THUMBNAILS_PATH} from 'react-native-dotenv';
import {LectionProgress, LectionProgressState} from './models';

export const BASE_URL = 'https://studumapp.ru';
export const EMPTY_OBJ = {};
export const MIN_LENGTH_USERNAME = 4;
export const MIN_LENGTH_PWD = 4;
export const ANONYMOUS = 'ANONYMOUS';
export const MAX_NUM_LECTION_ITEMS = 5;

export const VIBRATE_DURATION_MS = 100;

export const activeColorDisabled = '#DD312B33';
export const activeColor = '#DD312B';
export const accentColor = '#9f9f9f';
export const accentColorDisabled = '#ffffff29';
export const accentColorDisabledDarker = '#9f9f9f33';
export const chatAnswerColor = '#e1f7cb';
export const lightColor = '#e9e9e9';

export const DEBOUNCE_INTERVAL = 400;

export const DEFAULT_NUM_SKELETON_ITEMS = 6;
export const TIMING_TIMEOUT = 200;

export const learnProps = {
  courseId: 'olympic_karate',
};

export const FAVORITES_OUTLINED = `${BASE_URL}/wp-content/uploads/2020/12/heart.png`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const EMPTY_FN = (e: unknown) => {};
export const makeSource = (url: string) => ({uri: url});

export const getThumbnailLink = (videoUrl: string, imgExt = 'png') => {
  const parts = videoUrl.split('/');
  const videoName = parts[parts.length - 2];
  return `${THUMBNAILS_PATH}${videoName}.${imgExt}`;
};

export const getLectionNumber = (order: string) =>
  // xxxx-[.*)
  +order.slice(order.indexOf('-') + 1);
export const shouldDisplaySkeleton = (order: string, limit: number) => {
  return getLectionNumber(order) < limit;
};

export const getLectionProgressState = (lectionProgress: LectionProgress) => {
  if (!lectionProgress) {
    return LectionProgressState.NOT_COMPLETED;
  }

  const {lectionWatched, questionAnsweredCorrect} = lectionProgress;

  switch (true) {
    case lectionWatched && questionAnsweredCorrect:
      return LectionProgressState.PASSED;
    case lectionWatched:
      return LectionProgressState.NOT_PASSED;
    default:
      return LectionProgressState.NOT_COMPLETED;
  }
};

export const getMentionMessage = (
  state: LectionProgressState,
  translator: (key: string) => any,
) => {
  switch (state) {
    case LectionProgressState.NOT_PASSED:
      return translator('lectionNotPassed');
    case LectionProgressState.PASSED:
      return translator('lectionPassed');
    default:
      return translator('lectionNotCompleted');
  }
};

export const widthPercentageToDP = (widthPercent: string) => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const heightPercentageToDP = (heightPercent: string) => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const delay = (delay: number, value: any) => {
  let timeout: NodeJS.Timeout | null = null;
  let _reject: ((reason?: any) => void) | null = null;

  const promise = new Promise((resolve, reject) => {
    _reject = reject;
    timeout = setTimeout(resolve, delay, value);
  });

  const cancel = () => {
    if (!timeout) {
      return;
    }

    clearTimeout(timeout);
    timeout = null;
    _reject?.();
    _reject = null;
  };

  return {
    promise,
    cancel,
  };
};

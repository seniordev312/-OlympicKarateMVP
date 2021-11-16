/* eslint-disable no-bitwise */
import {widthPercentageToDP} from '@common';
import {Message} from 'components/Chat/ChatMessage';
import {isEqual} from 'lodash';
import uuid from 'react-native-uuid';
import {Answer, Caption} from '../../models';
import {Lection} from '../../models/lection';

export const INTERVAL_MS = 3000;
export const progressBarWidth = widthPercentageToDP('100');
export const REDIRECT_TIMEOUT = 5000;
export const MESSAGE_DELAY = 2000;
export const MESSAGE_ANIMATION_DURATION = 500;
export const WORDS_PER_MS = 3.5 / 1000;
export const NO_DELAY_LIMIT_PER_MSG_INDEX = 2;

export const DEBOUNCE_INTERVAL = 300;

export const captionAnimation = {
  from: {opacity: 0},
  to: {opacity: 1},
};

export const initialLectionState: Lection = {
  id: '',
  url: '',
  title: '',
  duration: '00:00',
  questions: [],
  captions: [],
  category: '',
  courseId: '',
  lectionNo: 0,
  timings: [],
  order: '1-1',
};

export const isRunning = (currentTime: number, duration: number) => {
  return currentTime > 1 && currentTime < duration - 1;
};

export const normalize = (val: number, min: number, max: number) =>
  Math.abs((val - min) / (max - min));

export enum TimeConversions {
  S2M = 's2m',
  M2S = 'm2s',
  S2H = 's2h',
}

function pad(n: number | string, width: number, z: string) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export const minutesToSeconds = (str: string) => {
  if (!str) {
    return 0;
  }
  const parts = str.split(':');

  return +parts[1] + +parts[0] * 60;
};
export const minutesToMs = (str: string) => {
  if (!str) {
    return 0;
  }
  const parts = str.split(':');

  const ONE_SECOND_IN_MS = 1000;
  const ONE_MINUTE_IN_MS = 60 * ONE_SECOND_IN_MS;

  const minutesMs = +parts[0] * ONE_MINUTE_IN_MS;
  const secondsMs = +parts[1] * ONE_SECOND_IN_MS;

  return minutesMs + secondsMs;
};

export const convert = (direction: string, timestamp: number, sep = ':') => {
  const original = TimeConversions.S2M.split('2');
  const parts = direction.split('2');
  const minuteInSeconds = 60;

  if (isEqual(original, parts)) {
    // ~~ <=> Math.floor but faster
    return `${~~(timestamp / minuteInSeconds)}${sep}${pad(
      ~~(timestamp % minuteInSeconds),
      2,
      '0',
    )}`;
  }
};
const createMessage = (
  text: string,
  user?: {profileThumbnail: string},
  delay?: number,
) => ({id: uuid.v4().toString(), text, user, delay: delay ?? 0} as Message);

export const getGreetingMessages = (
  translator: (key: string) => any,
  user?: {profileThumbnail: string},
) => {
  return [
    createMessage(translator('chatGreetingMsg01'), user),
    createMessage(translator('chatGreetingMsg02'), user, 1 * MESSAGE_DELAY),
    createMessage(translator('chatGreetingMsg03'), user, 2 * MESSAGE_DELAY),
  ];
};
export const getGreetingPositiveMessages = (
  translator: (key: string) => any,
) => {
  return [
    translator('chatGreetingPositiveAnswer01'),
    translator('chatGreetingPositiveAnswer02'),
  ];
};

export const getGreetingAnswers = (translator: (key: string) => any) => {
  const createAnswer = (text: string, isCorrect?: boolean) =>
    ({id: uuid.v4().toString(), text, isCorrect} as Answer);

  return [createAnswer(translator('chatGreetingAnswer01'), true)];
};

export const normalizeTiming = (
  value: number,
  min: number,
  max: number,
  asPercentage?: boolean,
) =>
  asPercentage
    ? Math.ceil(normalize(value + 1, min, max) * 100)
    : normalize(value + 1, min, max);

export const calculateTimeInterval = (
  index: number,
  captions: Caption[],
  callback?: (timeInMs: number) => void,
) => {
  const {start} = captions[index];
  const next = captions?.[index + 1];

  if (!next) {
    return 0;
  }

  const {start: end} = next;
  let differenceInMs = Math.round(minutesToMs(end) - minutesToMs(start));

  // console.log('=========================');
  // console.log('Index', index);
  // console.log('Caption', captions[index]);
  // console.log('Next caption', next);
  // console.log(end, minutesToMs(end), start, minutesToMs(start));
  // console.log('Timeout: ', differenceInMs);

  callback?.(differenceInMs);
  return differenceInMs;
};

import {activeColor, TIMING_TIMEOUT} from '@common';
import {Timing as TimingModel} from 'models';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Circle} from 'react-native-progress';
import {normalizeTiming} from './common';

export const Timing: FC<{
  currentTime: number;
  timings: TimingModel[];
  duration: number;
  style: object;
  paused: boolean;
}> = ({timings, currentTime, duration, paused, style}) => {
  const [start, setStart] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTiming, setCurrentTiming] = useState(0);
  const [end, setEnd] = useState(0);

  const timingsNorm = useMemo(
    () =>
      (timings || []).map(t => ({
        time: normalizeTiming(+t.time, 0, duration, true),
      })),
    [duration, timings],
  );

  // console.log(
  //   'PROGG: 👉',
  //   start,
  //   progress,
  //   normalizeTiming(progress, start ?? 0, end ?? 1),
  //   end,
  // );
  const updateProgress = useCallback(() => {
    if (progress !== end) {
      setProgress(progress + 1);
    }
  }, [end, progress]);

  const loadTiming = useCallback(
    (currentTimeValue: number) => {
      const timeNorm = normalizeTiming(currentTimeValue, 0, duration, true);
      const index = timingsNorm.findIndex(t => +t.time === timeNorm);
      if (index === -1) {
        return;
      }

      const timing = timingsNorm[index];
      const next =
        index + 1 < timingsNorm.length
          ? timingsNorm[index + 1]
          : {time: normalizeTiming(duration, timing.time, duration, true)};

      if (!next) {
        return;
      }

      setStart(timing.time);
      setCurrentTiming(index + 1);
      setProgress(timing.time);
      setEnd(next.time);
    },
    [duration, normalizeTiming, timingsNorm],
  );

  useEffect(() => {
    loadTiming(currentTime);
  }, [currentTime, loadTiming, timings]);

  useEffect(() => {
    if (paused || end <= progress) {
      return;
    }

    const timeoutId = setTimeout(updateProgress, TIMING_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [progress, end, updateProgress, paused, start]);

  return timings && progress > start ? (
    <View style={style}>
      <Circle
        size={45}
        color={activeColor}
        style={styles.circle}
        unfilledColor={'#33333322'}
        thickness={2}
        strokeCap={'round'}
        progress={normalizeTiming(progress, start ?? 0, end ?? 1)}
        formatText={() => (
          <Text style={styles.progressText}>{currentTiming}</Text>
        )}
        showsText
        animated
      />
    </View>
  ) : (
    <></>
  );
};
const styles = StyleSheet.create({
  progressText: {
    color: 'red',
    fontWeight: '300',
    fontFamily: 'Roboto Light',
    fontSize: 16,
  },

  circle: {backgroundColor: 'white', borderRadius: 30},
});

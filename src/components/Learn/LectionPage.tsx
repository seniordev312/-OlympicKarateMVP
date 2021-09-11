/* eslint-disable no-bitwise */
import {
  ANONYMOUS,
  DEBOUNCE_INTERVAL,
  learnProps,
  makeSource,
  VIBRATE_DURATION_MS,
} from '@common';
import {Caption, Lection} from '@models';
import {
  CommonActions,
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
import {RootRouteProps, RootStackNavigation} from '@routes';
import {LectionService, useGetLectionData} from '@services/api';
import {Endpoints, RoutePlaceholders} from '@services/api/types';
import {StorageKeys, StorageService} from '@services/storage';
import {UserContext} from '@store';
import {useToggle} from '@utils/hooks/useToggle';
import {debounce, isEmpty, isObject, throttle} from 'lodash';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  AppStateStatus,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Video, {LoadError, OnLoadData, OnProgressData} from 'react-native-video';
import {CaptionsContainer} from './CaptionsContainer';
import {
  calculateTimeInterval,
  captionAnimation,
  initialLectionState,
  minutesToMs,
  minutesToSeconds,
  progressBarWidth,
} from './common';
import {Controls} from './Controls';
import {Favorites} from './Favorites';
import {Header} from './Header';
import {Timing} from './Timing';
import {VideoOverlay} from './VideoOverlay';

type LectionPageProps = {};

const WATCHED_THRESHOLD = 0.99;
const forwardTimeSeconds = 5;
const rewindTimeSeconds = 5;

const gradientColors = ['#fff', '#fff0'];
// const gradientColors = ['red', 'blue'];
const gradientBreakpoints = [0.3, 0.9];

const gradientColorsReverse = [...gradientColors].reverse();
const gradientBreakpointsReverse = [0.3, 0.9];

export const LectionPage: FC<LectionPageProps> = ({}) => {
  const route = useRoute<RootRouteProps<'lection'>>();
  const navigation = useNavigation();
  const routeIndex = useNavigationState(state => state.index);

  const {user, favorites, setFavorites} = useContext(UserContext);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [captionsIndex, setCaptionsIndex] = useState(0);
  const progressRef = useRef(0);

  const playerRef = useRef<Video>(null);

  const {
    state: paused,
    toggle: togglePlayPause,
    setOff: playVideo,
    setOn: pauseVideo,
  } = useToggle(true);
  const animatableTextRef = useRef(null);
  const [lection, setLection] = useState(initialLectionState);
  const [maxProgress, setMaxProgress] = useState(0);
  const [isWatched, setIsWatched] = useState(false);

  const {data, loading} = useGetLectionData(
    Endpoints.lection.replace(
      RoutePlaceholders.LECTION_ID,
      route.params?.lectionId,
    ),
    {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
      params: {id: route.params?.lectionId},
    },
    [route.params, user.token],
    !!route.params && !isEmpty(route.params) && !!user.token,
  );

  const navigateTo = useCallback(
    (
      routeName: keyof RootStackNavigation,
      options?: Record<string, unknown>,
      replace?: boolean,
    ) => {
      if (replace) {
        const resetAction = CommonActions.reset({
          index: 0,
          // @ts-ignore
          routes: [
            {
              name: 'navbar',
              state: {
                routes: [options],
              },
            },
          ],
        });
        navigation.dispatch(resetAction);
        // React Navigation literally says that key is of type number (ref: https://reactnavigation.org/docs/navigation-prop/#reset)
        // navigation.reset({
        //   index: 0,
        //   // @ts-ignore
        //   routes: [{...(options || {})}],
        // });
      } else {
        navigation.navigate(routeName, options);
      }
    },
    [navigation, routeIndex],
  );

  const updateCaptionsIndex = (time: number) => {
    const index = lection.captions.findIndex(
      ({start, end}) =>
        minutesToSeconds(start) <= time && time <= minutesToSeconds(end),
    );

    if (index === -1) {
      return;
    }

    const a = minutesToSeconds(lection.captions[index].start);
    const b = minutesToSeconds(lection.captions[index].end);

    console.log('CAPTIONS INDEX: ', index, ` ${a} [${time}] ${b}`);
    setCaptionsIndex(index);
  };

  //#region -------------- Video controls --------------
  const onBuffer = () => {
    console.log('BUFFERING...');
    pauseVideo();
  };
  const onError = (error: LoadError) => console.error(error);
  const onEnd = async () => {
    console.log('TOTAL WATCHED: ', progressRef.current);
    console.log(
      progressRef.current >= duration ||
        progressRef.current >= WATCHED_THRESHOLD * duration,
    );
    console.log(duration);
    if (
      progressRef.current >= duration ||
      progressRef.current >= WATCHED_THRESHOLD * duration
    ) {
      handleNavigation(
        'navbar',
        {
          name: 'chat',
          params: {
            questions: lection.questions,
            positiveMessages: lection.positiveMessages ?? [],
            negativeMessages: lection.negativeMessages ?? [],
          },
        },
        true,
      );
    }
  };
  const onProgress = (meta: OnProgressData) => {
    // Reset progress
    if (currentTime === 0) {
      progressRef.current = 0;
    }

    if (meta.currentTime > maxProgress && !isWatched) {
      setMaxProgress(meta.currentTime);
    }

    setCurrentTime(meta.currentTime);
    const diff = Math.abs(meta.currentTime - currentTime);

    // Handle rewind/forward cases
    if (diff <= 1.5) {
      progressRef.current += diff;
    }
  };
  const onLoad = (meta: OnLoadData) => {
    playVideo();
    console.log('VIDEO LOADED...');
    setDuration(meta.duration);
    isWatched && setMaxProgress(meta.duration);
  };
  const onPlayPausePress = throttle(() => {
    if (currentTime === duration) {
      playerRef.current?.seek(0);
    }
    togglePlayPause();
  }, DEBOUNCE_INTERVAL);
  const onRewindPress = throttle(() => {
    let updatedTime = currentTime - rewindTimeSeconds;
    updatedTime = updatedTime > 0 ? updatedTime : 1;

    setCurrentTime(updatedTime);
    playerRef.current?.seek(updatedTime);
    updateCaptionsIndex(updatedTime);
  }, DEBOUNCE_INTERVAL);
  const onForwardPress = throttle(() => {
    let updatedTime = currentTime + forwardTimeSeconds;
    // User can forward until tracked progress - this prevents video skipping
    updatedTime = updatedTime < maxProgress ? updatedTime : maxProgress - 1;

    setCurrentTime(updatedTime);
    playerRef.current?.seek(updatedTime);
    updateCaptionsIndex(updatedTime);
  }, DEBOUNCE_INTERVAL);

  const onProgressPress: (
    e:
      | GestureEvent<PanGestureHandlerEventPayload>
      | HandlerStateChangeEvent<TapGestureHandlerEventPayload>
      | HandlerStateChangeEvent<Record<string, unknown>>,
  ) => void = e => {
    const position = Number(e.nativeEvent?.x) ?? 0;

    let progress = (position / progressBarWidth) * duration;
    progress =
      progress < 0 ? 1 : progress > maxProgress ? maxProgress - 1 : progress;

    // Prevent multiple reenters when the same value was registered
    if (currentTime === progress) {
      return;
    }
    playerRef.current?.seek(progress);
    setCurrentTime(progress);
    updateCaptionsIndex(progress);
  };
  //#endregion ------------------------------------------

  const mapProgressToPercentage = (progress: number, videoDuration: number) =>
    `${Math.floor((progress / videoDuration) * 100)}%`;

  const animateActiveCaptionChange = async () => {
    try {
      // @ts-ignore
      await animatableTextRef?.current?.animate(captionAnimation);
    } catch (error) {
      console.error(error);
    }
  };

  const getId = useCallback(
    () => (user?.id && user?.id?.length > 0 ? user.id : ANONYMOUS),
    [user.id],
  );

  const checkIsWatched = useCallback(
    async (lectionParam: Lection) => {
      const id = getId();
      const currentLection = await StorageService.getStorageValue<Lection>(
        id,
        StorageKeys.CURRENT_LECTION,
      );

      setIsWatched(currentLection?.id !== lectionParam.id);
    },
    [getId],
  );

  const getNextCaption = useCallback(
    async (index: number, captions: Caption[]) => {
      // console.log('oooooooooooooooooo');
      // console.log(new Date());
      // console.log('Getting next caption');
      // console.log(currentTime);
      // console.log(currentTime, minutesToSeconds(captions?.[index]?.start));
      // console.log(index, captions?.[index]);
      // console.log('oooooooooooooooooo');
      if (index + 1 < captions.length) {
        setCaptionsIndex(i => (i + 1) % captions.length);
        await animateActiveCaptionChange();
      }
    },
    [],
  );

  const loadLectionFromStorage = useCallback(async () => {
    const id = getId();
    const lectionData = await StorageService.getStorageValue<Lection>(
      id,
      StorageKeys.CURRENT_LECTION,
    );

    // If no progress has been saved, redirect user to learnPage (all lections)
    if (!lectionData || isEmpty(lectionData)) {
      navigation.navigate('learn', learnProps);
    }

    lectionData && setLection(lectionData);
  }, [getId, navigation]);

  const addToFavorites = useCallback(
    async (id: string) => {
      const newValue = {...favorites, [id]: !favorites[id]};
      setFavorites(newValue);

      if (!user.id) {
        return;
      }

      const userId = user.id;
      const key = StorageKeys.LIKED_LECTIONS;
      await LectionService.like(userId, id, user.token ?? '');

      const oldValue =
        (await StorageService.getStorageValue(userId, key)) ?? {};

      if (oldValue && isObject(oldValue)) {
        const combinedValue: Record<string, boolean> = {
          ...oldValue,
          ...newValue,
        };

        // Map favorites object to likedLections arr
        await StorageService.setStorageValue(userId, key, combinedValue);
        setFavorites(combinedValue);
      }
    },
    [favorites, user.id, user.token],
  );

  const renderFavoritesIcon = useCallback(() => {
    return (
      <Favorites
        height={16}
        width={16}
        onPress={() => {
          Vibration.vibrate(VIBRATE_DURATION_MS);
          addToFavorites(lection.id);
        }}
        fill={favorites?.[lection.id] ? 'red' : 'black'}
        style={style.favorite}
        wrapperStyle={style.wrapperStyle}
        iconName={favorites?.[lection.id] ? 'heart' : 'hearto'}
      />
    );
  }, [addToFavorites, favorites, lection.id]);

  const appState = useRef<AppStateStatus>();
  const onAppStateChange = useCallback(
    (state: AppStateStatus) => {
      switch (state) {
        case 'background':
          pauseVideo();
          break;
        case 'active':
          appState.current === 'background' && playVideo();
          break;
      }

      appState.current = state;
    },
    [pauseVideo, playVideo],
  );

  useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);

    return () => AppState.removeEventListener('change', onAppStateChange);
  }, [onAppStateChange]);

  useEffect(() => {
    if (paused || !lection.captions.length) {
      return;
    }

    const initialOffset =
      captionsIndex === 0 && currentTime === 0
        ? minutesToMs(lection.captions[0].start)
        : 0;

    const timeoutId = setTimeout(
      () => getNextCaption(captionsIndex, lection.captions),
      initialOffset + calculateTimeInterval(captionsIndex, lection.captions),
    );
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    captionsIndex,
    getNextCaption,
    lection.captions,
    lection.captions?.length,
    paused,
  ]);

  useEffect(() => {
    setCaptionsIndex(0);
    data &&
      setLection({...data.lection, captions: data.lection.captions ?? []});

    data && checkIsWatched(data.lection);
  }, [checkIsWatched, data]);

  useEffect(() => {
    getFavoritesFromStorage();

    if (!route.params || isEmpty(route.params) || !route.params.lectionId) {
      loadLectionFromStorage();
    }
  }, [loadLectionFromStorage, route.params]);

  const getFavoritesFromStorage = useCallback(async () => {
    if (!user.id) {
      return;
    }
    const userId = user.id;
    const key = StorageKeys.LIKED_LECTIONS;
    const favoritesFromStorage: Record<string, boolean> =
      (await StorageService.getStorageValue(userId, key)) ?? {};

    setFavorites(favoritesFromStorage);
  }, [setFavorites, user.id]);

  const handleNavigation = async (
    routeName: keyof RootStackNavigation | 'chat',
    options?: Record<string, unknown>,
    replace?: boolean,
  ) => {
    // Lection hasn't been watched before -> update lectionProgress state
    if (!isWatched) {
      const data = await LectionService.updateLearningProgress(
        user.id ?? '',
        {lectionWatched: true, questionAnsweredCorrect: false},
        user.token ?? '',
      );
      console.log(
        'LectionPage ~ handleNavigation ~ Updated learning progress:',
        data,
      );
      navigateTo(routeName, options, replace);
    }
  };

  useEffect(() => {
    const backAction = () => {
      let res = true;

      try {
        navigation.navigate('learn');
      } catch (error) {
        console.error('error during redirection to LEARN');
        res = false;
      }

      return res;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={style.container}>
      <>
        <Header
          title={
            lection?.title
              ? `${lection.order.split('-')[1]}. ${lection.title}`
              : 'Lection'
          }
          icon={renderFavoritesIcon()}
          headerStyle={style.headerStyle}
          leftButton={{
            onPress: () => {
              Vibration.vibrate(VIBRATE_DURATION_MS);
              navigateTo(
                'navbar',
                {
                  screen: 'learn',
                  params: {userId: user.id ?? ''},
                  initial: false,
                },
                false,
              );
            },
            component: (
              <EntypoIcon
                name="chevron-thin-left"
                size={14}
                style={style.backIcon}
                color={'black'}
              />
            ),
          }}
        />
        {!!lection && lection?.url ? (
          <>
            <Timing
              currentTime={currentTime}
              duration={duration}
              timings={lection.timings}
              paused={paused}
              style={style.timing}
            />
            <TouchableOpacity
              style={style.videoStyleWrapper}
              onPress={debounce(togglePlayPause, DEBOUNCE_INTERVAL)}>
              {paused && <VideoOverlay />}
              <Video
                key={lection?.url}
                ref={playerRef}
                paused={paused}
                onEnd={onEnd}
                onLoad={onLoad}
                onProgress={onProgress}
                source={makeSource(lection?.url)}
                style={style.videoStyle}
                onBuffer={onBuffer}
                onError={onError}
                playInBackground={false}
                // poster={lection?.url ?? ''}
                onVideoBuffer={() => console.log('VIDEO BUFFER')}
                progressUpdateInterval={100}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={style.videoStyleWrapper} />
        )}

        <Controls
          currentTime={currentTime ?? 0}
          duration={duration}
          showPlayBtn={paused}
          onPlayPress={onPlayPausePress}
          onRewindPress={onRewindPress}
          onForwardPress={onForwardPress}
          progress={mapProgressToPercentage(currentTime ?? 0, duration)}
          onProgressPress={e => {
            onProgressPress(e);
          }}
        />

        <View style={style.captionWrapper}>
          <LinearGradient
            colors={gradientColors}
            locations={gradientBreakpoints}
            style={style.linearGradient}
          />
          <CaptionsContainer
            captions={lection.captions}
            activeCaption={lection?.captions?.[captionsIndex]}
            paused={paused}
          />
          <LinearGradient
            colors={gradientColorsReverse}
            locations={gradientBreakpointsReverse}
            style={style.linearGradientBottom}
          />
        </View>
      </>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: 'auto',
    backgroundColor: 'white',
  },
  headerStyle: {
    width: '100%',
    height: 60,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    backgroundColor: 'white',
    color: 'black',
  },

  imgWrapper: {
    alignSelf: 'center',
  },
  wrapperStyle: {
    paddingLeft: 0,
  },
  favoriteIcon: {height: 14, width: 14},
  favorite: {
    alignSelf: 'center',
    // padding: ,
    // borderColor: 'blue',
    // borderWidth: 1,
  },

  linearGradient: {
    minHeight: '10%',
    height: '10%',
    maxHeight: '10%',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginBottom: '-5%',
    opacity: 1,

    zIndex: 2,
  },
  linearGradientBottom: {
    minHeight: '10%',
    height: '10%',
    maxHeight: '10%',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    marginTop: '-6%',
    opacity: 1,

    zIndex: 2,
  },

  videoStyleWrapper: {
    minHeight: '30%',
    height: '55%',
    marginBottom: '5%',

    backgroundColor: 'transparent',

    // borderColor: 'red',
    // borderWidth: 1,

    // minWidth: 500,
    // resizeMode: 'center',
  },
  videoStyle: {
    // height: '100%',
    // aspectRatio: 1 ,
    // width: "100%",
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
  },

  activeBtnFont: {
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 40,
  },

  timing: {
    position: 'absolute',
    top: '7%',
    left: '7%',

    zIndex: 9000,
  },

  captionWrapper: {
    marginTop: '-10%',
    minHeight: '20%',
    marginHorizontal: '3%',
  },

  backIcon: {
    textAlign: 'center',
    textAlignVertical: 'center',

    paddingVertical: '20%',
    paddingHorizontal: '20%',
  },
});

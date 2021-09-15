import {DEBOUNCE_INTERVAL, VIBRATE_DURATION_MS} from '@common';
import {LectionsSkeleton} from '@components/Skeletons/LectionsSkeleton';
import {useIsFocused} from '@react-navigation/native';
import {StorageKeys, StorageService} from '@services/storage';
import {translateContext} from '@services/Translations/translate';
import {LectionContext, ToggleContext, UserContext} from '@store';
import {isEmpty, throttle} from 'lodash';
import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {GestureResponderEvent, StyleSheet, Vibration, View} from 'react-native';
import {Lection} from '../../models/lection';
import {NoLikedLections} from '../Placeholders/NoLikedLections';
import {Favorites} from './Favorites';
import {Header} from './Header';
import {Lections} from './Lections';

type LearnPageProps = {
  courseId: string;
};

export const LearnPage: FC<LearnPageProps> = ({courseId}) => {
  const {t} = useContext(translateContext);
  const data = useContext(LectionContext);
  const isFocused = useIsFocused();
  const [showFavorites, setShowFavorites] = useState(false);
  const [lections, setLections] = useState<Lection[]>([]);
  const {
    user,
    getId,
    learningProgress: {
      data: learningProgressData,
      loading: loadingProgressData,
    },
  } = useContext(UserContext);
  const {togglePressBlockOverlay} = useContext(ToggleContext);

  const toggleFavorites = throttle(() => {
    Vibration.vibrate(VIBRATE_DURATION_MS);
    setShowFavorites(!showFavorites);
  }, DEBOUNCE_INTERVAL * 3);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onPressFavorites = (e: GestureResponderEvent) => {
    toggleFavorites();
  };

  const renderFavoritesIcon = () => (
    <Favorites
      height={16}
      width={16}
      onPress={onPressFavorites}
      fill={showFavorites ? 'red' : 'black'}
      style={style.favorite}
      wrapperStyle={style.wrapperStyle}
      iconName={showFavorites ? 'heart' : 'hearto'}
    />
  );

  const isLoading = useCallback(() => {
    const res = showFavorites
      ? loadingProgressData
      : data.loading && data.lections.length === 0;
    return res;
  }, [data.loading, loadingProgressData, showFavorites, lections]);

  const updateCurrentLection = async (lection: Lection) => {
    if (!lection) {
      return;
    }

    const id = getId();
    const currentLection = await StorageService.getStorageValue<Lection>(
      id,
      StorageKeys.CURRENT_LECTION,
    );

    if (currentLection && !isEmpty(currentLection)) {
      return;
    }

    await StorageService.setStorageValue(
      id,
      StorageKeys.CURRENT_LECTION,
      lection,
    );
  };

  useEffect(() => {
    if (!data || !lections) {
      return;
    }

    setLections(
      !Array.isArray(data.lections) ? [data.lections] : data.lections,
    );

    updateCurrentLection(data.lections[0]);
  }, [data]);

  useEffect(() => {
    lections?.length === 0
      ? togglePressBlockOverlay.setOn()
      : togglePressBlockOverlay.setOff();
  }, [lections?.length, togglePressBlockOverlay]);
  console.log('[learningProgressData]', lections);
  return (
    <View style={style.container}>
      <Header title={'Olympic Karate'} icon={renderFavoritesIcon()} />
      {isLoading() ? (
        <View style={style.skeletonWrapper}>
          <LectionsSkeleton />
        </View>
      ) : (
        <View>
          {/* Favorite lections */}
          {(!loadingProgressData &&
            showFavorites &&
            (learningProgressData?.likedLections?.length > 0 ? (
              <Lections
                lections={learningProgressData?.likedLections}
                currentLection={learningProgressData?.currentLection}
                allowLectionsReorder
                headerTitle={t('favorites')}
              />
            ) : (
              <NoLikedLections message={t('noLikedLections')} />
            ))) || <View />}
          {/* Lections */}
          {!showFavorites && (
            <Lections
              lections={lections}
              currentLection={learningProgressData?.currentLection}
              headerTitle={t('title')}
            />
          )}
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 20,
    paddingTop: 60,
    flexDirection: 'column',
    height: '100%',
  },
  skeletonWrapper: {flex: 1},
  imgWrapper: {
    padding: 12,
    borderRadius: 12,

    // borderColor: 'red',
    // borderWidth: 1,
  },

  wrapperStyle: {
    padding: 12,
    borderRadius: 12,

    // borderColor: 'orange',
    // borderWidth: 1,
  },
  favoriteIcon: {
    alignSelf: 'center',
    height: 14,
    width: 14,
  },
  favorite: {alignSelf: 'center'},
  // red: {color: 'red'},
});

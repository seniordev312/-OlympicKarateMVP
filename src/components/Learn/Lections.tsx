import {VIBRATE_DURATION_MS} from '@common';
import {LectionService} from '@services/api';
import {StorageKeys, StorageService} from '@services/storage';
import {UserContext} from '@store';
import {entries, groupBy, isObject} from 'lodash';
import React, {
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {FlatList, StyleSheet, Text, Vibration, View} from 'react-native';
import {Lection} from '../../models/lection';
import {LectionItem as LectionItemComp} from './LectionItem';

const isLectionLocked = (
  order: string,
  currentLectionOrder?: string,
  sep = '-',
) => {
  if (!currentLectionOrder || !order) {
    return false;
  }

  const orderParts = order.split(sep).map(el => +el);
  const currentOrderParts = currentLectionOrder.split(sep).map(el => +el);
  let res = true;

  if (orderParts[0] < currentOrderParts[0]) {
    res = false;
  } else if (orderParts[0] > currentOrderParts[0]) {
    res = true;
  } else if (orderParts[1] <= currentOrderParts[1]) {
    res = false;
  } else {
    res = true;
  }

  return res;
};

type LectionItem = {
  id: string;
  thumbnail?: string;
  title: string;
  duration: string;
  locked?: boolean;
  category: string;
  order: string;
  url: string;
};

type LectionsProps = {
  lections: Lection[];
  currentLection?: string;
  allowLectionsReorder?: boolean;
  headerTitle: string;
};
export const Lections: FC<LectionsProps> = ({
  lections,
  currentLection,
  allowLectionsReorder,
  headerTitle,
}) => {
  const [lectionsState, setLectionsState] = useState(lections);
  const {user, favorites, setFavorites} = useContext(UserContext);

  const lectionsFlatListRef = useRef<FlatList<any>>(null);
  const sortedLections = useMemo(
    () => entries(groupBy(lectionsState, 'category')),
    [lectionsState],
  );

  const addToFavorites = async (id: string) => {
    const newValue = {...favorites, [id]: !favorites[id]};
    setFavorites(newValue);

    // Remove item from favorites if allowed
    if (allowLectionsReorder && favorites[id]) {
      setLectionsState(lectionsState.filter(l => l.id !== id));
    }

    if (!user.id) {
      return;
    }

    const userId = user.id;
    const key = StorageKeys.LIKED_LECTIONS;
    await LectionService.like(userId, id, user.token ?? '');
    // await StorageService.clearStorage();
    const oldValue = await StorageService.getStorageValue(userId, key);

    if (oldValue && isObject(oldValue)) {
      const combinedValue = {
        ...oldValue,
        ...newValue,
      };

      await StorageService.setStorageValue(userId, key, combinedValue);
      setFavorites(combinedValue);
    }
  };

  const handleFavoritePress = (id: string, isFavorite: boolean) => {
    if (!id) {
      return;
    }

    addToFavorites(id);
  };

  const renderLection = (item: LectionItem) => {
    // If no progress has been done
    // Lock all lections except the first lection in first category
    const isLocked = currentLection
      ? isLectionLocked(item.order, currentLection)
      : item.id === sortedLections[0][1][0].id
      ? false
      : true;

    return (
      <LectionItemComp
        {...item}
        title={`${item.order.split('-')[1]}. ${item.title}`}
        key={item.id}
        onFavoritePress={() => {
          Vibration.vibrate(VIBRATE_DURATION_MS);
          handleFavoritePress(item?.id, favorites?.[item?.id]);
        }}
        isFavorite={favorites[item.id]}
        locked={isLocked}
      />
    );
  };

  // eslint-disable-next-line no-shadow
  const renderCategory = ([categoryName, lectionsFromCategory]: [
    string,
    LectionItem[],
  ]) => {
    return (
      <View key={categoryName}>
        <Text style={style.category}>{categoryName}</Text>
        <FlatList
          data={lectionsFromCategory}
          renderItem={({item}) => renderLection(item)}
          keyExtractor={(item, i) =>
            item.id ?? `${item.category}#${item.order}#${i}`
          }
        />
      </View>
    );
  };

  useEffect(() => {
    // getFavoritesFromStorage();
    setLectionsState(lections);
  }, [lections]);

  return (
    <View style={style.container}>
      <FlatList
        ref={lectionsFlatListRef}
        data={sortedLections}
        renderItem={({item}) => renderCategory(item)}
        keyExtractor={item => item[0]}
        ListHeaderComponent={<Text style={style.heading}>{headerTitle}</Text>}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {height: '100%', overflow: 'scroll', paddingBottom: 0},
  heading: {
    marginTop: '3%',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    lineHeight: 36,
  },
  category: {
    marginTop: '10%',
    marginBottom: '3%',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: 'bold',

    letterSpacing: -1.5,
  },
});

import {ANONYMOUS} from '@common';
import {useGetLearningProgressData, useGetLectionData} from '@services/api';
import {Endpoints, RoutePlaceholders} from '@services/api/types';
import AuthService from '@services/auth/AuthService';
import {StorageKeys, StorageService} from '@services/storage';
import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {LearningProgressData, User} from '../models';

export type UserContext = {
  user: User;
  getUser: () => Promise<void>;
  favorites: Record<string, boolean>;
  setFavorites: (value: Record<string, boolean>) => void;
  getId: () => string;
  learningProgress: {data: LearningProgressData; loading: boolean};
};
const initialUserState: User = {id: '', username: '', email: '', password: ''};

export const UserContext = createContext<UserContext>({
  user: initialUserState,
  getUser: async () => {},
  favorites: {},
  setFavorites: () => {},
  getId: () => '',
  learningProgress: {
    data: {currentLection: '', likedLections: []},
    loading: true,
  },
});

export const UserContextProvider: FC = ({children}) => {
  const [user, setUser] = useState<User>(initialUserState);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const {data: learningProgressData, loading: loadingProgressData} =
    useGetLearningProgressData(
      Endpoints.progress.replace(
        RoutePlaceholders.USER_ID,
        user?.id || 'undefined',
      ),
      {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
        params: {
          userId: user?.id || '',
        },
      },
      [user?.id, favorites],
      !!user?.id,
    );
  const {data: currentLection, loading: loadingCurrentLection} =
    useGetLectionData(
      Endpoints.lectionByOrder.replace(
        RoutePlaceholders.ORDER_ID,
        learningProgressData?.currentLection,
      ),
      {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
        params: {id: learningProgressData?.currentLection},
      },
      [learningProgressData?.currentLection, user.token],
      !!learningProgressData?.currentLection && !!user.token,
    );

  const getId = useCallback(
    () => (user?.id && user?.id?.length > 0 ? user.id : ANONYMOUS),
    [user.id],
  );

  const getUser = async () => {
    const savedUser = await AuthService.getLoggedUser();

    if (!savedUser) {
      return;
    }

    setUser(savedUser);
  };

  const getFavorites = async () => {
    const key = StorageKeys.LIKED_LECTIONS;
    const favoritesFromStorage: Record<string, boolean> =
      (await StorageService.getStorageValue(getId(), key)) ?? {};

    setFavorites(favoritesFromStorage);
  };

  const updateStorage = useCallback(
    async (learningProgressDataParam: typeof learningProgressData) => {
      const userId = user.id;

      const likedLections = learningProgressDataParam.likedLections.reduce(
        // eslint-disable-next-line no-shadow
        (likedLections, {id}) => ({...likedLections, [id]: true}),
        {},
      );

      await StorageService.setStorageValue(
        userId?.toString() ?? ANONYMOUS,
        StorageKeys.LIKED_LECTIONS,
        likedLections,
      );

      await StorageService.setStorageValue(
        userId?.toString() ?? ANONYMOUS,
        StorageKeys.CURRENT_LECTION,
        currentLection.lection,
      );

      // const data = await StorageService.getStorageValue(
      //   userId?.toString() ?? ANONYMOUS,
      //   StorageKeys.CURRENT_LECTION,
      // );
    },
    [currentLection, user.id],
  );

  useEffect(() => {
    getUser();
    getFavorites();
  }, []);

  useEffect(() => {
    !loadingCurrentLection && updateStorage(learningProgressData);
  }, [loadingCurrentLection, updateStorage]);

  return (
    <UserContext.Provider
      value={{
        user,
        getUser,
        favorites,
        setFavorites,
        getId,
        learningProgress: {
          data: learningProgressData,
          loading: loadingProgressData,
        },
      }}>
      {children}
    </UserContext.Provider>
  );
};

export enum StorageKeys {
  FAVORITES = 'FAVORITES',
  LANGUAGE = 'LANGUAGE',
  LIKED_LECTIONS = 'LIKED_LECTIONS',
  CURRENT_LECTION = 'CURRENT_LECTION',
}

export const getStorageKey = (key: StorageKeys, id: string, sep = '#') =>
  [key, id].join(sep);

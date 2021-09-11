import Storage from '@react-native-async-storage/async-storage';
import {isEmpty} from 'lodash';
import {StorageKeys} from './types';

const generateStorageKey = (id: string, key: StorageKeys) => `@${id}:${key}`;

export const setStorageValue = async <T>(
  id: string,
  key: StorageKeys,
  value: T,
) => {
  await Storage.setItem(
    generateStorageKey(id, key),
    encodeURIComponent(JSON.stringify(value)),
  );
};

export const getStorageValue = async <T>(id: string, key: StorageKeys) => {
  const value = (await Storage.getItem(generateStorageKey(id, key))) ?? '{}';
  if (!value || isEmpty(value)) {
    return null;
  }
  let parseResult = null;
  try {
    parseResult = JSON.parse(decodeURIComponent(value));
  } catch (error) {
    console.error('ERROR: ', error);
  }

  if (typeof parseResult === 'string') {
    return JSON.parse(parseResult) as T;
  } else {
    return parseResult as T;
  }
};

export const removeStorageValue = async (id: string, key: StorageKeys) => {
  await Storage.removeItem(generateStorageKey(id, key));
};

export const getStorageKeys = async () => {
  return await Storage.getAllKeys();
};

export const clearStorage = async () => {
  await Storage.clear();
};

export const fromStorageToState = async <T>(
  storageId: string,
  storageKey: StorageKeys,
  setState: React.Dispatch<React.SetStateAction<T>>,
) => {
  const value = await getStorageValue<T>(storageId, storageKey);
  if (value) {
    setState(value);
  }
};

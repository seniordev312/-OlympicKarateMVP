import {StatusCodes} from 'http-status-codes';
import {get} from '../apiService';
import {RequestConfig} from '../types';
import {useFetch} from './useFetch';

export const getData = async <T, K>(path: string, config: RequestConfig<T>) => {
  try {
    const {status, data} = await get<T, K>(path, config);
    const res = StatusCodes.OK === status ? (data as K) : null;

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const useGetData = <T, K>(
  path: string,
  config: RequestConfig<T>,
  deps: any[],
  enabled: boolean,
  initialState?: T,
) => {
  return useFetch<K>(
    initialState,
    () => (enabled ? getData(path, config) : null),
    deps,
  );
};

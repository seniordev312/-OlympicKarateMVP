import axios, {AxiosInstance} from 'axios';
import {
  Get,
  InstanceConfig,
  MakeRequestConfig,
  Patch,
  Post,
  Put,
  Remove,
} from './types';

const createAxiosInstance = (config: InstanceConfig) => axios.create(config);

const makeReqest = async <T, U>(
  instance: AxiosInstance,
  config: MakeRequestConfig<T>,
) => {
  try {
    return await instance(config);
  } catch (err) {
    // TODO: Error handling should be implemented. Probalby a logger...
    return err.message;
  }
};

export const get: Get = (url, config) =>
  makeReqest(axios, {...config, method: 'get', url});
export const post: Post = (url, config) =>
  makeReqest(axios, {...config, method: 'post', url});
export const patch: Patch = (url, config) =>
  makeReqest(axios, {...config, method: 'patch', url});
export const put: Put = (url, config) =>
  makeReqest(axios, {...config, method: 'put', url});
export const remove: Remove = (url, config) =>
  makeReqest(axios, {...config, method: 'delete', url});

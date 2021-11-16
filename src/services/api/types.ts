import {AxiosRequestConfig} from 'axios';
import {BASE_URL} from 'react-native-dotenv';
import {Lection} from '../../models/lection';

export enum RoutePlaceholders {
  COURSE_ID = ':courseId',
  LECTION_ID = ':lectionId',
  USER_ID = ':userId',
  ORDER_ID = ':order',
}

export const Endpoints = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  user: `${BASE_URL}/user`,
  lections: `${BASE_URL}/courses/${RoutePlaceholders.COURSE_ID}/lections`,
  lection: `${BASE_URL}/lection/${RoutePlaceholders.LECTION_ID}`,
  like: `${BASE_URL}/like`,
  progress: `${BASE_URL}/progress/${RoutePlaceholders.USER_ID}`,
  progressUpdate: `${BASE_URL}/progress/update`,
  updatePassword: `${BASE_URL}/update-password`,
  resetPassword: `${BASE_URL}/reset`,
  lectionProgress: `${BASE_URL}/progress/${RoutePlaceholders.USER_ID}/lection`,
  lectionByOrder: `${BASE_URL}/lection/order/${RoutePlaceholders.ORDER_ID}`,
};

export type InstanceConfig = {
  baseURL: string;
  timeout?: number;
  headers?: {[key: string]: string};
  withCredentials?: boolean;
};

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RequestConfig<T> = {
  headers?: {[key: string]: string};
  params?: T;
  data?: T;
  withCredentials?: boolean;
  paramsSerializer?: (params: any) => string;
};

export type MakeRequestConfig<T> = RequestConfig<T> & {
  method: RequestMethod;
  url: string;
};

export type Details = {
  details: string;
};

export type RequestResponse<T> = {
  data: T & Details;
  status: number;
  statusText: string;
  headers?: {[key: string]: string};
  config: AxiosRequestConfig;
  request?: any;
};

export type Get = <T, U>(
  url: string,
  config?: RequestConfig<T>,
) => Promise<RequestResponse<U>>;
export type Post = <T, U>(
  url?: string,
  config?: RequestConfig<T>,
) => Promise<RequestResponse<U>>;
export type Patch = <T, U>(
  url?: string,
  config?: RequestConfig<T>,
) => Promise<RequestResponse<U>>;
export type Put = <T, U>(
  url?: string,
  config?: RequestConfig<T>,
) => Promise<RequestResponse<U>>;
export type Remove = <T, U>(
  url?: string,
  config?: RequestConfig<T>,
) => Promise<RequestResponse<U>>;

export type APIService = {
  get: Get;
  post: Post;
  put: Put;
  patch: Patch;
  remove: Remove;
};

export type APIHook = (config: InstanceConfig) => APIService;

export type BaseServiceResponse = {
  success: boolean;
  failedMsg?: string;
};

export type LectionsResponse = BaseServiceResponse & {lections: Lection[]};
export type LectionResponse = BaseServiceResponse & {
  lection?: Lection;
  finished?: boolean;
};

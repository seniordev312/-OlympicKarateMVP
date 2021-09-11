import {LearningProgressData, Lection, LectionProgress} from '@models';
import {RequestConfig} from '../types';
import {useGetData} from './useGetData';

export type GetLectionsParams = {
  courseId: string;
};
export type GetLectionParams = {
  id: string;
};
export type GetLearningProgressParams = {
  userId: string;
};

export const useGetLectionData = (
  path: string,
  params: RequestConfig<GetLectionParams>,
  deps: any[],
  enabled: boolean,
) => {
  return useGetData<GetLectionParams, {lection: Lection}>(
    path,
    params,
    deps,
    enabled,
  );
};

export const useGetLectionsData = (
  path: string,
  params: RequestConfig<GetLectionsParams>,
  deps: any[],
  enabled: boolean,
) => {
  return useGetData<GetLectionsParams, {lections: Lection[]}>(
    path,
    params,
    deps,
    enabled,
  );
};

export const useGetLearningProgressData = (
  path: string,
  params: RequestConfig<GetLearningProgressParams>,
  deps: any[],
  enabled: boolean,
) => {
  return useGetData<GetLearningProgressParams, LearningProgressData>(
    path,
    params,
    deps,
    enabled,
  );
};

export const useGetLectionProgressData = (
  path: string,
  params: RequestConfig<GetLearningProgressParams>,
  deps: any[],
  enabled: boolean,
) => {
  return useGetData<GetLearningProgressParams, LectionProgress>(
    path,
    params,
    deps,
    enabled,
  );
};

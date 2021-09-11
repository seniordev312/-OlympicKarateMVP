import {StatusCodes} from 'http-status-codes';
import {Lection, LectionProgress} from '../../models/lection';
import {get, post} from './apiService';
import {
  Endpoints,
  LectionResponse,
  LectionsResponse,
  RoutePlaceholders,
} from './types';

export const lections = async (courseId: string) => {
  const response: LectionsResponse = {
    success: true,
    failedMsg: '',
    lections: [],
  };

  try {
    const route = Endpoints.lections.replace(
      RoutePlaceholders.COURSE_ID,
      courseId,
    );
    const res = await get<unknown, Lection[]>(route);

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    } else {
      response.lections = res.data;
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

export const lection = async (lectionId: string) => {
  const response: LectionResponse = {
    success: true,
    failedMsg: '',
  };

  try {
    const route = Endpoints.lections.replace(
      RoutePlaceholders.LECTION_ID,
      lectionId,
    );
    const res = await get<unknown, Lection>(route);

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    } else {
      response.lection = res.data;
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

type LikeReqParams = {
  userId: string;
  lectionId: string;
};
export const like = async (
  userId: string,
  lectionId: string,
  token: string,
) => {
  const response: LectionResponse = {
    success: true,
    failedMsg: '',
  };

  try {
    const params = {userId, lectionId};
    const res = await post<LikeReqParams, unknown>(Endpoints.like, {
      headers: {Authorization: `Bearer ${token}`},
      params,
    });

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    }
  } catch (error) {
    console.error(error);
  } finally {
    return response;
  }
};
type LearningProgressUpdateParams = {
  userId: string;
};
export const updateLearningProgress = async (
  userId: string,
  lectionProgress: LectionProgress,
  token: string,
) => {
  const response: LectionResponse = {
    success: true,
    failedMsg: '',
    finished: false,
  };

  try {
    const data = {userId, lectionProgress};

    const res = await post<
      LearningProgressUpdateParams,
      {lection: Lection | undefined; finished?: boolean}
    >(Endpoints.progressUpdate, {
      data,
      headers: {Authorization: `Bearer ${token}`},
    });

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    } else {
      response.lection = res.data.lection;
      response.finished = res.data.finished;
    }
  } catch (error) {
    console.error(error);
  } finally {
    return response;
  }
};

import StatusCodes from 'http-status-codes';
import {User} from 'models/user';
import AuthService from '../auth/AuthService';
import {post} from './apiService';
import {Endpoints} from './types';

type LoginBodyData = {
  username: string;
  password: string;
  email: string;
};
export const login = async (data: LoginBodyData) => {
  const response = {success: true, failedMsg: ''};

  try {
    const res = await post<LoginBodyData, {user: User}>(Endpoints.login, {
      data,
    });

    if (StatusCodes.OK !== res.status || !res.data.user) {
      response.success = false;
      response.failedMsg = res.data.details;
    } else {
      const user = res.data.user;

      let creds: User = {
        id: user.id ?? '',
        username: user.username,
        email: user.email,
        password: user.password ?? 'DEFAULT_PWD',
        token: user.token,
      };
      // @ts-ignore
      await AuthService.storeCredentials(creds);
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

type RegisterBodyData = {
  username: string;
  email: string;
  password: string;
};
export const register = async (data: RegisterBodyData) => {
  const response = {success: true, failedMsg: ''};

  try {
    const res = await post(Endpoints.register, {data});

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

type UpdatePasswordBodyData = {
  token: string;
  password: string;
  email: string;
};
export const updatePassword = async (
  data: UpdatePasswordBodyData,
  headers: Record<string, string>,
) => {
  const response = {success: true, failedMsg: ''};

  try {
    const res = await post(Endpoints.updatePassword, {headers, data});

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

type ResetPasswordBodyData = {
  email: string;
  username?: string;
};
export const resetPassword = async (data: ResetPasswordBodyData) => {
  const response = {success: true, failedMsg: ''};

  try {
    const res = await post(Endpoints.resetPassword, {data});

    if (StatusCodes.OK !== res.status) {
      response.success = false;
      response.failedMsg = res.data.detail;
    }
  } catch (error) {
    console.error(error);
    response.success = false;
  } finally {
    return response;
  }
};

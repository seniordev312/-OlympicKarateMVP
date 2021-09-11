import Keychain from 'react-native-keychain';
import {User} from '../../models';

const storeCredentials = async <T extends User>(data: T) => {
  await Keychain.setGenericPassword(data.username, JSON.stringify(data));
};

const getCredentials = async () => {
  return await Keychain.getGenericPassword();
};

const getLoggedUser = async () => {
  let creds = await getCredentials();
  if (!creds) {
    return null;
  }

  return JSON.parse(creds.password ?? '{}');
};

const resetCredentials = async () => {
  return await Keychain.resetGenericPassword();
};

export default {
  getCredentials,
  getLoggedUser,
  resetCredentials,
  storeCredentials,
};

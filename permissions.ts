import {Permission, PermissionsAndroid, PermissionStatus} from 'react-native';

export type StoragePermisisonsConfig = {
  title: string;
  message: string;

  buttonNeutral: string;
  buttonNegative: string;
  buttonPositive: string;
};

export type RequestStoragePermissionsParams = {
  readConfig: StoragePermisisonsConfig;
  writeConfig: StoragePermisisonsConfig;
};

const requestPermission = async (
  permission: Permission,
  config: StoragePermisisonsConfig,
) => {
  return await PermissionsAndroid.request(permission, {
    title: config.title,
    message: config.message,
    buttonNeutral: config.buttonNeutral,
    buttonNegative: config.buttonNegative,
    buttonPositive: config.buttonPositive,
  });
};

const checkPermission = (status: PermissionStatus) => {
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('✅ Permission granted');
    return true;
  } else {
    console.log('❌ Permission denies');
    return false;
  }
};
export const requestStoragePermissions = async ({
  readConfig,
  writeConfig,
}: RequestStoragePermissionsParams) => {
  let allApproved = false;

  try {
    const readPerm = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const readGranted = await requestPermission(readPerm, readConfig);
    if (!checkPermission(readGranted)) {
      return;
    }

    const writePerm = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const writeGranted = await requestPermission(writePerm, writeConfig);
    if (!checkPermission(writeGranted)) {
      return;
    }

    allApproved = true;
  } catch (err) {
    console.warn(err);
  } finally {
    return allApproved;
  }
};

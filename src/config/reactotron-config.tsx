// @ts-nocheck
import {NativeModules} from 'react-native';
import Reactotron from 'reactotron-react-native';
// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';

const scriptURL = NativeModules.SourceCode.scriptURL;
const host = scriptURL.split('://')[1].split(':')[0];

let TronConnector = null;
if (__DEV__) {
    TronConnector = Reactotron.setAsyncStorageHandler(AsyncStorage)
        .configure({
            name: 'karate',
            host
        }) // controls connection & communication settings
        .useReactNative() // add all built-in react native plugins
        .connect();
}

Reactotron.clear();
if (__DEV__) {
    console.tron = Reactotron;
}

export default TronConnector;

export const printLogs = log => {
    if (__DEV__) {
        console.tron.warn(log);
    }
};

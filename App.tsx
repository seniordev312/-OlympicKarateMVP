import {activeColor, BASE_URL, learnProps} from '@common';
import {ChatPage} from '@components/Chat/ChatPage';
import {GetStartedPage} from '@components/GetStarted/GetStartedPage';
import {LandingPage} from '@components/Landing/LandingPage';
import {LearnPage} from '@components/Learn/LearnPage';
import {LectionPage} from '@components/Learn/LectionPage';
import {LoginPage} from '@components/Login/LoginPage';
import {Chat} from '@components/Navbar/icons/Chat';
import {Learn} from '@components/Navbar/icons/Learn';
import {Settings} from '@components/Navbar/icons/Settings';
import {Navbar, NavItem} from '@components/Navbar/Navbar';
import {PwdResetPage} from '@components/PwdReset/PwdResetPage';
import {RegistrationPage} from '@components/Registration/RegistrationPage';
import {SettingsPage} from '@components/Settings/SettingsPage';
import {SplashScreen} from '@components/SplashScreen/SplashScreen';
import {Routes} from '@models';
import {NavigationContainer} from '@react-navigation/native';
import {CardStyleInterpolators} from '@react-navigation/stack';

import {
  NavbarNavigation,
  navigationRef,
  Root,
  RootStackNavigation,
  StackItem,
} from '@routes';
import AuthService from '@services/auth/AuthService';
import {TranslateContextProvider} from '@services/Translations/translate';
import {Language} from '@services/Translations/types';
import {
  LectionContextProvider,
  ToggleContext,
  ToggleContextProvider,
  UserContextProvider,
} from '@store';
import {DoubleTapToClose} from '@utils/BackHandlers';
import {useToggle} from '@utils/hooks';
import Wallet from 'components/wallet/wallet';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import {
  requestStoragePermissions,
  RequestStoragePermissionsParams,
} from './permissions';

const registrationProps = {
  logoUrl: `${BASE_URL}/wp-content/uploads/2020/12/olympic-karate-logo-1-1.png`,
  title: 'Welcome to Olympic Karate',
};

const loginProps = {
  logoUrl: `${BASE_URL}/wp-content/uploads/2020/12/olympic-karate-logo-1-1.png`,
  title: 'Welcome to Olympic Karate',
};

const pwdResetProps = {
  logoUrl: `${BASE_URL}/wp-content/uploads/2020/12/olympic-karate-logo-1-1.png`,
  title: 'Welcome to Olympic Karate',
};

const renderRegistrationPage = () => (
  <RegistrationPage {...registrationProps} />
);

const renderLoginPage = () => <LoginPage {...loginProps} />;

const renderPwdResetPage = () => <PwdResetPage {...pwdResetProps} />;

const lectionProps = {};
const renderLectionPage = () => <LectionPage {...lectionProps} />;

const renderLearnPage = () => <LearnPage {...learnProps} />;

const layout: StackItem<RootStackNavigation>[] = [
  {
    name: 'splash',
    component: SplashScreen,
  },
  {
    name: 'login',
    component: renderLoginPage,
  },
  {
    name: 'register',
    component: renderRegistrationPage,
  },
  {
    name: 'getStarted',
    component: GetStartedPage,
  },
  {
    name: 'landing',
    component: LandingPage,
  },
  {
    name: 'lection',
    component: renderLectionPage,
  },
  {
    name: 'reset',
    component: renderPwdResetPage,
  },
];

const tabBar: StackItem<NavbarNavigation>[] = [
  {
    name: 'learn',
    component: renderLearnPage,
  },
  {
    name: 'chat',
    component: ChatPage,
  },
  {
    name: 'settings',
    component: SettingsPage,
  },
  // {
  //   name: 'settings',
  //   component: Wallet,
  // },
];

const navItems: NavItem[] = [
  {
    label: 'learn',
    icon: Learn,
    fill: activeColor,
    route: Routes.LEARN,
    component: tabBar[0].component,
  },
  {
    label: 'chat',
    icon: Chat,
    fill: activeColor,
    route: Routes.CHAT,
    component: tabBar[1].component,
  },
  {
    label: 'settings',
    icon: Settings,
    fill: activeColor,
    route: Routes.SETTINGS,
    component: tabBar[2].component,
  },
];

const language = Language.DEFAULT;

const reqStorageConfig: RequestStoragePermissionsParams = {
  readConfig: {
    title: 'Allow read access to storage',
    message:
      "This app uses your phone storage only to optimize it's performance. No data sensitive data is stored",
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  },
  writeConfig: {
    title: 'Allow write access to storage',
    message:
      "This app uses your phone storage only to optimize it's performance. No data sensitive data is stored",
    buttonNeutral: 'Ask Me Later',
    buttonNegative: 'Cancel',
    buttonPositive: 'OK',
  },
};

export const App = () => {
  const {state: loading, setOff, setOn} = useToggle(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {togglePressBlockOverlay} = useContext(ToggleContext);

  const linking = {
    prefixes: ['https://android.studyum.io', 'android.studyum.io://'],
    config: {
      screens: {
        reset: 'reset/:token',
      },
    },
  };

  const renderStackScreen = ({
    name,
    component,
    options,
  }: StackItem<RootStackNavigation>) => {
    return (
      <Root.Screen
        name={name}
        component={component}
        options={{
          ...(options || {}),
          animationTypeForReplace: isLoggedIn ? 'pop' : 'push',
        }}
      />
    );
  };

  const renderNavbar = () => {
    return <Navbar navItems={navItems} initialRouteName={'chat'} />;
  };

  useEffect(() => {
    const wrapper = async () => {
      await requestStoragePermissions(reqStorageConfig);
      setTimeout(() => {
        setOff();
      }, 3000);
    };
    wrapper();
  }, [setOff]);

  const checkIsLoggedIn = useCallback(async () => {
    const user = await AuthService.getLoggedUser();
    setIsLoggedIn(user !== null);
    setTimeout(() => {
      setOff();
    }, 3000);
  }, []);

  useEffect(() => {
    setOn();
    checkIsLoggedIn();
  }, [checkIsLoggedIn]);

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'white'}
        animated={true}
      />
      <UserContextProvider>
        <TranslateContextProvider language={language}>
          <DoubleTapToClose message={'Tap again to exit app'} />
          <ToggleContextProvider>
            <LectionContextProvider courseId={learnProps.courseId}>
              {/* {!loading && <SplashScreen />} */}
              {!loading && (
                <View style={style.container}>
                  <NavigationContainer
                    ref={navigationRef}
                    linking={linking}
                    // fallback={<SplashScreen />}
                  >
                    <View style={style.navigator}>
                      <Root.Navigator
                        initialRouteName={isLoggedIn ? 'navbar' : 'splash'}
                        headerMode={'none'}
                        screenOptions={{
                          cardStyleInterpolator:
                            CardStyleInterpolators.forHorizontalIOS,
                        }}>
                        {React.Children.toArray(layout.map(renderStackScreen))}
                        <Root.Screen name={'navbar'} component={renderNavbar} />
                      </Root.Navigator>
                    </View>
                  </NavigationContainer>
                </View>
              )}
            </LectionContextProvider>
          </ToggleContextProvider>
        </TranslateContextProvider>
      </UserContextProvider>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    // flex: 1,
    height: Dimensions.get('window').height,
    // display: 'flex',
    // flexDirection: 'column',

    // borderColor: 'red',
    // borderWidth: 3,
    // borderLeftWidth: 50,
    // borderRightWidth: 50,
    // borderTopWidth: 100,
    // borderBottomWidth: 100,

    backgroundColor: 'white',
  },

  navigator: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    // borderColor: 'red',
    // borderWidth: 3,
  },
});

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainerRef, RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {Question} from './models';

export type RootStackNavigation = {
  login: object;
  register: object;
  getStarted: object;
  navbar: object;
  lection: {lectionId: string};
  reset: {token: string};
};
export type RootRouteProps<RouteName extends keyof RootStackNavigation> =
  RouteProp<RootStackNavigation, RouteName>;

export type NavbarNavigation = {
  learn: {userId: string};
  chat: {
    questions: Array<Question>;
    positiveMessages: Array<string>;
    negativeMessages: Array<string>;
  };
  settings: object;
};
export type NavbarRouteProps<RouteName extends keyof NavbarNavigation> =
  RouteProp<NavbarNavigation, RouteName>;

export const Root = createStackNavigator<RootStackNavigation>();
export const NavbarStack = createBottomTabNavigator<NavbarNavigation>();
export const navigationRef = React.createRef<NavigationContainerRef>();

export type StackItem<T> = {
  name: keyof T;
  component: FunctionComponent;
  options?: StackNavigationOptions;
};

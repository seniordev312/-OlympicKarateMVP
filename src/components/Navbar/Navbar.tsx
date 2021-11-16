import {
  accentColor,
  accentColorDisabledDarker,
  activeColor,
  activeColorDisabled,
  heightPercentageToDP,
  widthPercentageToDP,
} from '@common';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {NavbarNavigation, NavbarStack} from '@routes';
import {ToggleContext} from '@store';
import React, {FC, FunctionComponent, useContext} from 'react';
import {getTabBarVisibility, Routes} from '../../models';

export type NavItem = {
  label: keyof NavbarNavigation;
  icon: React.FC<Record<string, any>>;
  fill?: string;
  route: Routes;
  component: FunctionComponent;
};

type NavbarProps = {
  navItems: NavItem[];
  initialRouteName: keyof NavbarNavigation;
};

const TAB_HEIGHT = heightPercentageToDP('8');
const TAB_WIDTH = widthPercentageToDP('100');

export const Navbar: FC<NavbarProps> = ({navItems, initialRouteName}) => {
  const {togglePressBlockOverlay} = useContext(ToggleContext);

  const renderTabIcon = (
    {
      size,
      focused,
    }: {
      focused: boolean;
      color: string;
      size: number;
    },
    icon: React.FC<Record<string, number | string | undefined>>,
    fill: string | undefined,
  ) => (
    <>
      {focused
        ? icon({
            // width: size,
            // height: size,
            fill: togglePressBlockOverlay.state ? activeColorDisabled : fill,
          })
        : icon({
            fill: togglePressBlockOverlay.state
              ? accentColorDisabledDarker
              : undefined,
          })}
    </>
  );

  const renderNavItem = ({label, icon, fill, component}: NavItem) => {
    return (
      <NavbarStack.Screen
        name={label}
        component={component}
        options={({route}) => ({
          unmountOnBlur: true,
          tabBarLabel: label.charAt(0).toUpperCase() + label.slice(1),
          tabBarIcon: iconProps => renderTabIcon(iconProps, icon, fill),
          tabBarVisible: getTabBarVisibility(route.name),
        })}
        listeners={({navigation}) => ({
          blur: () => navigation.setParams({screen: undefined}),
          tabPress: e => {
            togglePressBlockOverlay.state && e.preventDefault();
          },
        })}
      />
    );
  };

  return (
    <>
      <NavbarStack.Navigator
        tabBarOptions={{
          ...tabBarOptions,
          activeTintColor: togglePressBlockOverlay.state ? accentColor : '#000',
        }}
        initialRouteName={initialRouteName}>
        {React.Children.toArray(navItems.map(renderNavItem))}
      </NavbarStack.Navigator>
    </>
  );
};

const tabBarOptions = {
  activeTintColor: activeColor,
  labelPosition: 'below-icon' as LabelPosition,
  unmountOnBlur: true,
  style: {
    height: TAB_HEIGHT,
    width: TAB_WIDTH,
  },
  tabStyle: {
    height: TAB_HEIGHT,
  },
  labelStyle: {
    fontSize: 13,
    // lineHeight: 10,
    marginTop: '-5%',
    marginBottom: '5%',
  },
};

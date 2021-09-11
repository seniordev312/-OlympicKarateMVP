import React, {FC} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {EMPTY_FN} from '../../constants';
import {Routes} from '../../models/route';

export type NavItem = {
  label: string;
  icon: React.FC<Record<string, unknown>>;
  onPress?: (event: GestureResponderEvent) => void;
  fill?: string;
  route: Routes;
};
export type NavItemProps = NavItem & {
  selected: boolean;
};

export const NavItem: FC<NavItemProps> = ({
  label,
  icon,
  fill,
  onPress,
  selected,
}) => {
  return (
    <Pressable onPress={onPress || EMPTY_FN}>
      <View style={style.navItem}>
        <View style={style.alignSelfCenter}>
          {selected ? icon({fill}) : icon({})}
        </View>
        <Text style={style.textAlignCenter}>{label}</Text>
      </View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  navItem: {
    minWidth: 110,
    paddingHorizontal: 20,
    paddingVertical: 20,

    flexDirection: 'column',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',

    alignSelf: 'center',
  },
  alignSelfCenter: {alignSelf: 'center'},
  textAlignCenter: {textAlign: 'center'},
});

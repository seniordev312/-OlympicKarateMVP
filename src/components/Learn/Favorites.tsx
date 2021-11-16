import {DEBOUNCE_INTERVAL, EMPTY_FN} from '@common';
import {throttle} from 'lodash';
import * as React from 'react';
import {FC} from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {IconProps} from '../../shared';

const defaultProps = {
  fill: 'black',
};

type FavoritesProps = IconProps & {
  width?: number;
  height?: number;
  fill?: string;
  style?: Record<string, unknown>;
  wrapperStyle?: Record<string, unknown>;
  onPress?: (e: GestureResponderEvent) => void;
  iconName: string;
};

export const Favorites: FC<FavoritesProps> = ({
  width,
  height,
  fill,
  style,
  wrapperStyle,
  onPress,
  iconName,
  children,
}) => {
  const fillState = React.useMemo(() => fill || defaultProps.fill, [fill]);

  return (
    <View style={{...styles.iconWrapper, ...(wrapperStyle ?? {})}}>
      {children}
      <TouchableOpacity
        onPress={throttle(onPress || EMPTY_FN, DEBOUNCE_INTERVAL)}
        style={styles.pressContainer}>
        <Icon
          size={width || height}
          name={iconName}
          color={fillState}
          style={{...styles.defaultIconStyle, ...style}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    // borderColor: 'blue',
    // borderWidth: 1,
  },
  defaultIconStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',

    // borderColor: 'red',
    // borderWidth: 1,
  },

  pressContainer: {
    paddingVertical: '20%',
    paddingHorizontal: '20%', // borderColor: 'orange',
    // borderWidth: 1,
  },
});

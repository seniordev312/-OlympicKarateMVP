import {accentColor} from '@common';
import {IconProps} from '@shared';
import * as React from 'react';
import {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

const defaultProps = {
  evenoddFill: accentColor,
  evenoddFillWhite: '#fff',
};
export const Chat: FC<IconProps> = ({width, height, fill}) => {
  const evenoddFill = React.useMemo(
    () => fill || defaultProps.evenoddFill,
    [fill],
  );

  return (
    <Svg
      width={width || 23}
      height={height || 20}
      viewBox="0 0 23 20"
      fill={fill || 'none'}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.233 0H3.767C2.9 0 2.068.357 1.455.992A3.445 3.445 0 00.5 3.387V12.3c-.002.898.342 1.76.955 2.396a3.211 3.211 0 002.312.993h2.099v2.961c0 1.406.816 1.775 1.813.82l3.946-3.78h7.615a3.212 3.212 0 002.308-.996 3.445 3.445 0 00.952-2.394V3.386a3.445 3.445 0 00-.955-2.395A3.212 3.212 0 0019.233 0z"
        fill={evenoddFill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 11a3 3 0 100-6 3 3 0 000 6z"
        fill={defaultProps.evenoddFillWhite}
      />
    </Svg>
  );
};

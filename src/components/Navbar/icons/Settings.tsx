import {accentColor} from '@common';
import {IconProps} from '@shared';
import * as React from 'react';
import {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

const defaultProps = {
  defaultFill: accentColor,
};

export const Settings: FC<IconProps> = ({width, height, fill}) => {
  const evenoddFill = React.useMemo(
    () => fill || defaultProps.defaultFill,
    [fill],
  );

  return (
    <Svg
      width={width || 26}
      height={height || 16}
      viewBox="0 0 26 16"
      fill={fill || 'none'}>
      <Path
        d="M18.453 0H7.563C3.386 0 0 3.524 0 8s3.387 8 7.563 8h10.89C22.628 16 26 12.476 26 8s-3.372-8-7.547-8z"
        fill={evenoddFill}
      />
      <Path
        d="M7 5c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3z"
        fill="#fff"
      />
    </Svg>
  );
};

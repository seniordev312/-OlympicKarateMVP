import {accentColor} from '@common';
import {IconProps} from '@shared';
import * as React from 'react';
import {FC} from 'react';
import Svg, {Rect} from 'react-native-svg';

const defaultProps = {
  fill: accentColor,
};

export const Learn: FC<IconProps> = ({width, height, fill}) => {
  const fillState = React.useMemo(() => fill || defaultProps.fill, [fill]);

  return (
    <Svg
      width={width || 18}
      height={height || 18}
      viewBox="0 0 18 18"
      fill={fill || 'none'}>
      <Rect width={8.182} height={8.182} rx={2} fill={fillState} />
      <Rect x={9.818} width={8.182} height={8.182} rx={2} fill={fillState} />
      <Rect y={9.818} width={8.182} height={8.182} rx={2} fill={fillState} />
      <Rect
        x={9.818}
        y={9.818}
        width={8.182}
        height={8.182}
        rx={2}
        fill={fillState}
      />
    </Svg>
  );
};

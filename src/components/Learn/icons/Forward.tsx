import React, {FC} from 'react';
import {Path, Svg} from 'react-native-svg';
import {IconProps} from '../../../shared';
import {defaultProps} from './common';

export const Forward: FC<IconProps> = ({width, height, fill}) => {
  const fillState = React.useMemo(() => fill || defaultProps.fill, [fill]);

  return (
    <Svg
      width={width || 24}
      height={height || 24}
      viewBox="0 0 24 24"
      fill={fill || 'none'}>
      <Path
        d="M10.198 12.435l.362-3.544h3.642v.835h-2.876l-.215 1.938a2.294 2.294 0 011.187-.308c.648 0 1.162.215 1.543.645.38.426.571 1.004.571 1.733 0 .733-.199 1.31-.596 1.734-.394.42-.945.63-1.655.63-.628 0-1.14-.174-1.538-.523-.397-.348-.623-.83-.679-1.445h.855c.055.407.2.714.434.923.235.205.544.307.928.307.42 0 .749-.143.987-.43.24-.286.36-.681.36-1.186 0-.475-.13-.856-.39-1.142-.257-.29-.6-.435-1.03-.435-.394 0-.703.086-.928.259l-.24.195-.722-.186z"
        fill={fillState}
      />
      <Path
        d="M12 0l3 3-3 3V3.916a8.084 8.084 0 108.028 9.04c.062-.526.485-.956 1.014-.956.53 0 .963.43.912.956A10 10 0 1112 2V0z"
        fill={fillState}
      />
    </Svg>
  );
};

export default Forward;

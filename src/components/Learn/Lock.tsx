import * as React from 'react';
import {FC} from 'react';
import Svg, {Path} from 'react-native-svg';
import {IconProps} from 'shared/types';

export const SvgComponent: FC<IconProps> = ({width, height, fill}) => {
  return (
    <Svg
      width={width || 14}
      height={height || 13}
      viewBox="0 0 14 13"
      fill="none">
      <Path
        d="M5.511 0a4.276 4.276 0 00-4.248 3.654v.114c-.023.16-.023.32-.023.503v.616c-.689 0-1.24.549-1.24 1.21v6.693C0 13.452.551 14 1.217 14h8.566c.666 0 1.217-.548 1.217-1.21V6.098c0-.662-.551-1.21-1.217-1.21V4.27c0-.16-.023-.343-.023-.503v-.114A4.276 4.276 0 005.51 0zm0 1.827c.161 0 .345.023.506.046.803.16 1.446.708 1.768 1.439.069.137.115.296.138.456.023.16.046.32.046.503v.616H3.054v-.616c0-.16.023-.343.046-.503.046-.228.138-.434.23-.64.023-.068.069-.113.092-.182.046-.068.069-.114.115-.16a.617.617 0 01.16-.182l.115-.115c.069-.068.138-.114.23-.182.046-.023.092-.069.138-.092l.275-.137.138-.068c.092-.046.207-.069.298-.092a.328.328 0 00.138-.045c.161-.023.322-.046.482-.046z"
        fill={fill || '#000'}
      />
    </Svg>
  );
};

export default SvgComponent;
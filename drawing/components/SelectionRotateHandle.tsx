/* eslint-disable react/function-component-definition */
import { Circle, Group, ImageSVG, Path, Rect, Skia, SkPoint, toDegrees } from '@shopify/react-native-skia';
import React from 'react';


type Props = {
  x: () => number;
  y: () => number;
  rotate?: number;
  offset?: SkPoint;
  iconScale?: number; // Optional scale factor for the rotation icon
};


const svg = Skia.SVG.MakeFromString(
  `<svg viewBox="0 0 1024 1024">
    <path d="M1019.416782 256.2228L879.946904 16.309019a36.466895 36.466895 0 0 0-60.778158 0L680.338638 256.2228a34.547584 34.547584 0 0 0 0 34.547584 34.547584 34.547584 0 0 0 30.069194 17.273793h103.002983a545.08411 545.08411 0 0 1-500.939975 502.219514v-96.605282a34.547584 34.547584 0 0 0-17.273792-30.069194 35.187355 35.187355 0 0 0-34.547584 0l-243.112632 138.190338a34.547584 34.547584 0 0 0 0 60.138388l243.752402 137.550568a35.187355 35.187355 0 0 0 34.547584 0 34.547584 34.547584 0 0 0 17.273792-30.069194v-108.760914a614.819049 614.819049 0 0 0 570.035144-571.314684h105.562064a34.547584 34.547584 0 0 0 30.069194-17.273792 34.547584 34.547584 0 0 0 0.63977-35.827125z"
    fill="#4185F4"/>
  </svg>`
)!;

export const SelectionRotateHandle: React.FC<Props> = ({
  x,
  y,
  offset = { x: 0, y: 0 },
  rotate = 0,
  iconScale = 1
}) => (
  <Group
    origin={{ x: x() + offset.x, y: y() + offset.y }}
    transform={[
      { rotate: rotate * (Math.PI / 180) },
    ]}>
    <ImageSVG
      svg={svg}
      x={x() + offset.x}
      y={y() + offset.y}
      width={20}
      height={20}
    />
    
  </Group>
);
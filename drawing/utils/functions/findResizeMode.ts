import type { SkPoint } from '@shopify/react-native-skia';

import type { DrawingElements, TransformMode } from '../types';

import { getBoundingBox } from './getBoundingBox';


interface TransformHandleSpot {
  offset: SkPoint;
  type: TransformMode;
  hitSlop: number;
}

export const findResizeMode = (
  point: SkPoint,
  selectedElements: DrawingElements,
): TransformMode | undefined => {
  const bounds = getBoundingBox(selectedElements);
  if (!bounds) {
    return undefined;
  }

  const spots: TransformHandleSpot[] = [
    { offset: { x: 0 - 20, y: 0 - 20 }, type: 'rotateTopLeft', hitSlop: 100 },
    { offset: { x: bounds.width + 20, y: 0 - 20 }, type: 'rotateTopRight', hitSlop: 100 },
    { offset: { x: bounds.width + 20, y: bounds.height + 20 }, type: 'rotateBottomRight', hitSlop: 100 },
    { offset: { x: 0 - 20, y: bounds.height + 20 }, type: 'rotateBottomLeft', hitSlop: 100 },

    
    { offset: { x: 0, y: 0 }, type: 'topLeft', hitSlop: 10 },
    { offset: { x: bounds.width, y: 0 }, type: 'topRight', hitSlop: 10 },
    { offset: { x: bounds.width, y: bounds.height }, type: 'bottomRight', hitSlop: 10 },
    { offset: { x: 0, y: bounds.height }, type: 'bottomLeft', hitSlop: 10 },

    { offset: { x: bounds.width / 2, y: 0 }, type: 'midTop', hitSlop: 10 },
    { offset: { x: bounds.width / 2, y: bounds.height }, type: 'midBottom', hitSlop: 10 },
    { offset: { x: 0, y: bounds.height / 2 }, type: 'midLeft', hitSlop: 10 },
    { offset: { x: bounds.width, y: bounds.height / 2 }, type: 'midRight', hitSlop: 10 },



  ]


  for (let index = 0; index < spots.length; index++) {
    const spot = spots[index];
    if (
      point.x >= bounds.x + spot.offset.x - spot.hitSlop
      && point.x <= bounds.x + spot.offset.x + spot.hitSlop
      && point.y >= bounds.y + spot.offset.y - spot.hitSlop
      && point.y <= bounds.y + spot.offset.y + spot.hitSlop
    ) {
      return spot.type;
    }
  }


  return undefined;
};

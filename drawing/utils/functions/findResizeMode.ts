import type { SkPoint } from '@shopify/react-native-skia';

import type { DrawingElements, TransformMode } from '../types';

import { getBoundingBox } from './getBoundingBox';
import { SelecctionHandleSize } from '@/drawing/components/SelectionFrame';


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

  const rotateHandleMargin = 20;
  const rotateHandleSlop = 10;
  const resizeHandleSlop = SelecctionHandleSize;

  const spots: TransformHandleSpot[] = [
    { offset: { x: 0 - rotateHandleMargin, y: 0 - rotateHandleMargin }, type: 'rotateTopLeft', hitSlop: rotateHandleSlop },
    { offset: { x: bounds.width + rotateHandleMargin, y: 0 - rotateHandleMargin }, type: 'rotateTopRight', hitSlop: rotateHandleSlop },
    { offset: { x: bounds.width + rotateHandleMargin, y: bounds.height + rotateHandleMargin }, type: 'rotateBottomRight', hitSlop: rotateHandleSlop },
    { offset: { x: 0 - rotateHandleMargin, y: bounds.height + rotateHandleMargin }, type: 'rotateBottomLeft', hitSlop: rotateHandleSlop },


    { offset: { x: 0, y: 0 }, type: 'topLeft', hitSlop: resizeHandleSlop },
    { offset: { x: bounds.width, y: 0 }, type: 'topRight', hitSlop: resizeHandleSlop },
    { offset: { x: bounds.width, y: bounds.height }, type: 'bottomRight', hitSlop: resizeHandleSlop },
    { offset: { x: 0, y: bounds.height }, type: 'bottomLeft', hitSlop: resizeHandleSlop },

    { offset: { x: bounds.width / 2, y: 0 }, type: 'midTop', hitSlop: resizeHandleSlop },
    { offset: { x: bounds.width / 2, y: bounds.height }, type: 'midBottom', hitSlop: resizeHandleSlop },
    { offset: { x: 0, y: bounds.height / 2 }, type: 'midLeft', hitSlop: resizeHandleSlop },
    { offset: { x: bounds.width, y: bounds.height / 2 }, type: 'midRight', hitSlop: resizeHandleSlop },
  ]


  for (let index = 0; index < spots.length; index++) {
    const spot = spots[index];
    if (
      point.x >= bounds.x + spot.offset.x - spot.hitSlop
      && point.x <= bounds.x + spot.offset.x + spot.hitSlop
      && point.y >= bounds.y + spot.offset.y - spot.hitSlop
      && point.y <= bounds.y + spot.offset.y + spot.hitSlop
    ) {

      console.log('spot.type', spot.type)
      return spot.type;
    }
  }


  return undefined;
};

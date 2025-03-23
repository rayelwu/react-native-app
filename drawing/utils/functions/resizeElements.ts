/* eslint-disable no-plusplus */
import { processTransform2d } from '@shopify/react-native-skia';
import type { SkRect } from '@shopify/react-native-skia';

import type { DrawingElements, TransformMode } from '../types';

import { getBoundingBox } from './getBoundingBox';

export const resizeElementsBy = (
  sx: number,
  sy: number,
  angleRad = 0,
  resizeMode: TransformMode | undefined,
  elements: DrawingElements,
) => {
  const source = getBoundingBox(elements);

  if (source === undefined) {
    return;
  }
  let dest: SkRect = resizeBounds(sx, sy, 0, 0, source);
  let rotate = 0;
  switch (resizeMode) {
    case 'topLeft':
      dest = resizeBounds(sx, sy, -sx, -sy, source);
      break;
    case 'topRight':
      dest = resizeBounds(0, sy, sx, -sy, source);
      break;
    case 'bottomLeft':
      dest = resizeBounds(sx, 0, -sx, sy, source);
      break;
    case 'bottomRight':
      dest = resizeBounds(0, 0, sx, sy, source);
      break;
    case 'midTop':
      dest = resizeBounds(0, sy, 0, -sy, source);
      break;
    case 'midBottom':
      dest = resizeBounds(0, 0, 0, sy, source);
      break;
    case 'midLeft':
      dest = resizeBounds(sx, 0, -sx, 0, source);
      break;
    case 'midRight':
      dest = resizeBounds(0, 0, sx, 0, source);
      break;
    case 'rotateTopLeft':
    case 'rotateTopRight':
    case 'rotateBottomLeft':
    case 'rotateBottomRight':
      rotate = angleRad;
      break;
    case undefined:
      dest = resizeBounds(sx, sy, 0, 0, source);
      break;
    default:
      return;
  }

  if (dest.width <= 0 || dest.height <= 0) {
    return;
  }

  const scaleX = dest.width / source.width;
  const scaleY = dest.height / source.height;
  const translateX = dest.x - source.x * scaleX;
  const translateY = dest.y - source.y * scaleY;

  // Calculate the center of the bounding box for rotation
  const centerX = source.x + source.width / 2;
  const centerY = source.y + source.height / 2;

  // For rotation cases, we need a different approach
  if (rotate !== 0) {
    // Create a matrix that rotates around the center of the bounding box
    const rotationMatrix = processTransform2d([
      { translateX: centerX },
      { translateY: centerY },
      { rotate },
      { translateX: -centerX },
      { translateY: -centerY },
    ]);

    // Apply rotation to each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.path.transform(rotationMatrix);
    }
  } else {
    // For non-rotation transformations, use the original approach
    const matrix = processTransform2d([
      { translateX },
      { translateY },
      { scaleX },
      { scaleY },
    ]);

    // Apply transformations to each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.path.transform(matrix);
    }
  }
};

const resizeBounds = (
  x: number,
  y: number,
  r: number,
  b: number,
  bounds: SkRect,
) => ({
  x: bounds.x + x,
  y: bounds.y + y,
  width: bounds.width + r,
  height: bounds.height + b,
});

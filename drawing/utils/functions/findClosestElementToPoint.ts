/* eslint-disable no-plusplus */
import type { SkPoint } from '@shopify/react-native-skia';

import type { DrawingElements } from '../types';

import { getBounds } from './getBounds';

export const findClosestElementToPoint = (
  point: SkPoint,
  elements: DrawingElements,
) => {
  // Empty elements returns undefined
  if (elements.length === 0) {
    return undefined;
  }
  // Check if we any of the paths (in reverse top-down order) contains the point
  for (let i = elements.length - 1; i >= 0; i--) {
    if (elements[i].path.contains(point.x, point.y)) {
      return elements[i];
    }
  }
  const slop = 30;
  // If not, measure distance to the closest path
  const distances = elements
    .map((element) => {
      const rect = getBounds(element);
      // check if point is in rect
      if (
        point.x >= rect.x - slop
        && point.x < rect.x + rect.width + slop
        && point.y >= rect.y - slop
        && point.y < rect.y + rect.height + slop
      ) {
        // Find distance from click to center of element
        const dx = Math.max(rect.x - point.x, point.x - (rect.x + rect.width));
        const dy = Math.max(rect.y - point.y, point.y - (rect.y + rect.height));
        return { ...element, distance: Math.sqrt(dx * dx + dy * dy) };
      }
      return { ...element, distance: Number.MAX_VALUE };
    })
    .sort((a, b) => a.distance - b.distance);

  return elements.find(
    (el) => el.path === distances[0].path && distances[0].distance < Number.MAX_VALUE,
  );
};

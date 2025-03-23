import type { SkPoint } from '@shopify/react-native-skia';

import type { DrawingElements, ResizeMode } from '../types';

import { getBoundingBox } from './getBoundingBox';

const hitSlop = 8;

export const findResizeMode = (
  point: SkPoint,
  selectedElements: DrawingElements,
): ResizeMode | undefined => {
  const bounds = getBoundingBox(selectedElements);
  if (!bounds) {
    return undefined;
  }

  if (
    point.x >= bounds.x - hitSlop
    && point.x <= bounds.x + hitSlop
    && point.y >= bounds.y - hitSlop
    && point.y <= bounds.y + hitSlop
  ) {
    return 'topLeft';
  }
  if (
    point.x >= bounds.x + bounds.width - hitSlop
    && point.x <= bounds.x + bounds.width + hitSlop
    && point.y >= bounds.y - hitSlop
    && point.y <= bounds.y + hitSlop
  ) {
    return 'topRight';
  }
  if (
    point.x >= bounds.x + bounds.width - hitSlop
    && point.x <= bounds.x + bounds.width + hitSlop
    && point.y >= bounds.y + bounds.height - hitSlop
    && point.y <= bounds.y + bounds.height + hitSlop
  ) {
    return 'bottomRight';
  }
  if (
    point.x >= bounds.x - hitSlop
    && point.x <= bounds.x + hitSlop
    && point.y >= bounds.y + bounds.height - hitSlop
    && point.y <= bounds.y + bounds.height + hitSlop
  ) {
    return 'bottomLeft';
  }


  if (
    point.x >= bounds.x + bounds.width / 2 - hitSlop
    && point.x <= bounds.x + bounds.width / 2 + hitSlop
    && point.y >= bounds.y - hitSlop
    && point.y <= bounds.y + hitSlop
  ) {
    return 'midTop';
  }
  if (
    point.x >= bounds.x + bounds.width / 2 - hitSlop
    && point.x <= bounds.x + bounds.width / 2 + hitSlop
    && point.y >= bounds.y + bounds.height - hitSlop
    && point.y <= bounds.y + bounds.height + hitSlop
  ) {
    return 'midBottom';
  }

  if (
    point.x >= bounds.x - hitSlop
    && point.x <= bounds.x + hitSlop
    && point.y >= bounds.y + bounds.height / 2 - hitSlop
    && point.y <= bounds.y + bounds.height / 2 + hitSlop
  ) {
    return 'midLeft';
  }

  if (
    point.x >= bounds.x + bounds.width - hitSlop
    && point.x <= bounds.x + bounds.width + hitSlop
    && point.y >= bounds.y + bounds.height / 2 - hitSlop
    && point.y <= bounds.y + bounds.height / 2 + hitSlop
  ) {
    return 'midRight';
  }

  return undefined;
};

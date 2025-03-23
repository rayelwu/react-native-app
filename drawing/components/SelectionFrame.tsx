/* eslint-disable react/function-component-definition */
import React, { useRef } from 'react';
import { DashPathEffect, Group, Rect, SkRect } from '@shopify/react-native-skia';

import { SelectionResizeHandle } from './SelectionHandle';
import { DrawingElements } from '../utils/types';
import { getBoundingBox } from '../utils/functions/getBoundingBox';
import { SelectionRotateHandle } from './SelectionRotateHandle';

type Props = {
  selectedElements: DrawingElements;
};

export const SelecctionHandleSize = 10;

export const SelectionFrame: React.FC<Props> = ({ selectedElements }) => {
  const boundingBoxRef = useRef<SkRect | undefined>(undefined);
  boundingBoxRef.current = getBoundingBox(selectedElements);

  return selectedElements.length > 0 && (
    <Group>
      {/** Rect around selected elements */}
      <Rect
        rect={boundingBoxRef.current!}
        color="#4185F4"
        strokeWidth={2}
        style="stroke"
      >
        <DashPathEffect intervals={[4, 4]} />
      </Rect>
      <Rect
        rect={boundingBoxRef.current!}
        color="#4185F418"
        style="fill"
      />
      {/* Resize handles */}
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x}
        y={() => boundingBoxRef.current!.y}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width}
        y={() => boundingBoxRef.current!.y}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height}
        size={SelecctionHandleSize}
      />
      {/* Rotate handles */}
      <SelectionRotateHandle
        x={() => boundingBoxRef.current!.x - 10}
        y={() => boundingBoxRef.current!.y - 10}
        rotate={180}
      />
      <SelectionRotateHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width + 10}
        y={() => boundingBoxRef.current!.y - 10}
        rotate={-90}
      />
      <SelectionRotateHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width + 10}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height + 10}
        rotate={0}
      />
      <SelectionRotateHandle
        x={() => boundingBoxRef.current!.x - 10}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height + 10}
        rotate={90}
      />
      {/* Mid control handlers */}

      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width / 2}
        y={() => boundingBoxRef.current!.y}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height / 2}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width / 2}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height}
        size={SelecctionHandleSize}
      />
      <SelectionResizeHandle
        x={() => boundingBoxRef.current!.x + boundingBoxRef.current!.width}
        y={() => boundingBoxRef.current!.y + boundingBoxRef.current!.height / 2}
        size={SelecctionHandleSize}
      />
    </Group>
  );
};

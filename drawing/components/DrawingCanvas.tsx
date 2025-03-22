import {
  Canvas,
  DashPathEffect,
  DiscretePathEffect,
  Fill,
  Group,
  Image,
  SkRect,
  SkPath,
  Paint,
  Path,
  Rect,
  SkiaDomView,
  SkPoint,
  Skia,
  useImage,
} from '@shopify/react-native-skia';
import React, {
  Ref,
  RefAttributes,
  RefObject, useEffect, useMemo, useRef, useState,
} from 'react';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { useDrawContext } from '../Hooks/useDrawContext';
import { getBounds } from '../utils/functions/getBounds';
import { toColor } from '../utils/functions/toColor';
import { DrawingElement, DrawingElements } from '../utils/types';
import { SelectionFrame } from './SelectionFrame';
import { useUxContext } from '../Hooks/useUxContext';
import { createPath } from '../utils/functions/path';
import { findClosestElementToPoint } from '../utils/functions/findClosestElementToPoint';
import { getBoundingBox } from '../utils/functions/getBoundingBox';
import { findResizeMode } from '../utils/functions/findResizeMode';
import { pointInRect } from '../utils/functions/pointInRect';
import { resizeElementsBy } from '../utils/functions/resizeElements';
import { findElementsInRect } from '../utils/functions/findElementsInRect';

interface MessageProps {
  innerRef: RefObject<SkiaDomView>;
  style: StyleProp<ViewStyle>;
}

export default function DrawingCanvas({ innerRef, style }: MessageProps) {
  const drawContext = useDrawContext();
  const uxContext = useUxContext();
  const [elements, setElements] = useState(drawContext.state.elements);
  const [backgroundColor, setBackgroundColor] = useState(drawContext.state.backgroundColor);
  const [selectedElements, setSelectedElements] = useState<DrawingElements>();
  const [selectionRect, setSelectionRect] = useState<SkRect>();
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(8); // Grid cell size in pixels

  const prevPointRef = useRef<SkPoint>();

  useEffect(() => {
    const unsubscribeDraw = drawContext.addListener((state) => {
      setElements([...state.elements]);
      setBackgroundColor(state.backgroundColor);
      setSelectionRect(state.currentSelectionRect);
      setSelectedElements([...state.selectedElements]);
    });
    return () => {
      unsubscribeDraw();
    };
  }, [drawContext, innerRef]);


  const elementComponents = useMemo(() => elements.map((element: DrawingElement, index) => {
    switch (element.type) {
      case 'image':

        return (
          <Image
            fit="fill"
            key={index}
            image={element.image}
            rect={getBounds(element)}
          />
        );
      default:
        switch (element.pathType) {
          case 'discreted':
            return (
              <Group key={index}>
                <Path
                  path={element.path}
                  color={element.color}
                  style="stroke"
                  strokeWidth={element.size}
                  strokeCap="round"
                >
                  <DiscretePathEffect length={3} deviation={5} />
                </Path>
              </Group>
            );
          case 'dashed':
            return (
              <Group key={index}>
                <Path
                  path={element.path}
                  color={element.color}
                  style="stroke"
                  strokeWidth={element.size}
                  strokeCap="round"
                >
                  <DashPathEffect intervals={[element.size * 2, element.size * 2]} />
                </Path>
              </Group>
            );
          default:
            return (
              <Path
                key={index}
                path={element.path}
                color={element.color}
                style="stroke"
                strokeWidth={element.size}
                strokeCap="round"
              />
            );
        }
    }
  }), [elements]);

  // Grid component
  const Grid = useMemo(() => {
    if (!showGrid) return null;

    const gridPath = Skia.Path.Make();
    const mainGridPath = Skia.Path.Make();
    const canvasWidth = 2000; // You might want to get actual canvas dimensions
    const canvasHeight = 2000;

    // Draw vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      gridPath.moveTo(x, 0);
      gridPath.lineTo(x, canvasHeight);
    }
    for (let x = 0; x <= canvasWidth; x += 4 * gridSize) {
      mainGridPath.moveTo(x, 0);
      mainGridPath.lineTo(x, canvasHeight);
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      gridPath.moveTo(0, y);
      gridPath.lineTo(canvasWidth, y);
    }
    for (let y = 0; y <= canvasHeight; y += 4 * gridSize) {
      mainGridPath.moveTo(0, y);
      mainGridPath.lineTo(canvasWidth, y);
    }

    return (
      <Group>
        <Path
          path={gridPath}
          color="rgba(200, 200, 200, 0.2)"
          style="stroke"
          strokeWidth={1}
        />
        <Path
          path={mainGridPath}
          color="rgba(200, 200, 200, 0.4)"
          style="stroke"
          strokeWidth={1}
        />
      </Group>
    );
  }, [showGrid, gridSize]);

  return (
    <Canvas
      ref={innerRef}
      style={style}

      onTouchMove={(event: GestureResponderEvent) => {
        const x = event.nativeEvent.locationX;
        const y = event.nativeEvent.locationY;

        switch (uxContext.state.menu) {
          case undefined:
          case 'drawing':
          case 'chooseSticker':
          case 'colors': {
            const element = drawContext.state.elements[drawContext.state.elements.length - 1];
            const xMid = (prevPointRef.current!.x + x) / 2;
            const yMid = (prevPointRef.current!.y + y) / 2;
            element.path.quadTo(
              prevPointRef.current!.x,
              prevPointRef.current!.y,
              xMid,
              yMid,
            );


            setElements([...drawContext.state.elements]);
            break;
          }
          case 'selection': {
            if (drawContext.state.selectedElements.length > 0) {
              resizeElementsBy(
                x - prevPointRef.current!.x,
                y - prevPointRef.current!.y,
                drawContext.state.resizeMode,
                drawContext.state.selectedElements,
              );
            } else {
              if (drawContext.state.currentSelectionRect) {
                drawContext.commands.setSelectionRect({
                  x: drawContext.state.currentSelectionRect!.x,
                  y: drawContext.state.currentSelectionRect!.y,
                  width: x - drawContext.state.currentSelectionRect!.x,
                  height: y - drawContext.state.currentSelectionRect!.y,
                });
              }
            }
            setElements([...drawContext.state.elements]);
            break;
          }
          default:
            break;
        }
        prevPointRef.current = { x, y };
      }}
      onTouchStart={({ nativeEvent }: GestureResponderEvent) => {
        const x = nativeEvent.locationX;
        const y = nativeEvent.locationY;

        switch (uxContext.state.menu) {
          case undefined:
          case 'drawing':
          case 'chooseSticker':
          case 'colors': {
            const { color, size, pathType } = drawContext.state;

            console.log('start', x, y, pathType)

            drawContext.commands.addElement(createPath(x, y, color, size, pathType));
            break;
          }
          case 'selection': {
            const el = findClosestElementToPoint(
              { x, y },
              drawContext.state.elements,
            );

            if (el && drawContext.state.selectedElements.length === 0) {
              drawContext.commands.setSelectedElements(el);
              drawContext.commands.setSelectionRect(undefined);
              break;
            }

            const bounds = getBoundingBox(drawContext.state.selectedElements);

            if (bounds && pointInRect({ x, y }, bounds)) {
              drawContext.commands.setResizeMode(
                findResizeMode({ x, y }, drawContext.state.selectedElements),
              );
            } else {
              if (el) {
                drawContext.commands.setSelectedElements(el);
              } else {
                drawContext.commands.setSelectedElements();
                drawContext.commands.setSelectionRect({
                  x,
                  y,
                  width: 0,
                  height: 0,
                });
              }
            }
            break;
          }
          default:
            break;
        }
        prevPointRef.current = { x, y };
      }}
      onTouchEnd={() => {
        switch (uxContext.state.menu) {
          case 'selection': {
            if (drawContext.state.currentSelectionRect) {
              const elements = findElementsInRect(
                drawContext.state.currentSelectionRect,
                drawContext.state.elements,
              );
              if (elements) {
                drawContext.commands.setSelectedElements(...elements);
              }
              drawContext.commands.setSelectionRect(undefined);
            }
            break;
          }
          default:
            break;
        }
      }}
    >

      <Fill color={'#fefefe'} />

      {/* Add Grid before drawing elements */}
      {Grid}

      {elementComponents}

      {
        selectedElements && (
          <SelectionFrame selectedElements={selectedElements} />
        )
      }
      {
        selectionRect && (
          <Group>
            <Rect
              color={'#4185f411'}
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
            >
              <Paint style="stroke" strokeWidth={2} color="#4185f4">
                <DashPathEffect intervals={[4, 4]} />
              </Paint>
            </Rect>
          </Group>
        )
      }
    </Canvas>
  );
}


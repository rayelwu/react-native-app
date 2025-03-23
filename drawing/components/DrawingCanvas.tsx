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
  SkMatrix,
  Circle,
  toDegrees,
  Line,
} from '@shopify/react-native-skia';
import React, {
  Ref,
  RefAttributes,
  RefObject, useEffect, useMemo, useRef, useState,
} from 'react';
import { Button, GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native';
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
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { angle } from '../utils/functions/helpers';

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

  const prevLocationRef = useRef<SkPoint>();


  const [cursorScreenLocation, setCursorScreenLocation] = useState({ x: 0, y: 0 })
  const [archorLocation, setArchorLocation] = useState({ x: 0, y: 0 })
  const [handleLocation, setHandleLocation] = useState({ x: 0, y: 0 })
  const [currentMatrix, setCurrentMatrix] = useState(Skia.Matrix());
  const [enableMultiTouchSimulating, setEnableMultiTouchSimulating] = useState(false);
  const [initialState, setiInitialState] = useState<null | {
    distance: number,
    angle: number,
    center: SkPoint
  }>(null)


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


  function mapPoint(matrix: SkMatrix, point: { x: number, y: number }) {
    // 获取矩阵的 9 个元素
    const [a, b, c, d, e, f, g, h, i] = matrix.get();

    // 获取输入点的坐标
    const x = point.x;
    const y = point.y;

    // 计算 w'（透视分量）
    const wPrime = g * x + h * y + i;

    // 避免除以 0 的情况
    if (wPrime === 0) {
      return { x: 0, y: 0 }; // 根据实际需求可调整返回值
    }

    // 计算变换后的坐标 x' 和 y'
    const xPrime = (a * x + b * y + c) / wPrime;
    const yPrime = (d * x + e * y + f) / wPrime;

    // 返回新点
    return { x: xPrime, y: yPrime };
  }

  function invertMatrix(matrix: SkMatrix): null | SkMatrix {
    const [a, b, c, d, e, f, g, h, i] = matrix.get();

    // 计算行列式
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (det === 0) {
      return null; // 矩阵不可逆
    }

    const invDet = 1 / det;
    return Skia.Matrix([
      (e * i - f * h) * invDet,  // 0
      (c * h - b * i) * invDet,  // 1
      (b * f - c * e) * invDet,  // 2
      (f * g - d * i) * invDet,  // 3
      (a * i - c * g) * invDet,  // 4
      (c * d - a * f) * invDet,  // 5
      (d * h - e * g) * invDet,  // 6
      (b * g - a * h) * invDet,  // 7
      (a * e - b * d) * invDet,  // 8
    ]);
  }
  const getWorldPoint = (screenPoint: { x: number, y: number }) => {
    const inverseMatrix = invertMatrix(currentMatrix);
    if (inverseMatrix) {
      return mapPoint(inverseMatrix, screenPoint); // 返回 { x, y }
    }
    return screenPoint; // 如果不可逆，返回原始坐标
  };
  const updateMatrix = (scale: number, rotation: number, center: { x: number, y: number }) => {
    const newMatrix = Skia.Matrix()
      .translate(center.x, center.y) // 平移到中心
      .scale(scale, scale)          // 应用缩放
      .rotate(rotation)             // 应用旋转
      .translate(-center.x, -center.y); // 平移回来

    // 将新变换与当前矩阵组合
    //const updatedMatrix = currentMatrix.concat(newMatrix);
    const updatedMatrix = newMatrix
    setCurrentMatrix(updatedMatrix);
  };
  return (
    <View>

      <Canvas
        ref={innerRef}
        style={[style, { position: 'absolute', backgroundColor: '#0000', top: 0, left: 0 }]}

        onTouchMove={(event: GestureResponderEvent) => {
          const x = event.nativeEvent.locationX;
          const y = event.nativeEvent.locationY;


          if ((enableMultiTouchSimulating || event.nativeEvent.touches.length === 2) && initialState) {
            const screenLocation = { x, y }
            setHandleLocation(screenLocation)
            var p1;
            var p2;

            if (event.nativeEvent.touches.length == 2) {
              p1 = { x: event.nativeEvent.touches[0].locationX, y: event.nativeEvent.touches[0].locationY };
              p2 = { x: event.nativeEvent.touches[1].locationX, y: event.nativeEvent.touches[1].locationY };
            } else {
              p1 = archorLocation;
              p2 = screenLocation;
            }
            //const [touch1, touch2] = [archorLocation, screenLocation];
            const [touch1, touch2] = [p1, p2];
            const dx = touch2.x - touch1.x;
            const dy = touch2.y - touch1.y;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            const currentAngle = Math.atan2(dy, dx);

            const scale = currentDistance / initialState.distance;
            const rotation = currentAngle - initialState.angle;
            const center = initialState.center;

            console.log(rotation)

            updateMatrix(scale, toDegrees(rotation), center);
            setElements([...drawContext.state.elements]);
            return;
          }

          switch (uxContext.state.menu) {
            case undefined:
            case 'drawing':
            case 'chooseSticker':
            case 'colors': {
              const element = drawContext.state.elements[drawContext.state.elements.length - 1];
              const xMid = (prevLocationRef.current!.x + x) / 2;
              const yMid = (prevLocationRef.current!.y + y) / 2;

              const s = getWorldPoint(prevLocationRef.current!)
              const e = getWorldPoint({ x: xMid, y: yMid })
              element.path.quadTo(
                s.x,
                s.y,
                e.x,
                e.y,
              );


              setElements([...drawContext.state.elements]);
              break;
            }
            case 'selection': {
              if (drawContext.state.selectedElements.length > 0) {

                var angleRad = 0;
                const selectRect = getBoundingBox(drawContext.state.selectedElements)
                if (selectRect != null) {
                  const rotateOrigin = { x: (selectRect.x + selectRect.width) / 2, y: (selectRect.y + selectRect.height) / 2 }
                  angleRad = angle({ x, y }, rotateOrigin) - angle(prevLocationRef.current!, rotateOrigin)
                }

                resizeElementsBy(
                  x - prevLocationRef.current!.x,
                  y - prevLocationRef.current!.y,
                  angleRad,
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
          prevLocationRef.current = { x, y };
        }}
        onTouchStart={({ nativeEvent }: GestureResponderEvent) => {
          const screenX = nativeEvent.locationX;
          const screenY = nativeEvent.locationY;



          // 转换屏幕坐标到世界坐标
          //const { x, y } = {screenX, screenY};
          const x = screenX;
          const y = screenY;



          if (enableMultiTouchSimulating || nativeEvent.touches.length === 2) {
            var p1;
            var p2;
            setCursorScreenLocation({ x: screenX, y: screenY })
            if (nativeEvent.touches.length == 2) {
              p1 = { x: nativeEvent.touches[0].locationX, y: nativeEvent.touches[0].locationY };
              p2 = { x: nativeEvent.touches[1].locationX, y: nativeEvent.touches[1].locationY };
            } else {
              p1 = archorLocation
              p2 = { x, y }
            }
            const [touch1, touch2] = [p1, p2];
            const dx = touch2.x - touch1.x;
            const dy = touch2.y - touch1.y;
            setiInitialState({
              distance: Math.sqrt(dx * dx + dy * dy),
              angle: Math.atan2(dy, dx),
              center: { x: (touch1.x + touch2.x) / 2, y: (touch1.y + touch2.y) / 2 },
            });
            prevLocationRef.current = { x, y };
            return;
          }


          console.log('menu', uxContext.state.menu)

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

              if (bounds && pointInRect({ x, y }, bounds, 30)) {
                const resizeMode = findResizeMode({ x, y }, drawContext.state.selectedElements)
                console.log('resizeMode', resizeMode)

                drawContext.commands.setResizeMode(resizeMode);
              } else {
                drawContext.commands.setResizeMode(undefined);
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
          prevLocationRef.current = { x, y };
        }}
        onTouchEnd={() => {
          if (enableMultiTouchSimulating) {
            setiInitialState(null)
            return;
          }
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


        <Group matrix={currentMatrix}>
          {Grid}
          {elementComponents}
        </Group>

        {enableMultiTouchSimulating &&
          <Group>
            <Circle cx={cursorScreenLocation.x} cy={cursorScreenLocation.y} color={'#5f5'} r={10} />
            <Circle cx={handleLocation.x} cy={handleLocation.y} color={'#5f55'} r={10} />
            <Circle cx={archorLocation.x} cy={archorLocation.y} color={'#fcc'} r={10} />
            <Line p1={archorLocation} p2={cursorScreenLocation} />
            <Line p1={archorLocation} p2={handleLocation} />
          </Group>
        }

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

      <View style={{ flexDirection: 'row', margin: 20, position: 'absolute', gap: 10, top: 10, right: 10 }}>

        {enableMultiTouchSimulating && (
          <Button
            title={`Set Archor Location (${archorLocation.x.toFixed(0)},${archorLocation.y.toFixed(0)})`}
            onPress={() => setArchorLocation(cursorScreenLocation)}
          />
        )}

        <Button
          title={`Reset Transform`}
          onPress={() => {
            setCurrentMatrix(Skia.Matrix())
            setArchorLocation({ x: 0, y: 0 })
            setHandleLocation({ x: 0, y: 0 })
            setCursorScreenLocation({ x: 0, y: 0 })
            setEnableMultiTouchSimulating(false)
          }}
        />
        <Button
          title={`${!enableMultiTouchSimulating ? 'Enable Multi-Touch Simulating' : 'Disable Multi-Touch Simulating'}`}
          onPress={() => setEnableMultiTouchSimulating(!enableMultiTouchSimulating)}
        />
      </View>
    </View>
  );
}


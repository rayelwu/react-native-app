/* eslint-disable no-return-assign */
import { SkColor, SkRect, Skia } from '@shopify/react-native-skia';
import React, { ReactNode, useMemo } from 'react';
import {
  DrawContextType, DrawingElement, DrawingElements, DrawState, PathType, TransformMode,
} from '../utils/types';

export const DrawContext = React.createContext<DrawContextType | undefined>(
  undefined,
);

const createDrawProviderValue = (): DrawContextType => {
  const state: DrawState = {
    size: 2,
    color: Skia.Color('#000000'),
    pathType: 'normal',
    elements: [],
    selectedElements: [],
    currentSelectionRect: undefined,
    resizeMode: undefined,
    backgroundColor: Skia.Color('#eeeeee'),
  };

  const listeners = [] as ((state: DrawState) => void)[];
  const notifyListeners = (s: DrawState) => listeners.forEach((l) => l(s));

  const commands = {
    setColor: (color: SkColor) => {
      state.color = color;
      state.selectedElements.forEach((e: DrawingElement) => {
        if (e.type === 'path') {
          e.color = color;
        }
      });
      notifyListeners(state);
    },
    setBackgroundColor: (color: SkColor) => {
      state.backgroundColor = color;
      notifyListeners(state);
    },
    setPathType: (type: PathType) => {
      state.pathType = type;
      notifyListeners(state);
    },
    setSize: (size: number) => {
      state.size = size;
      state.selectedElements.forEach((e: DrawingElement) => {
        if (e.type === 'path') {
          e.size = size;
        }
      });
      notifyListeners(state);
    },
    addElement: (element: DrawingElement) => {
      state.elements.push(element);
      notifyListeners(state);
    },
    deleteSelectedElements: () => {
      state.elements = state.elements.filter(
        (el) => !state.selectedElements.includes(el),
      );
      state.selectedElements = [];
      notifyListeners(state);
    },
    deleteAllElements: () => {
      state.elements = [];
      state.selectedElements = [];
      notifyListeners(state);
    },
    setSelectedElements: (...elements: DrawingElements) => {
      state.selectedElements = elements;
      notifyListeners(state);
    },
    setSelectionRect: (rect: SkRect | undefined) => {
      state.currentSelectionRect = rect;
      notifyListeners(state);
    },
    setResizeMode: (resizeMode: TransformMode | undefined) => {
      state.resizeMode = resizeMode;
      notifyListeners(state);
    },
    cleanUseless: async () => {
      state.selectedElements = [];
      notifyListeners(state);
    },
  };

  return {
    state,
    commands,
    addListener: (cb: (state: DrawState) => void) => {
      listeners.push(cb);
      return () => listeners.splice(listeners.indexOf(cb), 1);
    },
  };
};

export const useDrawProvider = () => {
  const uxContext = useMemo(() => createDrawProviderValue(), []);
  const retVal: React.FC<{ children: ReactNode }> = ({ children }) => (
    <DrawContext.Provider value={uxContext}>{children}</DrawContext.Provider>
  );
  return retVal;
};

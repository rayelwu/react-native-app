import React, { useMemo, useRef } from 'react';
import { StyleSheet, useWindowDimensions, SafeAreaView, View } from 'react-native';
import ModalConfirm from './components/ModalConfirm';
import { useDrawProvider } from './Hooks/useDrawProvider';
import { useUxProvider } from './Hooks/useUxProvider';

import DrawPicker from './Toolbar/SecondsItems/DrawPicker';
import StickerPicker from './Toolbar/SecondsItems/StickerPicker';
import Toolbar from './Toolbar/Toolbar';
import { TOOLBAR_MARGIN } from './utils/constants';
import DrawingCanvas from './components/DrawingCanvas';
import ColorPicker from './Toolbar/SecondsItems/ColorPicker';

const createStyle = (width: number, height: number) => StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#fff',
  },
  message: {
    height: height,
    width: width,
  },
  tools: {
    position: 'absolute',
    left: TOOLBAR_MARGIN,
    bottom: height * 0.10,
  },
  secondsTools: {
    position: 'absolute',
    left: TOOLBAR_MARGIN,
    right: TOOLBAR_MARGIN,
    bottom: height * 0.10 + 45 + 30,
  },
});

function DrawingScreen() {
  const skiaViewRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const styles = useMemo(() => createStyle(width, height), [width, height]);

  const UxProvider = useUxProvider();
  const DrawProvider = useDrawProvider();

  return (
    <UxProvider>
      <DrawProvider>
        <DrawingCanvas innerRef={skiaViewRef} style={{
          height: height,
          width: width,
        }} />

        <Toolbar
          innerRef={skiaViewRef}
          style={{
            position: 'absolute',
            left: 10,
            bottom: height * 0.10,
          }} />

        <DrawPicker
          style={{
            position: 'absolute',
            left: 90,
            bottom: height * 0.10 + 45 + 30,
          }}
        />


        <ColorPicker
          style={{
            position: 'absolute',
            left: 90,
            bottom: height * 0.10 + 45 + 30,
            backgroundColor: '#fff',
            borderRadius: 16
          }}
        />
        <StickerPicker
          style={{
            position: 'absolute',
            left: 90,
            backgroundColor: '#fff',
            width: 300,
            borderRadius: 16,
            bottom: height * 0.10 + 45 + 30,
          }} />
        <ModalConfirm />
      </DrawProvider>
    </UxProvider>
  );
}

export default DrawingScreen;

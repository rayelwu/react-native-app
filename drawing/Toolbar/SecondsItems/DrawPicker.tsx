import {
  Canvas, DashPathEffect, DiscretePathEffect, Line, Paint,
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import { useDrawContext } from '../../Hooks/useDrawContext';
import { useUxContext } from '../../Hooks/useUxContext';
import { PathType } from '../../utils/types';
import { height, width } from '@/drawing/utils/constants';

interface DrawPickerProps {
  style: ViewStyle;
}

interface DrawLinesProps {
  isSelected: boolean;
  type: PathType;
  onPress: (type: any) => void
}

function DrawLines({ isSelected, type, onPress }: DrawLinesProps) {
  const [dimension, setDimension] = useState({ width: 50, height: 50 })
  return (
    <TouchableOpacity onPress={() => onPress(type)} style={ isSelected && { backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 16}}>
      <Canvas
        style={[{ height: 50 }]}
      >
        <Line
          p1={{ x: 10, y: dimension.height / 2 }}
          p2={{ x: dimension.width - 10, y: dimension.height / 2 }}
          strokeWidth={5}
          color="#000"
          strokeCap="round"
        >
          {type === 'dashed' && (
            <DashPathEffect intervals={[10, 10]} />
          )}
          {type === 'discreted' && (
            <DiscretePathEffect
              length={3}
              deviation={5}
            />
          )}
        </Line>
      </Canvas>
    </TouchableOpacity>
  );
}

const pathTypes: PathType[] = ['normal', 'dashed', 'discreted'];

function DrawPicker({ style }: DrawPickerProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [visible, setVisible] = useState(uxContext.state.menu === 'drawing');
  const [pathTypeSelected, setPathTypeSelected] = useState(drawContext.state.pathType);

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setVisible(state.menu === 'drawing');
    });
    const unsubscribeDraw = drawContext.addListener((state) => {
      setPathTypeSelected(state.pathType);
    });
    return () => {
      unsubscribeDraw();
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const onPress = (type: PathType) => {
    drawContext.commands.setPathType(type);
  };

  return visible ? (
    <View
      style={[
        style,
        {
          backgroundColor: '#fff',
          flexDirection: 'column',
          borderRadius: 16,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#ddd',
          padding: 10,
          width: 100
        }
      ]}
    >
      {
        pathTypes.map((type) => (
          <DrawLines
            key={type}
            isSelected={pathTypeSelected === type}
            type={type}
            onPress={(type: PathType)=>{
              onPress(type);
              setTimeout(()=>setVisible(false), 500)
            }}
          />
        ))
      }
    </View>
  ) : null;
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'column',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDD',
    width: 100,
    // shadowColor: '#000',
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 5 },
    // elevation: 4,
    // marginRight: 150,
  },
});

export default DrawPicker;

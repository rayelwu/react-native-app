import { ImageFormat, SkiaDomView } from '@shopify/react-native-skia';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';

import { TOOLBAR_HEIGHT } from '../utils/constants';
import { useUxContext } from '../Hooks/useUxContext';
import { useDrawContext } from '../Hooks/useDrawContext';
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Menu } from '../utils/types';

type ToolbarProps = {
  innerRef: React.RefObject<SkiaDomView>;
  style: ViewStyle;
};

interface Tool {
  name: Menu;
  icon: ReactNode;
}

function Toolbar({ innerRef, style }: ToolbarProps) {
  const uxContext = useUxContext();
  const drawContext = useDrawContext();
  const [activeTool, setActiveTool] = useState(uxContext.state.menu);
  const [color, setColor] = useState(drawContext.state.color);
  const [backgroundColor, setBackgroundColor] = useState(drawContext.state.backgroundColor);
  const [size, setSize] = useState(drawContext.state.size);
  const [haveElements, setHaveElements] = useState(
    drawContext.state.elements.length > 0,
  );

  useEffect(() => {
    const unsubscribeUx = uxContext.addListener((state) => {
      setActiveTool(state.menu);
    });
    const unsubscribeDraw = drawContext.addListener((state) => {
      setColor(state.color);
      setBackgroundColor(state.backgroundColor);
      setHaveElements(state.elements.length > 0);
      setSize(state.size);
    });
    return () => {
      unsubscribeDraw();
      unsubscribeUx();
    };
  }, [drawContext, uxContext]);

  const share = async () => {
    await drawContext.commands.cleanUseless();
    const image = innerRef.current?.makeImageSnapshot();
    if (image) {
      const data = image.encodeToBase64(ImageFormat.JPEG, 100);
      const url = `data:image/png;base64,${data}`;
      const shareOptions = {
        title: 'Sharing image from awesome drawing app',
        message: 'My drawing',
        url,
        failOnCancel: false,
      };
      //await Share.open(shareOptions);

    }
  };


  const tools: Tool[] = [
    {
      name: 'drawing',
      icon: <FontAwesome name='pencil' size={24} />
    },
    {
      name: 'chooseSticker',
      icon: <FontAwesome name='sticky-note' size={24} />
    },
    {
      name: 'selection',
      icon: <MaterialCommunityIcons name='selection-drag' size={24} />
    },
    {
      name: 'colors',
      icon: <Ionicons name="color-palette" size={24} color="black" />
    },
  ]

  return (
    <View style={[
      style,
      {
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 16,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ddd',
      }
    ]}>

      {
        tools.map(t => (
          <TouchableOpacity
            key={t.name}
            onPress={() => uxContext.commands.toggleMenu(t.name)}
            style={[activeTool === t.name ? { padding: 10, backgroundColor: '#eee', borderRadius: 16 } : { padding: 10 }]}
            hitSlop={{
              top: 10, bottom: 10, left: 10, right: 10,
            }}
          >
            {t.icon}
          </TouchableOpacity>)
        )
      }

      <TouchableOpacity
        disabled={!haveElements}
        onPress={() => {
          if (drawContext.state.selectedElements.length === 0) {
            uxContext.commands.toggleModal(true);
          } else {
            drawContext.commands.deleteSelectedElements();
          }
        }}
        style={{ padding: 10 }}
        hitSlop={{
          top: 10, bottom: 10, left: 10, right: 10,
        }}
      >
        <MaterialIcons name="delete" size={24} color="black" />
      </TouchableOpacity>

    </View >
  );
}

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    // shadowColor: '#000',
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 5 },
    // elevation: 4,
  },
});

const toolsStyles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: TOOLBAR_HEIGHT - 5,
    height: TOOLBAR_HEIGHT - 5,
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  disabled: {
    opacity: 0.4,
  },
});

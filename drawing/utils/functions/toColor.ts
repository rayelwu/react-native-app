/* eslint-disable no-param-reassign */

import { SkColor } from "@shopify/react-native-skia";

/* eslint-disable no-bitwise */
export const toColor = (
  num: SkColor,
  rgba: boolean = true,
) => {
  if (rgba) {
    return skColorToRgba(num);
  }
  return skColorToHex(num);
};


function skColorToHex(skColor: SkColor): string {
  const [r, g, b] = skColor;
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);
  // 转换为两位 16 进制并拼接
  const hex = [rInt, gInt, bInt]
    .map((val) => val.toString(16).padStart(2, '0'))
    .join('');
  return `#${hex}`;
}

// 将 SkColor 转换为 RGBA（如 rgba(255, 128, 0, 1)）
function skColorToRgba(skColor: SkColor): string {
  const [r, g, b, a] = skColor;
  const rInt = Math.round(r * 255);
  const gInt = Math.round(g * 255);
  const bInt = Math.round(b * 255);
  return `rgba(${rInt}, ${gInt}, ${bInt}, ${a})`;
}

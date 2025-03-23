import { Canvas, Circle, Group, Line, Rect } from "@shopify/react-native-skia";


interface GridProps {
    cellWidh: number;
    size: number;
}
export default function Grid({ cellWidh, size }: GridProps) {
    return <Group>
        {Array.from({ length: size }).map((_, row) =>
            Array.from({ length: size }).map((_, col) => (
                <Rect
                    key={`${row}-${col}`}
                    x={row * cellWidh}
                    y={col * cellWidh}
                    width={cellWidh}
                    height={cellWidh}
                    color={'#eee'}
                    strokeWidth={1}
                />
            )))}
    </Group>
}
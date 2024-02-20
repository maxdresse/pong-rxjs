export function rgb2Col(r: number, g: number, b: number, a = 1): string {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function rgb(rgb: Array<number>, a = 1): string {
    const [r, g, b] = rgb;
    return rgb2Col(r, g, b, a);
}

const colorDelta = 30;

export function lighten(cols: Array<number>): Array<number> {
    return translateCol(cols, colorDelta);
}

export function darken(cols: Array<number>): Array<number> {
    return translateCol(cols, -colorDelta);
}

export function translateCol(cols: Array<number>, d: number): Array<number> {
    return cols.map((c, idx) => idx <= 2 ? Math.max(0, c + d) : c);
}
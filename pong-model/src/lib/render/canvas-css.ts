import { GameParameters, IColorScheme } from '../types';
import { TEXT_COL_CSS_PROP } from './render-constants';

let lastColScheme: IColorScheme | undefined;
let lastPaused: boolean | undefined;

export function updateCanvasCssProps(canvas: HTMLCanvasElement, params: GameParameters): void {
    updateFromColorScheme(canvas, params);
    updateFromPausedState(canvas, params);
}

function updateFromColorScheme(canvas: HTMLCanvasElement, params: GameParameters) {
    if (lastColScheme !== params.colorScheme) {
        updateCanvasBgColor(canvas, params);
        updateCssTextColor(canvas, params);
        lastColScheme = params.colorScheme;
    }
}

function updateFromPausedState(canvas: HTMLCanvasElement, params: GameParameters) {
    if (lastPaused !== params.paused) {
        updateCanvasOpacity(canvas, params);
        lastPaused = params.paused;
    }
}

function updateCssTextColor(canvas: HTMLCanvasElement, params: GameParameters) {
    const p = canvas.parentElement!;
    if (!p) {
        console.error('no canvas parent, could not update from theme');
    }
    p.style.setProperty(TEXT_COL_CSS_PROP, params.colorScheme.text);
}

function updateCanvasBgColor(canvas: HTMLCanvasElement, params: GameParameters) {
    canvas.style.backgroundColor = params.colorScheme.background;
}

function updateCanvasOpacity(canvas: HTMLCanvasElement, params: GameParameters) {
    canvas.style.opacity = params.paused ? '0.6' : '1';
}
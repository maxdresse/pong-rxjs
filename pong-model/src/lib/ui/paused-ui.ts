import { UIData } from '../types';

export function initPausedUI(canvas: HTMLCanvasElement, uiData: UIData): void {

    const paused$ = uiData.params.paused$;
    paused$.subscribe(p => {
        canvas.style.opacity = p ? '0.2' : '1';
    });

}


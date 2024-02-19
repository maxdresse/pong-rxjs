import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { DEFAULT_ZOOM } from './render/render-constants';
import { WORLD_HEIGHT, WORLD_WIDTH } from './physical-constants';

export const attachResizer = (canvas: HTMLCanvasElement, aspectRatio$: Observable<number>): { detachResizer: () => void; devicePxPerMeter$: Observable<number> } => {
    const sizeChanged$ = new Subject<void>();
    const devicePxPerMeter$ = new BehaviorSubject<number>(DEFAULT_ZOOM);
    const onResize = (aspectRatio: number) => {
        // aspect ratio is currently unused but might be needed
        // for other future rendererers
        const { width, height } = canvas.getBoundingClientRect();
        const domAspectRatio = width / (height ?? 1);
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        const domRectIsSlimmer = domAspectRatio < aspectRatio;
        const devicePxPerMeter = domRectIsSlimmer ? canvas.width / WORLD_WIDTH : canvas.height / WORLD_HEIGHT;
        devicePxPerMeter$.next(devicePxPerMeter);
    };
    const ro = new ResizeObserver(() => sizeChanged$.next());
    // react to size changes and to aspect ratio changes
    const sub = combineLatest([aspectRatio$, sizeChanged$])
        .subscribe(([aspectRatio]) => onResize(aspectRatio));
    ro.observe(canvas);
    return { 
        devicePxPerMeter$,
        detachResizer: () => {
            sub.unsubscribe();
            ro.unobserve(canvas);
    }};
}

import { Observable, Subject, combineLatest } from 'rxjs';

export const attachResizer = (canvas: HTMLCanvasElement, aspectRatio$: Observable<number>): { detachResizer: () => void } => {
    const sizeChanged$ = new Subject<void>();
    const onResize = (_aspectRatio: number) => {
        // aspect ratio is currently unused but might be needed
        // for other future rendererers
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

    };
    const ro = new ResizeObserver(() => sizeChanged$.next());
    // react to size changes and to aspect ratio changes
    const sub = combineLatest([aspectRatio$, sizeChanged$])
        .subscribe(([aspectRatio]) => onResize(aspectRatio));
    ro.observe(canvas);
    return { 
        detachResizer: () => {
            sub.unsubscribe();
            ro.unobserve(canvas);
    }};
}

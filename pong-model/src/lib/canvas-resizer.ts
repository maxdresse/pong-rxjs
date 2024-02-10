import { Observable, Subject, combineLatest } from 'rxjs';

export const attachResizer = (canvas: HTMLCanvasElement, aspectRatio$: Observable<number>): { detachResizer: () => void } => {
    const sizeChanged$ = new Subject<void>();
    const onResize = (aspectRatio: number) => {
        const { width, height } = canvas.getBoundingClientRect();
        const htmlAspectRatio = width / (height || 1);
        const keepWidth = htmlAspectRatio > aspectRatio;
        let newHeight, newWidth;
        if (keepWidth) {
            // case html canvas is "too broad" for the desired aspect ratio
            newWidth = width * window.devicePixelRatio;
            newHeight = newWidth / aspectRatio;
        } else {
            // case html canvas is "too thin"
            newHeight = height * window.devicePixelRatio;
            newWidth = newHeight * aspectRatio;
        }
        canvas.width = newWidth;
        canvas.height = newHeight;

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

// aspect ratio = w / h
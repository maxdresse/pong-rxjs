export const attachResizer = (canvas: HTMLCanvasElement, aspectRatio: number): { detachResizer: () => void } => {
    const ro = new ResizeObserver(() => {
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
        
    });
    ro.observe(canvas);
    return { detachResizer: () => ro.unobserve(canvas) };
}

// aspect ratio = w / h
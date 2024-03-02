const FRM_KEY = Symbol('frameKey');

type HasFrameCount = {
    [FRM_KEY]: number;
};

export function initFrameCount(): void {
    (window as unknown as HasFrameCount)[FRM_KEY] = 0;
}

export function getFrameCount(): number {
    return (window as unknown as HasFrameCount)[FRM_KEY];
}

const FRAME_WRAP_LIMIT = (4096 - 1); // must be power of 2 minus 1
export function incrementFrameCount(): void {
    (window as unknown as HasFrameCount)[FRM_KEY] = ((window as unknown as HasFrameCount)[FRM_KEY] + 1) & FRAME_WRAP_LIMIT;
}
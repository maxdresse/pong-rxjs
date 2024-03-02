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

export function incrementFrameCount(): void {
    (window as unknown as HasFrameCount)[FRM_KEY]++;
}
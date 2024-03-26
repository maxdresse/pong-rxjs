export function scheduleRevertFct(fct: () => void, timeout: number, revertFctBuffer: Array<() => void>): void {
    // todo: real scheduling
    removeFct(fct, revertFctBuffer);
    setTimeout(() => {
        fct();
        removeFct(fct, revertFctBuffer);
    }, timeout);
}

export function abortAllRevertFcts(revertFctBuffer: Array<() => void>): void {
    revertFctBuffer.length = 0;
}

function removeFct(fct: () => void, buf: Array<() => void>): void {
    const idx = buf.indexOf(fct);
    if (idx >= 0) {
        buf.splice(idx, 1);
    }
}
// idea use symbol and save timeout on fct object

export function scheduleRevertFct(fct: () => void, timeout: number, revertFctBuffer: Array<() => void>): void {
    addFct(fct, revertFctBuffer);
    setTimeout(() => {
        fct();
        removeFct(fct, revertFctBuffer);
    }, timeout);
}

export function abortAllRevertFcts(revertFctBuffer: Array<() => void>): void {
    revertFctBuffer.length = 0;
}

function addFct(fct: () => void, buf: Array<() => void>): void {
    removeFct(fct, buf);
    buf.push(fct);
}


function removeFct(fct: () => void, buf: Array<() => void>): void {
    const idx = buf.indexOf(fct);
    if (idx >= 0) {
        buf.splice(idx, 1);
    }
}
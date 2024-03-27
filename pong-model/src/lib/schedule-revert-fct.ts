const TO_KEY = Symbol('to');

type TO = ReturnType<typeof setTimeout>;

type HasTimeoutTag = {
    [TO_KEY]: TO;
}

type Fct = () =>  void;

export function scheduleRevertFct(fct: Fct, timeout: number, revertFctBuffer: Array<Fct>): void {
    const handle = setTimeout(() => {
        fct();
        removeFct(fct, revertFctBuffer);
    }, timeout);
    addFct(fct, revertFctBuffer, handle);
}

export function flushAllRevertFcts(revertFctBuffer: Array<Fct>): void {
    // execute all revert fcts, cancel scheduled timeouts
    // and empty the buffer
    revertFctBuffer.forEach(fct => {
        clearTimeout(getTimeoutHandle(fct));
        fct();
    });
    revertFctBuffer.length = 0;
}

function addFct(fct: Fct, buf: Array<Fct>, handle: TO): void {
    setTimeoutHandle(fct, handle);
    removeFct(fct, buf);
    buf.push(fct);
}

function removeFct(fct: Fct, buf: Array<Fct>): void {
    const idx = buf.indexOf(fct);
    if (idx >= 0) {
        buf.splice(idx, 1);
    }
}

function setTimeoutHandle(fct: Fct, toHandle: TO) {
    (fct as unknown as HasTimeoutTag)[TO_KEY] = toHandle;
}


function getTimeoutHandle(fct: Fct) {
    return (fct as unknown as HasTimeoutTag)[TO_KEY];
}
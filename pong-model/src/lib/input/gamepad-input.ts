import { Observable, Subscription } from 'rxjs';
import { InputFactory } from '../types';
import { createMovePlayerIntent } from '../intents/player-control-intents';

export function getGamepadInput(): InputFactory {
    return ({ onFrame$ }) => new Observable(subscriber => {
        let sub: Subscription;
        let gpIdx = -1;
        const cb = function(ev: Event) {
            const e = ev as GamepadEvent;
            console.log(e.gamepad);
            if (sub) {
                sub.unsubscribe();
            }
            sub = onFrame$.subscribe(() => {
                gpIdx = e.gamepad.index;
                // need to actively poll gamepads in navigator,
                // e.gamepad is just a snapshot
                const gp = navigator.getGamepads()[gpIdx];
                if (!gp) {
                    return;
                }
                // scan first 4 axes
                const resultBuf: Array<number | undefined> = [undefined, undefined];
                const stickThreshold = 0.1;
                gp.axes.slice(0, 8).forEach((v, i) => {
                    if (Math.abs(v) < stickThreshold) {
                        return; 
                    }
                    resultBuf[i % 2] = ((i % 2) ? -1 : 1) * v;
                });
                if (resultBuf.some(b => b !== undefined)) {
                    const direction = { x: resultBuf[0] ?? 0, y: resultBuf[1] ?? 0};
                    const player = gpIdx % 2; // simple mapping, could be improved
                    subscriber.next(createMovePlayerIntent({ player, direction }));
                }
            });
          };
        // todo: is subscribing to this event listener necessary?
        window.addEventListener('gamepadconnected', cb);
        subscriber.add(() => {
            window.removeEventListener('gamepadconnected', cb);
            if (sub) {
                sub.unsubscribe();
            }
        });
    });
}
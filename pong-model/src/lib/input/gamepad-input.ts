import { Observable, Subscription } from 'rxjs';
import { InputFactory } from '../types';
import { createMovePlayerIntent } from '../intents/player-control-intents';

export function getGamepadInput(): InputFactory {
    return ({ onFrame$ }) => new Observable(subscriber => {
        let sub: Subscription;
        sub = onFrame$.subscribe(() => {
            // need to actively poll gamepads in navigator
            // in order to get current state
            const gpds = (navigator.getGamepads() ?? [])
                .filter(x => !!x) as Array<Gamepad>; 
            if (!gpds?.length) {
                return;
            }
            gpds.forEach((gp, gpIdx) => {
                // scan first 2 axes
                const axisCount = 2;
                const resultBuf: Array<number | undefined> = [undefined, undefined];
                const stickThreshold = 0.1;
                gp.axes.slice(0, axisCount * 2).forEach((v, i) => {
                    if (Math.abs(v) < stickThreshold) {
                        return; 
                    }
                    const flipSign = !!(i % 2)
                    resultBuf[i % 2] = (flipSign ? -1 : 1) * v;
                });
                if (resultBuf.some(b => b !== undefined)) {
                    const direction = { x: resultBuf[0] ?? 0, y: resultBuf[1] ?? 0};
                    const player = gpIdx % 2; // simple mapping, could be improved
                    subscriber.next(createMovePlayerIntent({ player, direction }));
                }
            });
            
        });
        subscriber.add(() => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    });
}
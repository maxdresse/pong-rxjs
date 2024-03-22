import { BehaviorSubject, Observable } from 'rxjs';
import { InputFactory, Player } from '../types';
import { createMovePlayerIntent } from '../intents/player-control-intents';
import { SymbolicButtonCombination } from './btn';
import { getSymbolicButtonCombination } from './gamepad-btns';
import { combinationToIntent } from './combination-to-intent';

const PLAYERS = [Player.PLAYER1, Player.PLAYER2];

export function getGamepadInput(): InputFactory {
    const btnCombination$s = PLAYERS
        .map(_ => new BehaviorSubject<SymbolicButtonCombination>(0));
    return ({ onFrame$ }) => new Observable(subscriber => {
        const sub = onFrame$.subscribe(() => {
            // need to actively poll gamepads in navigator
            // in order to get current state
            const gpds = (navigator.getGamepads() ?? [])
                .filter(x => !!x) as Array<Gamepad>; 
            if (!gpds?.length) {
                return;
            }
            gpds.forEach((gp, gpIdx) => {
                // update btn combination buffer
                const player = gpIdx % 2; // simple mapping, could be made configurable
                btnCombination$s[player].next(getSymbolicButtonCombination(gp));
                // scan only 1 axis, players seem to be confused
                // if more than one axis works
                const axisCount = 1;
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
                    subscriber.next(createMovePlayerIntent({ player, direction }));
                }
            });
            
        });
        PLAYERS.forEach(player => {
            const sb = combinationToIntent(btnCombination$s[player], player)
                .subscribe(intent => subscriber.next(intent));
            sub.add(sb);
        });
        subscriber.add(() => {
            sub.unsubscribe();
        });
    });
}
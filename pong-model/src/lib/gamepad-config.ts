import { Observable, map, of, shareReplay, switchMap } from 'rxjs';
import { GamepadConfig } from './types';

export function getGamepadConfig(swapPlayers$?: Observable<boolean>): Observable<GamepadConfig> {
    return new Observable<GamepadConfig>(subscriber => {
        const updateGamepads = () => {
            const gamepads = navigator.getGamepads()
            .filter(x => !!x);
            const gpCf: GamepadConfig = {
                playerToGamePad: [gamepads[0], gamepads[1]]
            };
            subscriber.next(gpCf);
        };
        window.addEventListener('gamepadconnected', updateGamepads);
        window.addEventListener('gamepaddisconnected', updateGamepads);
        subscriber.add(() => {
            window.removeEventListener('gamepadconnected', updateGamepads);
            window.removeEventListener('gamepaddisconnected', updateGamepads);
        });
    }).pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        switchMap(gpcf => {
            if (!swapPlayers$) {
                return of(gpcf);
            }
            return swapPlayers$.pipe(
                map(swapPlayers => swapPlayers ? invertConfig(gpcf) : gpcf)
            )
        })
    );
}

function invertConfig(gpcf: GamepadConfig): GamepadConfig {
    const p2gp = gpcf.playerToGamePad;
    return ({
        playerToGamePad: [p2gp[1], p2gp[0]]
    });
}
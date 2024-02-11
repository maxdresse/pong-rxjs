import { Observable, merge } from 'rxjs';
import { InputFactory, Player, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT } from './input-constants';
import { combineInputs } from './input-utils';

const enum SymbolicDirection {
    UP = 1, // need truthy values
    DOWN,
    LEFT,
    RIGHT
};

const smybolicDir2VectorDir: Record<SymbolicDirection, Vc2> = {
    [SymbolicDirection.UP]: UNIT_VECTOR_UP,
    [SymbolicDirection.DOWN]: UNIT_VECTOR_DOWN,
    [SymbolicDirection.LEFT]: UNIT_VECTOR_LEFT,
    [SymbolicDirection.RIGHT]: UNIT_VECTOR_RIGHT,
};

function getKeyboardInputFromMapping(player: Player, ev2Dir: (ev: KeyboardEvent) => SymbolicDirection | undefined): InputFactory {
    return ({ onFrame$ }) => new Observable<MovePlayerIntent>(subscriber => {
        // on every frame, check the current keybuffer and
        // trigger a player move intent if a direction is presetn
        const keyBuf: Array<SymbolicDirection> = [];
        const sub = onFrame$.subscribe(() => {
            const dir = smybolicDir2VectorDir[keyBuf[0]];
            if (!dir) {
                return;
            }
            subscriber.next(createMovePlayerIntent({ player, direction: dir}));
        });
        const cbDown: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const sd = ev2Dir(ev);
            if (!sd) {
                return;
            }
            const idx = keyBuf.indexOf(sd);
            if (idx < 0) {
                keyBuf.unshift(sd);
            }
        };
        const cbUp: Parameters<(typeof window.addEventListener<'keyup'>)>[1] = ev => {
            const sd = ev2Dir(ev);
            if (!sd) {
                return;
            }
            const idx = keyBuf.indexOf(sd);
            if (idx >= 0) {
                keyBuf.splice(idx, 1);
            }
        };
        window.addEventListener('keydown', cbDown);
        window.addEventListener('keyup', cbUp);
        subscriber.add(() => {
            sub.unsubscribe();
            window.removeEventListener('keydown', cbDown);
            window.removeEventListener('keyup', cbUp);
        });
    });  
}

const arrowKeys2SymbolicDir: Record<string, SymbolicDirection> = {
    ArrowUp: SymbolicDirection.UP,
    ArrowDown: SymbolicDirection.DOWN,
    ArrowLeft: SymbolicDirection.LEFT,
    ArrowRight: SymbolicDirection.RIGHT,
};

export function getArrowKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(player, ev => arrowKeys2SymbolicDir[ev.key]);
}

const wasdKeys2SymbolicDir: Record<string, SymbolicDirection> = {
    KeyW: SymbolicDirection.UP,
    KeyS: SymbolicDirection.DOWN,
    KeyA: SymbolicDirection.LEFT,
    KeyD: SymbolicDirection.RIGHT,
};

function getWASDKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(player, ev => wasdKeys2SymbolicDir[ev.code]);
}

export function getKeyboardInput(): InputFactory {
    return combineInputs(
        getWASDKeyboardInput(Player.PLAYER1),
        getArrowKeyboardInput(Player.PLAYER2)
    );
}

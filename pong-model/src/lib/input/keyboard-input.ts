import { Observable, merge } from 'rxjs';
import { InputFactory, Player, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT } from './input-constants';
import { combineInputs } from './input-utils';

type SymbolicDir = 'u' | 'd' | 'l' | 'r';

const smybolicDir2Dir: Record<SymbolicDir, Vc2> = {
    u: UNIT_VECTOR_UP,
    d: UNIT_VECTOR_DOWN,
    l: UNIT_VECTOR_LEFT,
    r: UNIT_VECTOR_RIGHT,
};

function getKeyboardInputFromMapping(player: Player, ev2Dir: (ev: KeyboardEvent) => SymbolicDir | undefined): InputFactory {
    return ({ onFrame$ }) => new Observable<MovePlayerIntent>(subscriber => {
        const keyBuf: Array<SymbolicDir> = [];
        const sub = onFrame$.subscribe(() => {
            const dir = smybolicDir2Dir[keyBuf[0]];
            subscriber.next(createMovePlayerIntent({ player, direction: dir}));
        });
        const cbDown: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const sd = ev2Dir(ev);
            if (!sd) {
                return;
            }
            keyBuf.unshift(sd);
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

const arrowKeys2SymbolicDir: Record<string, SymbolicDir> = {
    ArrowUp: 'u',
    ArrowDown: 'd',
    ArrowLeft: 'l',
    ArrowRight: 'r',
};

export function getArrowKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(player, ev => arrowKeys2SymbolicDir[ev.key]);
}

const wasdKeys2SymbolicDir: Record<string, SymbolicDir> = {
    KeyW: 'u',
    KeyS: 'd',
    KeyA: 'l',
    KeyD: 'r',
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

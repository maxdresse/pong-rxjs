import { Observable, merge } from 'rxjs';
import { InputFactory, Player, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT } from './input-constants';
import { combineInputs } from './input-utils';

function getKeyboardInputFromMapping(player: Player, ev2Dir: (ev: KeyboardEvent) => Vc2 | undefined): InputFactory {
    return _ctx => new Observable<MovePlayerIntent>(subscriber => {
        const cb: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const d = ev2Dir(ev);
            if (!d) {
                return;
            }
            subscriber.next(createMovePlayerIntent({ player, direction: d}));
        };
        window.addEventListener('keydown', cb);
        subscriber.add(() => window.removeEventListener('keydown', cb));
    });  
}

const arrowKeys2Dir: Record<string, Vc2> = {
    ArrowUp: UNIT_VECTOR_UP,
    ArrowDown: UNIT_VECTOR_DOWN,
    ArrowLeft: UNIT_VECTOR_LEFT,
    ArrowRight: UNIT_VECTOR_RIGHT,
};

export function getArrowKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(player, ev => arrowKeys2Dir[ev.key]);
}

const wasdKeys2Dir: Record<string, Vc2> = {
    KeyW: UNIT_VECTOR_UP,
    KeyS: UNIT_VECTOR_DOWN,
    KeyA: UNIT_VECTOR_LEFT,
    KeyD: UNIT_VECTOR_RIGHT,
};

function getWASDKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(player, ev => wasdKeys2Dir[ev.code]);
}

export function getKeyboardInput(): InputFactory {
    return combineInputs(
        getWASDKeyboardInput(Player.PLAYER1),
        getArrowKeyboardInput(Player.PLAYER2)
    );
}

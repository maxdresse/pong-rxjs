import { Observable } from 'rxjs';
import { InputFactory, Player, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT } from './input-constants';

const arrowKeys2Dir: Record<string, Vc2> = {
    ArrowUp: UNIT_VECTOR_UP,
    ArrowDown: UNIT_VECTOR_DOWN,
    ArrowLeft: UNIT_VECTOR_LEFT,
    ArrowRight: UNIT_VECTOR_RIGHT,
};

export function getKeyboardInput(player: Player): InputFactory {
    return _ctx => new Observable<MovePlayerIntent>(subscriber => {
        const cb: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const k = ev.key;
            const d = arrowKeys2Dir[k];
            if (!d) {
                return;
            }
        subscriber.next(createMovePlayerIntent({ player, direction: d}));
        };
        window.addEventListener('keydown', cb);
        subscriber.add(() => window.removeEventListener('keydown', cb));
    });  
}
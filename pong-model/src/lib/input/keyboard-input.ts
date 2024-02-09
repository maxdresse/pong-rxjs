import { Observable } from 'rxjs';
import { InputFactory, Player, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';

const key2Dir: Record<string, Vc2> = {
    ArrowUp: { x: 0, y: 1 },
    ArrowDown: { x: 0, y: -1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
};

function getKeyboard(player: Player): InputFactory {
    return _ctx => new Observable<MovePlayerIntent>(subscriber => {
        const cb: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const k = ev.key;
            const d = key2Dir[k];
            if (!d) {
                return;
            }
        subscriber.next(createMovePlayerIntent({ player, direction: d}));
        };
        window.addEventListener('keydown', cb);
        subscriber.add(() => window.removeEventListener('keydown', cb));
    });  
} 
import { Observable, merge } from 'rxjs';
import { InputFactory, Player, SomeGameIntent, Vc2 } from '../types';
import { MovePlayerIntent, createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT, UNIT_VECTOR_UPPER_LEFT, UNIT_VECTOR_UPPER_RIGHT, UNIT_VECTOR_LOWER_RIGHT, UNIT_VECTOR_LOWER_LEFT } from './input-constants';
import { combineInputs } from './input-utils';
import { ensurePrepended, ensureRemoved } from '../array-utils';

// want truthy values to avoid errors when checking for truthiness
// numeric values are bit shifts apart in order to easily compute
// combined diagonal direction (like UP-LEFT) by addition
const enum SymbolicDirection {
    UP = 1,
    DOWN = 2,
    LEFT = 4,
    RIGHT = 8
};

const enum SymbolicButton {
    A = 1,
    B = 2,
    X = 4,
    Y = 8,
    L1 = 16,
    L2 = 32,
    R1 = 64,
    R2 = 128
}

const key2SymbolicBtn: Record<string, SymbolicButton> = {
    // roughly same layout as on XBox 360 controller
    KeyK: SymbolicButton.X,
    KeyO: SymbolicButton.Y,
    KeyL: SymbolicButton.A,
    KeyP: SymbolicButton.B,
    // L & R Buttons
    KeyE: SymbolicButton.L1,
    KeyR: SymbolicButton.L2,
    KeyU: SymbolicButton.R1,
    KeyI: SymbolicButton.R2
};

const enum CombinedSymbolicDirection {
    UPPER_LEFT = SymbolicDirection.UP + SymbolicDirection.LEFT,
    UPPER_RIGHT = SymbolicDirection.UP + SymbolicDirection.RIGHT,
    LOWER_RIGHT = SymbolicDirection.DOWN + SymbolicDirection.RIGHT,
    LOWER_LEFT = SymbolicDirection.DOWN + SymbolicDirection.LEFT
}

const smybolicDir2VectorDir: Record<SymbolicDirection | CombinedSymbolicDirection, Vc2> = {
    [SymbolicDirection.UP]: UNIT_VECTOR_UP,
    [SymbolicDirection.DOWN]: UNIT_VECTOR_DOWN,
    [SymbolicDirection.LEFT]: UNIT_VECTOR_LEFT,
    [SymbolicDirection.RIGHT]: UNIT_VECTOR_RIGHT,
    [CombinedSymbolicDirection.UPPER_LEFT]: UNIT_VECTOR_UPPER_LEFT,
    [CombinedSymbolicDirection.UPPER_RIGHT]: UNIT_VECTOR_UPPER_RIGHT,
    [CombinedSymbolicDirection.LOWER_RIGHT]: UNIT_VECTOR_LOWER_RIGHT,
    [CombinedSymbolicDirection.LOWER_LEFT]: UNIT_VECTOR_LOWER_LEFT,
};

const ev2Button = (ev: KeyboardEvent): SymbolicButton | undefined => {
    return key2SymbolicBtn[ev.key];
}

function directionBufToIntent(player: Player, directionBuf: Array<SymbolicDirection>) {
    const dir = symbolicDirToVectorDir(directionBuf);
    return dir ? createMovePlayerIntent({ player, direction: dir }) : null;
}

function btnBufToIntent(player: Player, btnBuf: Array<SymbolicButton>) {
    return null;
}

function getKeyboardInputFromMapping(player: Player, ev2Dir: (ev: KeyboardEvent) => SymbolicDirection | undefined): InputFactory {
    return ({ onFrame$ }) => new Observable<MovePlayerIntent>(subscriber => {
        // on every frame, check the current keybuffer and
        // trigger a player move intent if a direction is presetn
        const directionBuf: Array<SymbolicDirection> = [];
        const btnBuf: Array<SymbolicButton> = [];
        const sub = onFrame$.subscribe(() => {
            let intent = directionBufToIntent(player, directionBuf);
            intent = intent ?? btnBufToIntent(player, btnBuf);
            if (intent) {
                subscriber.next(intent);
            }
        });
        const cbDown: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            addToDirectionBuf(ev2Dir, ev, directionBuf) || 
                addToBtnBuf(ev, btnBuf);
            
        };
        const cbUp: Parameters<(typeof window.addEventListener<'keyup'>)>[1] = ev => {
            removeFromDirectionBuf(ev2Dir, ev, directionBuf) ||
                removeFromBtnBuf(ev, btnBuf);
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

function removeFromDirectionBuf(ev2Dir: (ev: KeyboardEvent) => SymbolicDirection | undefined, ev: KeyboardEvent, keyBuf: SymbolicDirection[]) {
    const sd = ev2Dir(ev);
    if (sd) {
        ensureRemoved(sd, keyBuf);
        return true;
    }
    return false;
}

function addToDirectionBuf(ev2Dir: (ev: KeyboardEvent) => SymbolicDirection | undefined, ev: KeyboardEvent, keyBuf: SymbolicDirection[]): boolean {
    const sd = ev2Dir(ev);
    if (sd) {
        ensurePrepended(sd, keyBuf);
        return true;
    }
    return false;
}

function addToBtnBuf(ev: KeyboardEvent, btnBuf: SymbolicButton[]): boolean {
    return false;
}

function removeFromBtnBuf(ev: KeyboardEvent, btnBuf: SymbolicButton[]): boolean {
    return false;
}

function symbolicDirToVectorDir(keyBuf: SymbolicDirection[]) {
    if (keyBuf.length === 1) {
        return smybolicDir2VectorDir[keyBuf[0]];
    }
    // sum has well defined enum value because of bit magic
    const composedKey: SymbolicDirection | CombinedSymbolicDirection = (keyBuf[0] + keyBuf[1]);
    return smybolicDir2VectorDir[composedKey];
}

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

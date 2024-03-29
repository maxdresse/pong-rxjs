import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { InputFactory, Player, SomeGameEvent, Vc2 } from '../types';
import { createMovePlayerIntent } from '../intents/player-control-intents';
import { UNIT_VECTOR_UP, UNIT_VECTOR_DOWN, UNIT_VECTOR_LEFT, UNIT_VECTOR_RIGHT, UNIT_VECTOR_UPPER_LEFT, UNIT_VECTOR_UPPER_RIGHT, UNIT_VECTOR_LOWER_RIGHT, UNIT_VECTOR_LOWER_LEFT } from './input-constants';
import { combineInputs } from './input-utils';
import { ensurePrepended, ensureRemoved } from '../array-utils';
import { SymbolicButton } from './btn';
import { combinationToIntent } from './combination-to-intent';

// want truthy values to avoid errors when checking for truthiness
// numeric values are bit shifts apart in order to easily compute
// combined diagonal direction (like UP-LEFT) by addition
const enum SymbolicDirection {
    UP = 1,
    DOWN = 2,
    LEFT = 4,
    RIGHT = 8
};

const key2SymbolicBtn: Record<string, SymbolicButton> = {
    // roughly same layout as on XBox 360 controller
    KeyK: SymbolicButton.Y,
    KeyO: SymbolicButton.X,
    KeyL: SymbolicButton.B,
    KeyP: SymbolicButton.A,
    // L & R Buttons
    Digit1: SymbolicButton.L1,
    Digit2: SymbolicButton.L2,
    Digit9: SymbolicButton.R1,
    Digit0: SymbolicButton.R2
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

function directionBufToIntent(player: Player, directionBuf: Array<SymbolicDirection>) {
    const dir = symbolicDirToVectorDir(directionBuf);
    return dir ? createMovePlayerIntent({ player, direction: dir }) : null;
}

function updateBtnCombination(combination$: Subject<number>, btnBuf: Array<SymbolicButton>) {
    combination$.next(btnBuf.reduce((a, b) => a + b, 0));
}

type Ev2Btn = (ev: KeyboardEvent) => SymbolicButton | undefined;
type Ev2Dir = (ev: KeyboardEvent) => SymbolicDirection | undefined;

type EventConfig = {
    ev2Dir: Ev2Dir;
    ev2Btn?: Ev2Btn;
};

function getKeyboardInputFromMapping(player: Player, { ev2Dir, ev2Btn }: EventConfig): InputFactory {
    const btnCombination$ = new BehaviorSubject<number>(0);
    const intentFromCombo$ = combinationToIntent(btnCombination$, player);

    return ({ onFrame$ }) => new Observable<SomeGameEvent>(subscriber => {
        const comboSub = intentFromCombo$.subscribe(combIntent => subscriber.next(combIntent));
        // on every frame, check the current keybuffer and
        // trigger a player move intent if a direction is present
        const directionBuf: Array<SymbolicDirection> = [];
        const btnBuf: Array<SymbolicButton> = [];
        const sub = onFrame$.subscribe(() => {
            const intent = directionBufToIntent(player, directionBuf);
            if (intent) {
                subscriber.next(intent);
            }
            updateBtnCombination(btnCombination$, btnBuf);
        });
        const cbDown: Parameters<(typeof window.addEventListener<'keydown'>)>[1] = ev => {
            const wasDir = addToDirectionBuf(ev2Dir, ev, directionBuf);
            if (!wasDir && ev2Btn) {
                addToBtnBuf(ev2Btn, ev, btnBuf);
            }
            
        };
        const cbUp: Parameters<(typeof window.addEventListener<'keyup'>)>[1] = ev => {
            const wasDir = removeFromDirectionBuf(ev2Dir, ev, directionBuf);
            if (!wasDir && ev2Btn) {
                removeFromBtnBuf(ev2Btn, ev, btnBuf);
            }
        };
        window.addEventListener('keydown', cbDown);
        window.addEventListener('keyup', cbUp);
        subscriber.add(() => {
            sub.unsubscribe();
            comboSub.unsubscribe();
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

function removeFromDirectionBuf(ev2Dir: Ev2Dir, ev: KeyboardEvent, keyBuf: SymbolicDirection[]) {
    const sd = ev2Dir(ev);
    if (sd) {
        ensureRemoved(sd, keyBuf);
        return true;
    }
    return false;
}

function addToDirectionBuf(ev2Dir: Ev2Dir, ev: KeyboardEvent, keyBuf: SymbolicDirection[]): boolean {
    const sd = ev2Dir(ev);
    if (sd) {
        ensurePrepended(sd, keyBuf);
        return true;
    }
    return false;
}

function addToBtnBuf(ev2Btn: Ev2Btn, ev: KeyboardEvent, btnBuf: SymbolicButton[]): boolean {
    const btn = ev2Btn(ev);
    if (btn) {
        ensurePrepended(btn, btnBuf);
        return true;
    }
    return false;
}

function removeFromBtnBuf(ev2Btn: Ev2Btn, ev: KeyboardEvent, btnBuf: SymbolicButton[]): boolean {
    const btn = ev2Btn(ev);
    if (btn) {
        ensureRemoved(btn, btnBuf);
        return true;
    }
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
    return getKeyboardInputFromMapping(player, { ev2Dir: ev => arrowKeys2SymbolicDir[ev.key] });
}

const wasdKeys2SymbolicDir: Record<string, SymbolicDirection> = {
    KeyW: SymbolicDirection.UP,
    KeyS: SymbolicDirection.DOWN,
    KeyA: SymbolicDirection.LEFT,
    KeyD: SymbolicDirection.RIGHT,
};

function getWASDKeyboardInput(player: Player): InputFactory {
    return getKeyboardInputFromMapping(
        player,
        { ev2Dir: ev => wasdKeys2SymbolicDir[ev.code],
          ev2Btn: ev => key2SymbolicBtn[ev.code] }
    );
}

export function getKeyboardInput(): InputFactory {
    return combineInputs(
        getWASDKeyboardInput(Player.PLAYER1),
        getArrowKeyboardInput(Player.PLAYER2)
    );
}

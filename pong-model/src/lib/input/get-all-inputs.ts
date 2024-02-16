import { IGameDef } from '../types';
import { getGamepadInput } from './gamepad-input';
import { combineInputs } from './input-utils';
import { getKeyboardInput } from './keyboard-input';

export function getAllInputs(def: IGameDef) {
    return def.inputFactory ?? getKeyboardAndGamepadInput();
}

function getKeyboardAndGamepadInput() {
    return combineInputs(getKeyboardInput(), getGamepadInput());
}
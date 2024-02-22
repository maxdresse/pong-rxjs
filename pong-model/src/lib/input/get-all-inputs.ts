import { getGamepadInput } from './gamepad-input';
import { combineInputs } from './input-utils';
import { getKeyboardInput } from './keyboard-input';

export function getAllInputs() {
    return getKeyboardAndGamepadInput();
}

function getKeyboardAndGamepadInput() {
    return combineInputs(getKeyboardInput(), getGamepadInput());
}
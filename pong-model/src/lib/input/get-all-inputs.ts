import { IGameDef, Player } from '../types';
import { getKeyboardInput } from './keyboard-input';

export function getAllInputs(def: IGameDef) {
    return def.inputFactory ?? getKeyboardInput();
}

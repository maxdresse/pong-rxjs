import { GameParameters, Player, UserMessageType } from '../types';
import { SHORT_MSG_DURATION } from '../ui/ui-constants';

export function getPlayerDisplayName(player: Player): string {
    return `Player ${player + 1}`;
}

export function getMsgType(player: Player): UserMessageType {
    return player === Player.PLAYER1 ? UserMessageType.P1 : UserMessageType.P2;
}

export interface MsgOpts {
    type?: UserMessageType;
    flashing?: boolean;
}

export function showShortMessage(msg: string, params: GameParameters, { type, flashing  }: MsgOpts) {
    params.userMessage = {
        type: type ?? UserMessageType.BOTH,
        flashing: flashing ?? false,
        msg
    }
    setTimeout(() => {
        params.userMessage = undefined;
    }, SHORT_MSG_DURATION);
}
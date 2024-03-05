import { GameParameters } from '../types';
import { FONT_FAMILY } from './font-constants';
import { Y_CORRECTION_PER_PT } from './font-constants';
import { X_CORRECTION_PER_PT_AND_GLYPH } from './font-constants';
import { USR_MSG_FONT_SIZE } from './font-constants';

export function drawOverlays(ctx: CanvasRenderingContext2D, params: GameParameters): void {
    if (!params.userMessage) {
        return;
    }
    const msg = params.userMessage.msg;
    ctx.save();

    // measuring text is expensive
    // => use a rough heuristic that depends on font size and
    // text length in order to do the entering
    const xCorrection = X_CORRECTION_PER_PT_AND_GLYPH * USR_MSG_FONT_SIZE * msg.length;
    const yCorrection = Y_CORRECTION_PER_PT * USR_MSG_FONT_SIZE;
    ctx.translate((0.5 - xCorrection) * ctx.canvas.width, (0.5 - yCorrection) * ctx.canvas.height);
    ctx.fillStyle = params.colorScheme.text;
    ctx.font = `bold ${USR_MSG_FONT_SIZE}pt ${FONT_FAMILY}`;
    ctx.fillText(msg, 0, 0);
    
    ctx.restore();
 }

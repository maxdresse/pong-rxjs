import { getFrameCount } from '../frame-counter';
import { GameParameters } from '../types';
import { FONT_FAMILY } from './font-constants';
import { USR_MSG_FONT_SIZE } from './font-constants';
import { FRAME_COUNT_PER_FLASH } from './render-constants';

export function drawOverlays(ctx: CanvasRenderingContext2D, params: GameParameters): void {
    drawUserMessage(params, ctx);
 }

function drawUserMessage(params: GameParameters, ctx: CanvasRenderingContext2D) {
    if (!params.userMessage) {
        return;
    }
    const msg = params.userMessage.msg;
    ctx.save();

    ctx.font = `bold ${USR_MSG_FONT_SIZE}pt ${FONT_FAMILY}`;
    // measuring text is notorious for being expensive
    // but seems to be Ok in our case
    const textMetrics = ctx.measureText(msg);
    const { width: w, actualBoundingBoxAscent: h } = textMetrics;
    ctx.translate(0.5 * (ctx.canvas.width - w), 0.5 * (ctx.canvas.height - h));

    ctx.fillStyle = getFillColor(params);
    ctx.fillText(msg, 0, 0);

    ctx.restore();
}

function getFillColor(params: GameParameters) {
    const isFlashing = params.userMessage?.flashing;
    const isTransparent = isFlashing && isFrameInTransparentInterval(FRAME_COUNT_PER_FLASH);
    const fillStyle = isTransparent ? 'transparent' : params.colorScheme.text;
    return fillStyle;
}

function isFrameInTransparentInterval(frameCountPerFlash: number) {
    return (getFrameCount() % (2 * frameCountPerFlash)) >= frameCountPerFlash;
}



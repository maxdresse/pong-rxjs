import { getFrameCount } from '../frame-counter';
import { GameParameters, UserMessageType } from '../types';
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
    const [tx, ty] = getTranslation(ctx, w, h, params.userMessage.type);
    ctx.translate(tx, ty);

    ctx.fillStyle = getFillColor(params);
    ctx.fillText(msg, 0, 0);

    ctx.restore();
}

const type2RelativeTranslation = {
    [UserMessageType.BOTH]: [0.5, 0.5],
    [UserMessageType.P1]: [0.25, 0.25],
    [UserMessageType.P2]: [0.75, 0.25],
}

function getTranslation(ctx: CanvasRenderingContext2D, w: number, h: number, type: UserMessageType) {
    const [rx, ry] = type2RelativeTranslation[type];
    return [rx * ctx.canvas.width - w * 0.5 , ry * ctx.canvas.height - h * 0.5];
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



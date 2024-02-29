import { GameParameters } from '../types';


export function drawOverlays(ctx: CanvasRenderingContext2D, params: GameParameters): void {
    if (!params.paused) {
        return;
    }
    ctx.save();

    ctx.translate(0.4 * ctx.canvas.width, 0.4 * ctx.canvas.height);
    ctx.fillStyle = params.colorScheme.text;
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("Paused", 50, 100);
    
    ctx.restore();
 }

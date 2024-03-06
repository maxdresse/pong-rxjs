import { b2Body } from '@box2d/core';
import { drawInBodyContext } from './draw-utils';
import { IColorScheme } from '../types';
import { drawEdgeFixtures } from './draw-utils';

export function drawGoal(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        drawEdgeFixtures(body, ctx, cs.goal);
    });
}


import { b2Body, b2PolygonShape, b2ShapeType, b2Vec2 } from '@box2d/core';
import { drawInBodyContext } from './draw-utils';
import { IColorScheme, Vc2 } from '../types';
import { PlayerUserData } from '../body-user-data';
import { BARELY_VISIBLE_OPACITY } from './render-constants';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        const { player: { fill, stroke } } = cs;
        drawPaddle(body, ctx, { fill, stroke });
    });
}

export function drawPaddle(body: b2Body, ctx: CanvasRenderingContext2D, colors: { fill: string; stroke: string }) {
    const f = body.GetFixtureList();
    if (!f) {
        return;
    }
    const barelyVisible = (body.GetUserData() as PlayerUserData)?.isBarelyVisible;
    if (barelyVisible) {
        ctx.globalAlpha = BARELY_VISIBLE_OPACITY;
    }
    const shape = f.GetShape() as b2PolygonShape;
    const shapeType = shape.GetType();
    if (shapeType === b2ShapeType.e_polygon) {
        const vertexCount = shape.m_count;
        if (vertexCount !== 4) {
            console.error('unexpected non-4-vertex shape');
        }
        const vertices = shape.m_vertices;
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.beginPath();
        arcBetween(ctx, vertices[0], vertices[1], false, -Math.PI);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        arcBetween(ctx, vertices[2], vertices[3], false, 0);
        ctx.lineTo(vertices[3].x, vertices[3].y);
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.stroke();
        if (barelyVisible) {
            ctx.globalAlpha = 1;
        }
    }
}

function arcBetween(ctx: CanvasRenderingContext2D, a: Vc2, b: Vc2, ccw: boolean, startAngle: number): void {
    const middle = new b2Vec2(a.x, a.y).Add(b).Scale(0.5);
    const radius = new b2Vec2(a.x, a.y).Subtract(b).Scale(0.5).Length();
    ctx.arc(middle.x, middle.y, radius, startAngle, Math.PI + startAngle, ccw);
}

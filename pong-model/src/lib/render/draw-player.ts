import { b2Body, b2PolygonShape, b2Shape, b2ShapeType, b2Vec2 } from '@box2d/core';
import { drawInBodyContext, drawPolygonalFixtures } from './draw-utils';
import { IColorScheme, Vc2 } from '../types';


export function drawPlayer(ctx: CanvasRenderingContext2D, body: b2Body, cs: IColorScheme): void {
    drawInBodyContext(ctx, body, () => {
        const { player: { fill, stroke } } = cs;
        drawPolygonalFixtures(body, ctx, { fill, stroke });
        drawPaddle(body, ctx, { fill, stroke });
    });
}

let lastShape: b2PolygonShape;
export function drawPaddle(body: b2Body, ctx: CanvasRenderingContext2D, colors: { fill: string; stroke: string }) {
    const f = body.GetFixtureList();
    if (!f) {
        return;
    }
    const shape = f.GetShape() as b2PolygonShape;
    if (JSON.stringify(lastShape?.m_vertices) !== JSON.stringify(shape.m_vertices)) {
        console.log(shape?.m_vertices);
        lastShape = shape;
    }
    const shapeType = shape.GetType();
    if (shapeType === b2ShapeType.e_polygon) {
        const vertexCount = shape.m_count;
        if (vertexCount !== 4) {
            console.error('unexpected non-4-vertex shape');
        }
        const vertices = shape.m_vertices;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        arcBetween(ctx, vertices[0], vertices[1], true);
        ctx.moveTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[1].x, vertices[2].y);
        arcBetween(ctx, vertices[2], vertices[3], false);
        ctx.moveTo(vertices[3].x, vertices[3].y);
        ctx.closePath();
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.stroke();
    }
}

function arcBetween(ctx: CanvasRenderingContext2D, a: Vc2, b: Vc2, ccw: boolean): void {
    const middle = new b2Vec2(a.x, a.y).Add(b).Scale(0.5);
    const radius = new b2Vec2(a.x, a.y).Subtract(b).Scale(0.5).Length();
    ctx.arc(middle.x, middle.y, radius, 0, Math.PI, ccw);
}
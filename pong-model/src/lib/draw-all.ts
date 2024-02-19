import { GameParameters } from './types';
import { b2World, DrawShapes, DrawJoints, b2Fixture, b2ShapeType, b2CircleShape, b2Vec2 } from '@box2d/core';
import { DebugDraw } from "@box2d/debug-draw";

export function drawAll(draw: DebugDraw, params: GameParameters, world: b2World) {
    draw.Prepare(0, 0, params.zoomFactor, true); // center, zoom, flipy
    DrawShapes(draw, world);
    DrawJoints(draw, world);
    // DrawAABBs(draw, world);
    // DrawPairs(draw, world);
    // DrawCenterOfMasses(draw, world);
    draw.Finish();
}

export function drawAllX(ctx: CanvasRenderingContext2D, params: GameParameters, world: b2World) {
    const zoom = params.zoomFactor;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
    ctx.scale(1, -1);
    ctx.scale(zoom, zoom);
    ctx.lineWidth /= zoom;
    ctx.translate(0, 0);

    for (let b = world.GetBodyList(); b; b = b.GetNext()) {
        const xf = b.GetTransform();

        ctx.save();
        ctx.translate(xf.p.x, xf.p.y);
        ctx.rotate(xf.q.GetAngle());

        for (let f: b2Fixture | null = b.GetFixtureList(); f; f = f.GetNext()) {
            const shape = f.GetShape();
            const shapeType = shape.GetType();
            if (shapeType === b2ShapeType.e_circle) {
                drawBall(ctx, shape as b2CircleShape);
            } else if (shapeType === b2ShapeType.e_polygon) {
                
            } else if (shapeType === b2ShapeType.e_edge) {

            }
            // WIP f.GetShape().Draw(draw, GetShapeColor(b));
        }

        ctx.restore();
    }
    
    ctx.restore();
}

function drawBall(ctx: CanvasRenderingContext2D, shape: b2CircleShape): void {
    const st: b2CircleShape = shape as b2CircleShape;
    const center = st.m_p;
    const radius = st.m_radius;
    const axis = b2Vec2.UNITX;
    const cx = center.x;
    const cy = center.y;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + axis.x * radius, cy + axis.y * radius);
    ctx.fillStyle = 'lightblue';
    ctx.fill();
    ctx.strokeStyle = 'darkblue';
    ctx.stroke();
}

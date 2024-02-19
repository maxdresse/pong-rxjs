import { b2Body, b2CircleShape, b2Fixture, b2ShapeType, b2Vec2 } from '@box2d/core';

export function drawBall(ctx: CanvasRenderingContext2D, body: b2Body): void {
    const xf = body.GetTransform();

    ctx.save();
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngle());

    for (let f: b2Fixture | null = body.GetFixtureList(); f; f = f.GetNext()) {
        const shape = f.GetShape();
        const shapeType = shape.GetType();
        if (shapeType === b2ShapeType.e_circle) {
            drawCircle(ctx, shape as b2CircleShape);
        } 
    }

    ctx.restore();
}

function drawCircle(ctx: CanvasRenderingContext2D, shape: b2CircleShape): void {
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
import { Subject } from 'rxjs';
import { IMatchDef, IObj, MatchFactory } from './types'
import { b2Vec2, b2World, b2PolygonShape } from '@box2d/core';

export const createMatch: MatchFactory = (def: IMatchDef) => {
    const objectsSub$ = new Subject<Array<IObj>>();

    // create box 2d world
    const gravity = new b2Vec2(0.0, -10.0);
    const world = b2World.Create(gravity);
    // add bodies and tracking IObj for them
    const groundBody = world.CreateBody({ position: { x: 0, y: -10 }});
    const groundBox = new b2PolygonShape();
    groundBox.SetAsBox(50.0, 10.0);
    groundBody.CreateFixture({ shape: groundBox });
    // create main loop
    
        // for each iteration
            //

    // wire loop execution to match control


    return {
        objects$: objectsSub$,
        tearDown: () => {
            //
        }
    };
};
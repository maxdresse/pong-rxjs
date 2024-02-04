import { Subject } from 'rxjs';
import { IMatchDef, IObj, MatchFactory } from './types'

export const createMatch: MatchFactory = (def: IMatchDef) => {
    const objectsSub$ = new Subject<Array<IObj>>();

    // create box 2d world

    // add bodies and tracking IObj for them

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
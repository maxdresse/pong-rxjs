import { b2ContactFilter, b2Fixture } from '@box2d/core';
import { UserDataUnion, ballType, fenceType } from './body-user-data';

export function createContactFilter(): b2ContactFilter {
    return {
      ShouldCollide: (fixtureA, fixtureB) => {
          const types =  [fixtToType(fixtureA), fixtToType(fixtureB)];
          if (types.includes(ballType) && types.includes(fenceType)) {
            return false;
          }
          return true;
      },  
    };
}

function fixtToType(f: b2Fixture): UserDataUnion['type'] | undefined {
    return f.GetBody()?.GetUserData()?.type;
}
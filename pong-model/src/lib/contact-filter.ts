import { b2ContactFilter, b2Fixture } from '@box2d/core';
import { UserDataUnion } from './body-user-data';

export function createContactFilter(): b2ContactFilter {
    return {
      ShouldCollide: (fixtureA, fixtureB) => {
          const tA = fixtToType(fixtureA);
          const tB = fixtToType(fixtureB);
          void (tA);
          void(tB);
          return true
      },  
    };
}

function fixtToType(f: b2Fixture): UserDataUnion['type'] | undefined {
    return f.GetBody()?.GetUserData()?.type;
}
import { b2Contact, b2ContactListener } from '@box2d/core';
import { SomeGameEvent } from './types';
import { getBallUserData, getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createPlayerHitsWallEvent } from './events/player-hits-wall-event';
import { createGoalScoredEvent } from './events/goal-scored-event';

type ContactData  = {
    ball?:  Array<ReturnType<typeof getBallUserData>>;
    player?:  Array<ReturnType<typeof getPlayerUserData>>;
    goal?:  Array<ReturnType<typeof getGoalUserData>>;
    wall?:  Array<ReturnType<typeof getWallUserData>>;
  };


function contactToEvent(contact: b2Contact): SomeGameEvent | null {
    const a = contact.GetFixtureA().GetBody();
    const b = contact.GetFixtureB().GetBody();
    const bodies = [a, b];
    const cd: ContactData = {};
    bodies.forEach(b => {
        const userData = b.GetUserData();
        const type = userData?.type as keyof ContactData;
        if (type !== undefined) {
            if (!cd[type]) {
                cd[type] = [];
            }
            cd[type]!.push(userData);
        }
    });
    if (cd.player?.length && cd.wall?.length) {
        const player = cd.player?.[0].player;
        if (player !== undefined) {
            return createPlayerHitsWallEvent(player);
        }
    }
    if (cd.ball?.length && cd.goal?.length) {
        const player = cd.goal?.[0]?.owningPlayer;
        if (player !== undefined) {
            return createGoalScoredEvent(player)
        }
    }
    return null;
}
export function createContactListener(onEvent: (ev: SomeGameEvent) => void): b2ContactListener {
    return {
        BeginContact: (contact) => {
            const ev = contactToEvent(contact);
            if (ev) {
                setTimeout(() => {
                    // during contact, physics is locked: call in next tick
                    onEvent(ev);
                }, 0);
            }
        },
        EndContact: () => { },
        PreSolve: () => { },
        PostSolve: () => { }
    };
}

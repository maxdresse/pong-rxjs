import { b2Contact, b2ContactListener } from '@box2d/core';
import { SomeGameEvent } from './types';
import { getBallUserData, getFenceUserData, getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createPlayerHitsObstacleEvent as createPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { createGoalScoredEvent } from './events/goal-scored-event';
import { WithRequired } from './type-utils';

type ContactData  = {
    ball?:  Array<ReturnType<typeof getBallUserData>>;
    player?:  Array<ReturnType<typeof getPlayerUserData>>;
    goal?:  Array<ReturnType<typeof getGoalUserData>>;
    wall?:  Array<ReturnType<typeof getWallUserData>>;
    fence?:  Array<ReturnType<typeof getFenceUserData>>;
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
    if (cd.player?.length) {
        return onPlayerContact(cd as Parameters<typeof onPlayerContact>[0]);
    }
    if (cd.ball?.length) {
        return onBallContact(cd as Parameters<typeof onBallContact>[0]);
    }
    return null;
}

function onPlayerContact(cd: WithRequired<ContactData, "player">): SomeGameEvent | null {
    const player = cd.player?.[0].player;
    if (player === undefined) {
        return null;
    }
    // goal, fence, wall are all the same from a player's perspective
    if(cd.wall?.length || cd.goal?.length || cd.fence?.length) {
        return createPlayerHitsObstacleEvent(player);
    }
    return null;
}

function onBallContact(cd: WithRequired<ContactData, "ball">): SomeGameEvent | null {
    if (cd.goal?.length) {
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

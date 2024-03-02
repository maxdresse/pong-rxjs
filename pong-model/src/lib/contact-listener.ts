import { b2Body, b2Contact, b2ContactListener } from '@box2d/core';
import { SomeGameEvent } from './types';
import { BallUserData, PlayerUserData, getBallUserData, getFenceUserData, getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createPlayerHitsObstacleEvent as createPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { createGoalScoredEvent } from './events/goal-scored-event';
import { WithRequired } from './type-utils';
import { createHitBallHardEvent } from './events/player-hits-ball-hard';
import { HARD_HIT_THRESHOLD } from './physical-constants';
import { getFrameCount } from './frame-counter';

type ContactData  = {
    ball?:  Array<ReturnType<typeof getBallUserData>>;
    player?:  Array<ReturnType<typeof getPlayerUserData>>;
    goal?:  Array<ReturnType<typeof getGoalUserData>>;
    wall?:  Array<ReturnType<typeof getWallUserData>>;
    fence?:  Array<ReturnType<typeof getFenceUserData>>;
};

const enum ContactParticipantType {
    None = 0,
    Ball = 1,
    Player = 2,
    Goal = 4,
    Wall = 8,
    Fence = 16
};

type ContactDataNew<UserDataA, UserDataB> = {
    a: UserDataA,
    b: UserDataB,
    contact: b2Contact;
};

const typeToContactType: { [key in keyof ContactData]: ContactParticipantType} = {
    ball: ContactParticipantType.Ball,
    player: ContactParticipantType.Player,
    goal: ContactParticipantType.Goal,
    wall: ContactParticipantType.Wall,
    fence: ContactParticipantType.Fence
};

function getContactType(a: keyof ContactData, b: keyof ContactData) {
    const aT = typeToContactType[a] ?? ContactParticipantType.None;
    const bT = typeToContactType[b] ?? ContactParticipantType.None;
    return aT + bT;
}

type ContactType = ReturnType<typeof getContactType>;

const contactRegistry: {

} = {
    [ContactParticipantType.Ball + ContactParticipantType.Player]: ({ b, contact}: ContactDataNew<BallUserData, PlayerUserData>) => {
        const normal = contact.GetManifold().localNormal;
        const [aB, bB] = extractBodies(contact);
        const bodies = [aB, bB] as const;
        if (normal) {
            const deltaV = bodies[0].GetLinearVelocity().Clone().Subtract(bodies[1].GetLinearVelocity());
            const impactIntensity = Math.abs(normal.Dot(deltaV));
            if (impactIntensity > HARD_HIT_THRESHOLD) {
                return createHitBallHardEvent(b.player);
            }
        }
        return null;
    }
};

function contactToEvent(contact: b2Contact): { ev: SomeGameEvent | null , contactType: number } {
    const [a, b] = extractBodies(contact);
    const bodies = [a, b] as const;
    const cd: ContactData = {};
    const types: Array<keyof ContactData> = []
    bodies.forEach(b => {
        const userData = b.GetUserData();
        const type = userData?.type as keyof ContactData;
        if (type !== undefined) {
            if (!cd[type]) {
                cd[type] = [];
            }
            types.push(type);
            cd[type]!.push(userData);
        }
    });
    const contactType = getContactType(types[0], types[1]);
    const ev = createGameEvent(cd, contact, bodies);
    return { ev, contactType };
}

function extractBodies(contact: b2Contact) {
    const a = contact.GetFixtureA().GetBody();
    const b = contact.GetFixtureB().GetBody();
    return [a, b];
}

function createGameEvent(cd: ContactData, contact: b2Contact, bodies: readonly [b2Body, b2Body]): SomeGameEvent | null {
    if (cd.player?.length) {
        const ev = onPlayerContact(cd as Parameters<typeof onPlayerContact>[0], contact, bodies);
        if (ev) {
            return ev;
        }
    }
    if (cd.ball?.length) {
        return onBallContact(cd as Parameters<typeof onBallContact>[0]);
    }
    return null;
}

function onPlayerContact(cd: WithRequired<ContactData, "player">, contact: b2Contact, bodies: readonly [b2Body, b2Body]): SomeGameEvent | null {
    const player = cd.player?.[0].player;
    if (player === undefined) {
        return null;
    }
    // goal, fence, wall are all the same from a player's perspective
    if(cd.wall?.length || cd.goal?.length || cd.fence?.length) {
        return createPlayerHitsObstacleEvent(player);
    }
    if (cd.player?.length) {
        const normal = contact.GetManifold().localNormal;
        if (normal) {
            const deltaV = bodies[0].GetLinearVelocity().Clone().Subtract(bodies[1].GetLinearVelocity());
            const impactIntensity = Math.abs(normal.Dot(deltaV));
            if (impactIntensity > HARD_HIT_THRESHOLD) {
                return createHitBallHardEvent(cd.player[0].player);
            }
        }
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
    const lastHandledContacts: {
        frameCount: number | undefined;
        contactTypes: Array<number>;
    } = {
        frameCount: undefined,
        contactTypes: []
    };
    return {
        BeginContact: (contact) => {
            const currentFrame = getFrameCount();
            if (currentFrame !== lastHandledContacts.frameCount) {
                lastHandledContacts.contactTypes.length = 0;
                lastHandledContacts.frameCount = currentFrame;
            }
            const { ev, contactType } = contactToEvent(contact);
            const alreadyHandled = lastHandledContacts.contactTypes.includes(contactType);
            if (ev && !alreadyHandled) {
                lastHandledContacts.contactTypes.push(contactType);
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

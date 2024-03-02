import { b2Body, b2Contact, b2ContactListener } from '@box2d/core';
import { SomeGameEvent } from './types';
import { BallUserData, FenceUserData, GoalUserData, PlayerUserData, WallUserData, getBallUserData, getFenceUserData, getGoalUserData, getPlayerUserData, getWallUserData } from './body-user-data';
import { createPlayerHitsObstacleEvent as createPlayerHitsObstacleEvent } from './events/player-hits-obstacle-event';
import { createGoalScoredEvent } from './events/goal-scored-event';
import { createHitBallHardEvent } from './events/player-hits-ball-hard';
import { HARD_HIT_THRESHOLD } from './physical-constants';
import { getFrameCount } from './frame-counter';

type TypeToUserData  = {
    ball?:  Array<ReturnType<typeof getBallUserData>>;
    player?:  Array<ReturnType<typeof getPlayerUserData>>;
    goal?:  Array<ReturnType<typeof getGoalUserData>>;
    wall?:  Array<ReturnType<typeof getWallUserData>>;
    fence?:  Array<ReturnType<typeof getFenceUserData>>;
};

const enum ContactObjT {
    None = 0,
    Ball = 1,
    Player = 2,
    Goal = 4,
    Wall = 8,
    Fence = 16
};

type ContactData<UserDataA, UserDataB> = {
    a: UserDataA,
    b: UserDataB,
    contact: b2Contact;
};

const typeToContactType: { [key in keyof TypeToUserData]: ContactObjT} = {
    ball: ContactObjT.Ball,
    player: ContactObjT.Player,
    goal: ContactObjT.Goal,
    wall: ContactObjT.Wall,
    fence: ContactObjT.Fence
};

function getContactType(a: keyof TypeToUserData, b: keyof TypeToUserData) {
    const aT = typeToContactType[a] ?? ContactObjT.None;
    const bT = typeToContactType[b] ?? ContactObjT.None;
    return aT + bT;
}

const contactRegistry = {
    [ContactObjT.Ball + ContactObjT.Player]: handleBallHasPlayerContact,
    [ContactObjT.Ball + ContactObjT.Goal]: handleBallHitsGoal,
    [ContactObjT.Player + ContactObjT.Goal]: handlePlayerHitsObstacle,
    [ContactObjT.Player + ContactObjT.Wall]: handlePlayerHitsObstacle,
    [ContactObjT.Player + ContactObjT.Fence]: handlePlayerHitsObstacle,
};

function contactToEvent(contact: b2Contact): { ev: SomeGameEvent | null , contactType: number } {
    const [a, b] = extractBodies(contact);
    const toType = (b: b2Body) => b.GetUserData()?.type;
    const types = [toType(a), toType(b)];
    const contactType = getContactType(types[0], types[1]);
    const handler = contactRegistry[contactType];
    if (handler) {
        const userDataArray = [a.GetUserData(), b.GetUserData()];
        // make sure numerically smaller type is supplied to handler first
        if (typeToContactParticipantType(types[0])  > (typeToContactParticipantType(types[1]))) {
            userDataArray.reverse();
        }
        const contData: ContactData<any, any> = {a: userDataArray[0], b: userDataArray[1], contact };
        // could not find a better solution than any
        return { ev: handler(contData as any), contactType };
    }
    return { ev: null, contactType };
}

function typeToContactParticipantType(type: keyof TypeToUserData) {
    return typeToContactType[type] ?? 0;
}

function extractBodies(contact: b2Contact) {
    const a = contact.GetFixtureA().GetBody();
    const b = contact.GetFixtureB().GetBody();
    return [a, b];
}

function handlePlayerHitsObstacle({ a, b }: ContactData<PlayerUserData, GoalUserData | FenceUserData | WallUserData>) {
    return createPlayerHitsObstacleEvent(a.player);
};

function handleBallHasPlayerContact({ b, contact }: ContactData<BallUserData, PlayerUserData>) {
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
};

function handleBallHitsGoal({ b }: ContactData<BallUserData, GoalUserData>) {
    const player = b.owningPlayer;
    if (player !== undefined) {
        return createGoalScoredEvent(player);
    }
    return null;
};

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

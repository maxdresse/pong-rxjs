import { b2Body, b2Contact, b2ContactListener } from '@box2d/core';
import { SomeGameEvent } from './types';
import { getPlayer, isPlayer, isWall } from './body-user-data';
import { createPlayerHitsWallEvent } from './events/player-hits-wall-event';

function contactToEvent(contact: b2Contact): SomeGameEvent | null {
    const a = contact.GetFixtureA().GetBody();
    const b = contact.GetFixtureB().GetBody();
    const bodies = [a, b];
    const playerBodies: Array<b2Body> = [];
    const wallBodies: Array<b2Body> = [];
    bodies.forEach(b => {
        if (isPlayer(b)) {
            playerBodies.push(b);
        } else if (isWall(b)) {
            wallBodies.push(b);
        }
    });
    if (playerBodies.length && wallBodies.length) {
        const playerBody = playerBodies[0];
        const player = getPlayer(playerBody);
        if (player !== undefined) {
            return createPlayerHitsWallEvent(player)
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

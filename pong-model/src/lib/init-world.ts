import { b2Body, b2ContactListener, b2Vec2, b2World } from '@box2d/core';
import { createBall, createDynamicRectBody, createEdge } from './b2d-utils';
import { PLAYER_START_POS, playerMass } from './physical-constants';
import { PLAYER_SIZE } from './physical-constants';
import { EventResponder, Player, SomeGameEvent, Vc2 } from './types';
import { W_LOWER_LEFT, W_UPPER_LEFT, W_LOWER_RIGHT, W_UPPER_RIGHT } from './physical-constants';
import { getPlayerUserData, getWallUserData } from './body-user-data';
import { contactToEvent } from './contact-to-event';

export interface InitWorlProps {
    onEvent: (ev: SomeGameEvent) => void;
}

export const initWorld = ({ onEvent }: InitWorlProps) => {
    // create box 2d world
    const gravity = new b2Vec2(0, 0);
    const world = b2World.Create(gravity);
    // boundaries
    initWorldBoundaries(world);
    // players
    const { player1Body, player2Body } = initPlayers(world);
    // ball
    initBall(world);
    const constactListener: b2ContactListener = {
        BeginContact: (contact) => {
            const ev = contactToEvent(contact);
            if (ev) {
                onEvent(ev);
            }
        },
        EndContact: () => {},
        PreSolve: () => {},
        PostSolve: () => {}

    };
    world.SetContactListener(constactListener);

    const tearDownWorld = () => {
        let b = world.GetBodyList();
        while (!!b) {
            world.DestroyBody(b);
            b = b.GetNext();
        };
    };
    return { 
        world,
        playerBodies: [player1Body, player2Body] as [b2Body, b2Body],
        tearDownWorld
        };
};

function initPlayers(world: b2World) {
    const player1Body = createPlayer(world, PLAYER_START_POS, Player.PLAYER1);
    const reflectedStartPos = { x: -PLAYER_START_POS.x, y: PLAYER_START_POS.y};
    const player2Body = createPlayer(world, reflectedStartPos, Player.PLAYER2);
    return { player1Body, player2Body };
}

function createPlayer(world: b2World, pos: Vc2, player: Player) {
    return createDynamicRectBody(world, pos, PLAYER_SIZE,
         { mass: playerMass, fixedRotation: true, userData: getPlayerUserData(player) });
}

function initWorldBoundaries(world: b2World): void {
    const opts =  { userData: getWallUserData() };
    // LEFT
    createEdge(world, W_LOWER_LEFT, W_UPPER_LEFT, opts);
    // RIGHT
    createEdge(world, W_LOWER_RIGHT, W_UPPER_RIGHT, opts);
    // BOTTOM
    createEdge(world, W_LOWER_LEFT, W_LOWER_RIGHT, opts);
    // TOP
    createEdge(world, W_UPPER_LEFT, W_UPPER_RIGHT, opts);
}

function initBall(world: b2World) {
    return createBall(world, b2Vec2.ZERO, 2);
}
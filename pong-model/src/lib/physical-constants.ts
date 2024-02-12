export const MOVE_IMPULSE_FACTOR = 4;
export const defaultDamping = 0.0001;
export const defaultDensity = 10;

export const defaultPositionIterations = 3;
export const defaultVelocityIterations = 8;
export const defaultTimeStep = 1000 / 16;

const WORLD_BOUNDARY_TOP = 27;
const WORLD_BOUNDARY_RIGHT = 48;
const WORLD_BOUNDARY_LEFT = -WORLD_BOUNDARY_RIGHT;
const WORLD_BOUNDARY_BOTTOM = -WORLD_BOUNDARY_TOP;
export const W_LOWER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP };
export const W_LOWER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP };

export const PLAYER_INITIAL_H_DISTANCE = 8
export const PLAYER_SIZE = { x: 1, y: 5 };
export const PLAYER_START_POS = { x: WORLD_BOUNDARY_LEFT + PLAYER_INITIAL_H_DISTANCE, y: 0 };
export const PLAYER_DENSITY = 100;
export const defaultRestitutionThreshold = 0;
export const defaultRestitution = 1;
export const ballDensity = 0.5;
export const playerMass = undefined;





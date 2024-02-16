export const MOVE_IMPULSE_FACTOR = 1.18;
export const DEFAULT_DAMPING = 0.00005;
export const DEFAULT_DENSITY = 4;

export const defaultPositionIterations = 3;
export const defaultVelocityIterations = 8;
export const defaultTimeStep = 1000 / 16;

const WORLD_BOUNDARY_TOP = 40;
const WORLD_BOUNDARY_RIGHT = 60;
const WORLD_BOUNDARY_LEFT = -WORLD_BOUNDARY_RIGHT;
const WORLD_BOUNDARY_BOTTOM = -WORLD_BOUNDARY_TOP;
const WORLD_HEIGHT = 2 * WORLD_BOUNDARY_TOP;
const WORLD_WIDTH = 2 * WORLD_BOUNDARY_RIGHT;

export const W_LOWER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP };
export const W_LOWER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP };

export const PLAYER_INITIAL_H_DISTANCE = 8
export const PLAYER_SIZE = { x: 2, y: 14 };
export const PLAYER_START_POS = { x: WORLD_BOUNDARY_LEFT + PLAYER_INITIAL_H_DISTANCE, y: 0 };
export const PLAYER_DENSITY = 100;
export const defaultRestitutionThreshold = 0;
export const defaultRestitution = 0.85;
export const ballDensity = 0.5;
export const BALL_INITIAL_POS = { x: 4, y: 0 };
export const playerMass = undefined;
export const PLAYER_WALL_SLOWDOWN_FACTOR = 0.35;
export const playerRestitution = 0;

export const FENCE_SIZE = { x: 3, y: WORLD_HEIGHT };
export const BALL_KICKOFF_VELOCITY = 0.011;



export const DEFAULT_DAMPING = 0.01;
export const MOVE_IMPULSE_FACTOR = 2.;
export const DEFAULT_DENSITY = 3.5;

export const DEFAULT_POS_ITERATIONS = 3;
export const DEFAULT_VEL_ITERATIONS = 8;
export const DEFAULT_TIME_STEP = 1000 / 16;

const WORLD_BOUNDARY_TOP = 40;
const WORLD_BOUNDARY_RIGHT = 60;
const WORLD_BOUNDARY_LEFT = -WORLD_BOUNDARY_RIGHT;
const WORLD_BOUNDARY_BOTTOM = -WORLD_BOUNDARY_TOP;
export const WORLD_HEIGHT = 2 * WORLD_BOUNDARY_TOP;
export const WORLD_WIDTH = 2 * WORLD_BOUNDARY_RIGHT;
export const WORLD_ASPECT_RATIO = WORLD_WIDTH / WORLD_HEIGHT;

export const W_LOWER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_LEFT = { x: WORLD_BOUNDARY_LEFT, y: WORLD_BOUNDARY_TOP };
export const W_LOWER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_BOTTOM };
export const W_UPPER_RIGHT = { x: WORLD_BOUNDARY_RIGHT, y: WORLD_BOUNDARY_TOP };

export const PLAYER_INITIAL_H_DISTANCE = 8
export const PLAYER_SIZE = { x: 2, y: 14 };
export const PLAYER_ENLARGED_SIZE = { x: 2, y: 20 };
export const FIRST_PLAYER_START_POS = { x: WORLD_BOUNDARY_LEFT + PLAYER_INITIAL_H_DISTANCE, y: 0 };
export const SECOND_PLAYER_START_POS = { x: -FIRST_PLAYER_START_POS.x, y: FIRST_PLAYER_START_POS.y};
export const PLAYER_DENSITY = 100;
export const DEFAULT_RESTITUTION_THRESHOLD = 0;
export const DEFAULT_RESTITUTION = 0.85;
export const PLAYER_MASS = undefined;
export const PLAYER_WALL_SLOWDOWN_FACTOR = 0.35;
export const PLAYER_RESTITUTION = 0;
export const PLAYER_FRICTION = 0.2;
export const PLAYER_DAMPING = DEFAULT_DAMPING;  

export const BALL_DENSITY = 0.5;
export const BALL_INITIAL_POS = { x: 4, y: 0 };

export const FENCE_SIZE = { x: 3, y: WORLD_HEIGHT };
export const BALL_KICKOFF_VELOCITY = 0;
export const BALL_KICKOFF_DELTA_X = 6;
export const HARD_HIT_THRESHOLD = 0.045;
export const KICKOFF_DELAY = 500;



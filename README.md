# Pong-Rxjs

A pong-like game that uses rxjs and the box2d physics engine.

I created this project in order to practice my rxjs skills and try out a couple of things:

* use of rxjs in a game
* a message-driven architecture which uses intents, events and effects for the controls and the game logic
* no use of classes (except for classes from 3rd party libs), just functions
* browser Gamepad API

## Running the game

```
npm i && npx nx serve pong-demo
```

Controls are WASD for the left paddle, arrow keys for the right paddle.

Gamepad controls use the left analog stick.

## Repo structure 

Repo was scaffolded using Nx.
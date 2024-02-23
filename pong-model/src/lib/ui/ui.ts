import { Player, Score, UIData, UIInput } from '../types';
import { PLAYER_STATUS_W, PLAYER_STATUS_H, PLAYER_STATUS_LH, PLAYER_STATUS_BORDER_WIDTH, PLAYER_STATUS_ALIGNMENT } from './ui-constants';

export function initUI(canvas: HTMLCanvasElement, uiData: UIData): void {
    mountUIElement(canvas, el => {
        el.style.left = '0';
        subscribeToScore(uiData, el, Player.PLAYER1);
    });
    mountUIElement(canvas, el => {
        el.style.right = '0';
        subscribeToScore(uiData, el, Player.PLAYER2);
    });
}

function subscribeToScore(uiData: UIData, el: HTMLDivElement, player: Player) {
    uiData.score$.subscribe(p2s => updateUIEl(el, p2s, player));
}

function updateUIEl(el: HTMLDivElement, p2s: Score['playerToScore'], pl: Player): void {
    el.innerText = p2s[pl] + '';
}

function mountUIElement(canvas: HTMLCanvasElement, initFct: (el: HTMLDivElement) => void) {
    const uiEl = document.createElement('div');
    const stl = uiEl.style;
    stl.position = 'absolute';
    stl.width = PLAYER_STATUS_W;
    stl.height = PLAYER_STATUS_H;
    stl.lineHeight = PLAYER_STATUS_LH;
    stl.border = `solid white ${PLAYER_STATUS_BORDER_WIDTH}`;
    stl.bottom = PLAYER_STATUS_ALIGNMENT;
    stl.color = 'white';
    stl.textAlign = 'center';
    initFct(uiEl);
    const canvasParent = canvas.parentElement;
    if (!canvasParent) {
        console.error('no canvas parent, could not mount UI');
    }
    canvasParent!.append(uiEl);
}

import { createPauseIntent, createPlayIntent } from '../intents/play-pause-intent';
import { createToggleThemeIntent } from '../intents/toggle-theme-intent';
import { TEXT_COL_CSS_PROP } from '../render/render-constants';
import { Player, Score, UIData } from '../types';
import { PLAYER_STATUS_W, PLAYER_STATUS_H, PLAYER_STATUS_LH, PLAYER_STATUS_BORDER_WIDTH, PLAYER_STATUS_ALIGNMENT } from './ui-constants';

const UI_KEY_EVENT_TO_HANDLER: { [key: string]: (uiData: UIData) => void } = {
    Space: uiData => togglePlayPause(uiData),
    KeyT: uiData => toggleTheme(uiData)
};


export function initUI(canvas: HTMLCanvasElement, uiData: UIData): void {
    mountUIElement(canvas, uiData, (el, textcol) => {
        const stl = el.style;
        stl.left = '0';
        initPlayerScoreUIElement(stl, textcol);
        subscribeToScore(uiData, el, Player.PLAYER1);
    });
    mountUIElement(canvas, uiData, (el, textcol) => {
        const stl = el.style;
        stl.right = '0';
        stl.width = PLAYER_STATUS_W;
        stl.height = PLAYER_STATUS_H;
        stl.lineHeight = PLAYER_STATUS_LH;
        stl.border = `solid ${textcol}  ${PLAYER_STATUS_BORDER_WIDTH}`;
        stl.bottom = PLAYER_STATUS_ALIGNMENT;
        subscribeToScore(uiData, el, Player.PLAYER2);
    });
    window.addEventListener('keydown', ev => {
        const handler = UI_KEY_EVENT_TO_HANDLER[ev.code];
        if (handler) {
            handler(uiData);
        }
    });
}

function initPlayerScoreUIElement(stl: CSSStyleDeclaration, textcol: string) {
    stl.width = PLAYER_STATUS_W;
    stl.height = PLAYER_STATUS_H;
    stl.lineHeight = PLAYER_STATUS_LH;
    stl.border = `solid ${textcol}  ${PLAYER_STATUS_BORDER_WIDTH}`;
    stl.bottom = PLAYER_STATUS_ALIGNMENT;
}

function togglePlayPause(uiData: UIData) {
    const intent = uiData.params.paused ? createPlayIntent() : createPauseIntent();
    uiData.onUiIntent(intent);
}

function toggleTheme(uiData: UIData) {
    const intent = createToggleThemeIntent();
    uiData.onUiIntent(intent);
}

function subscribeToScore(uiData: UIData, el: HTMLDivElement, player: Player) {
    uiData.score$.subscribe(p2s => updateUIEl(el, p2s, player));
}

function updateUIEl(el: HTMLDivElement, p2s: Score['playerToScore'], pl: Player): void {
    el.innerText = p2s[pl] + '';
}

function mountUIElement(canvas: HTMLCanvasElement, uiData: UIData, initFct: (el: HTMLDivElement, textcol: string) => void) {
    const textcol = `var(${TEXT_COL_CSS_PROP}, white)`;
    const uiEl = document.createElement('div');
    const stl = uiEl.style;
    stl.position = 'absolute';
    
    stl.color = textcol;
    stl.textAlign = 'center';
    initFct(uiEl, textcol);
    const canvasParent = canvas.parentElement;
    if (!canvasParent) {
        console.error('no canvas parent, could not mount UI');
    }
    canvasParent!.append(uiEl);
}

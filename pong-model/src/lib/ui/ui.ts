import { Player, UIData, UIInput } from '../types';

export function initUI(canvas: HTMLCanvasElement, uiData: UIData): void {
    mountUIElement(canvas, el => {
        el.style.left = '0';
        uiData.input$.subscribe(d => updateUIEl(el, d, Player.PLAYER1))
    });
    mountUIElement(canvas, el => {
        el.style.right = '0';
        uiData.input$.subscribe(d => updateUIEl(el, d, Player.PLAYER2))
    });
}

function updateUIEl(el: HTMLDivElement, d: UIInput, pl: Player): void {
    el.innerText = d.score.playerToScore[pl] + '';
}

function mountUIElement(canvas: HTMLCanvasElement, initFct: (el: HTMLDivElement) => void) {
    const uiEl = document.createElement('div');
    const stl = uiEl.style;
    stl.position = 'absolute';
    stl.width = '50px';
    stl.height = '50px';
    stl.border = 'solid white 1px';
    stl.bottom = '0';
    stl.color = 'white';
    initFct(uiEl);
    const canvasParent = canvas.parentElement;
    if (!canvasParent) {
        console.error('no canvas parent, could not mount UI');
    }
    canvasParent!.append(uiEl);
}

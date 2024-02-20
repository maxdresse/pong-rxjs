import { IColorScheme } from '../../types';
import { lighten, rgb } from './color-utils';

const r = rgb;

const eDarkPurple = [33, 15, 39];
const ePurple = [75, 30, 72];	
const ePink = [198, 56, 123];
const eLightBlue = [83, 167, 234];
const eWhite = [255, 255, 255];

export const EIGHTIES_DARK_SCHEME: IColorScheme = {
    background: r(eDarkPurple),
    player: {
        fill: r(eLightBlue),
        stroke: r(lighten(eLightBlue))
    },
    ball: {
        fill: r(ePink),
        stroke: r(lighten(ePink))
    },
    fence: {
        fill: r(ePurple, 0.5),
        stroke: r(lighten(ePurple), 0.5)
    },
    wall: r(eWhite)
}
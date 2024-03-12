import { GameStatsRecord, StatsCollector } from '../types';

export enum AddMode {
    PREPEND,
    APPEND
}

export interface StatsCollectorProps {
    maxBufferSize?: number;
    addMode?: AddMode;
}

export function createStatsCollector({ maxBufferSize, addMode }: StatsCollectorProps = {}): StatsCollector {
    maxBufferSize = maxBufferSize ?? 2000;
    addMode = addMode ?? AddMode.PREPEND; 
    const records: Array<GameStatsRecord> = [];
    let currentRecord: GameStatsRecord = {};
    let writing = false;
    return {
        beginRecord: () => {
            if (writing) {
                console.error('began writing record before old was closed');
            }
            writing = true;
            currentRecord = {}; // reset
        },
        writeAttribute: (id, v) => {
            currentRecord[id] = v;
        },
        endRecord: () => {
            if (!writing) {
                console.error('no record to end');
            }
            writing = false;
            if (addMode === AddMode.APPEND) {
                records.push(currentRecord);
            } else {
                records.unshift(currentRecord);
            }
        },
        clear: () => {
            records.length = 0;
        }
    }
}
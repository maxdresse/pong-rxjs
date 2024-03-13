import { GameStatsAttribute, GameStatsRecord, StatsCollector } from '../types';

export enum AddMode {
    PREPEND,
    APPEND
}

export interface StatsCollectorProps {
    maxBufferSize?: number;
    addMode?: AddMode;
}

export function createStatsCollector({ maxBufferSize, addMode }: StatsCollectorProps = {}): StatsCollector {
    const mbs = maxBufferSize ?? 100;
    addMode = addMode ?? AddMode.PREPEND; 
    const records: Array<GameStatsRecord> = [];
    const attributes: Array<GameStatsAttribute> = [];
    let currentRecord: GameStatsRecord = {};
    let writing = false;
    return {
        defineAttribute: (attriId, label) => {
            if (!attributes.find(a => a.id === attriId)) {
                attributes.push({ id: attriId, label });
            }
        },
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
                if (records.length > mbs) {
                 records.splice(0, records.length - mbs);   
                }
            } else {
                records.unshift(currentRecord);
                if (records.length > mbs) {
                    records.length = mbs;
                }
            }

        },
        clearRecords: () => {
            records.length = 0;
        },
        getAttributes: () => attributes,
        getRecords: () => records
    }
}
import { Observable, auditTime, map, of, switchMap } from 'rxjs';
import { GameSituation, GameStatistics, IGameDef, StatsCollector, StatsLogger } from '../types';
import { createStatsCollector } from './stats-collector';
import { STATS_ENTRIES } from './stats-entries';

export interface GetStatsProps {
    onFrame$: Observable<void>;
    statsConfig: IGameDef['stats'];
    getGameSituation:() => GameSituation;
}

export function getGameStats({ onFrame$, statsConfig, getGameSituation }: GetStatsProps): Observable<GameStatistics> {
    const updateInterval$ = statsConfig?.updateInterval$;
    if (!updateInterval$) {
        // no interval set => no logging
        return of({
            attributes: [],
            records: []
        });
    }
    const logger = createStatsLogger(statsConfig.recordsMaxBufferSize);
    return updateInterval$.pipe(
        switchMap(updateInterval => onFrame$.pipe(
            updateInterval > 0 ? auditTime(updateInterval) : map(x => x),
            map(() => logger.log(getGameSituation()))
        ))
    );
}

function createStatsLogger(maxRecordBufSize?: number): StatsLogger {
    const collector = createStatsCollector({ maxBufferSize: maxRecordBufSize });
    STATS_ENTRIES.forEach(({ attrId, label }) => {
        collector.defineAttribute(attrId, label);
    });
    return {
        log: gameSituation => {
            collector.beginRecord();
            STATS_ENTRIES.forEach(({ attrId, getValue }) => {
                collector.writeAttribute(attrId, getValue(gameSituation));
            });     
            collector.endRecord();
            return {
                attributes: collector.getAttributes(),
                records: collector.getRecords(),
            }
        }
    };
}

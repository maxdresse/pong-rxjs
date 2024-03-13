import { Observable, auditTime, map, of, switchMap } from 'rxjs';
import { GameSituation, GameStatistics, IGameDef, StatsCollector, StatsLogger } from '../types';
import { createStatsCollector } from './stats-collector';
import { STATS_ENTRIES } from './stats-entries';

export interface GetStatsProps {
    onFrame$: Observable<void>;
    updateInterval$?: Observable<number>;
    getGameSituation:() => GameSituation;
}

export function getGameStats({ onFrame$, updateInterval$, getGameSituation }: GetStatsProps): Observable<GameStatistics> {
    if (!updateInterval$) {
        // no interval set => no logging
        return of({
            attributes: [],
            records: []
        });
    }
    const logger = createStatsLogger();
    return updateInterval$.pipe(
        switchMap(updateInterval => onFrame$.pipe(
            updateInterval > 0 ? auditTime(updateInterval) : map(x => x),
            map(() => logger.log(getGameSituation()))
        ))
    );
}

function createStatsLogger(): StatsLogger {
    const collector = createStatsCollector();
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

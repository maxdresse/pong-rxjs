import { Observable, auditTime, map, of, switchMap } from 'rxjs';
import { GameStatistics, IGameDef, Player, StatsLogger } from '../types';
import { createStatsCollector } from './stats-collector';

export interface GetStatsProps {
    onFrame$: Observable<void>;
    updateInterval$?: Observable<number>;
}

export function getGameStats({ onFrame$, updateInterval$ }: GetStatsProps): Observable<GameStatistics> {
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
            auditTime(updateInterval),
            map(() => ({
                attributes: [],
                records: []
            }))
        ))
    );
}

function createStatsLogger(): StatsLogger {
    const collector = createStatsCollector();
    return {
        log: ({ playerBodies, score }) => {
            // iterate over bodies and score
            collector.beginRecord();
            collector.writeAttribute('p1xv', playerBodies[Player.PLAYER1].GetLinearVelocity().x)
            collector.endRecord();
        }
    };
}
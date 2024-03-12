import { Observable, of } from 'rxjs';
import { GameStatistics, IGameDef, Player, StatsLogger } from '../types';
import { createStatsCollector } from './stats-collector';

export interface GetStatsProps {
    onFrame$: Observable<void>;
    updateInterval$?: Observable<number>;
}

export function getGameStats({ onFrame$ }: GetStatsProps): Observable<GameStatistics> {
    return of({
        attributes: [],
        records: []
    });
}

function createStatsLogger(): StatsLogger {
    const collector = createStatsCollector();
    return {
        log: ({ playerBodies, score }) => {
            // iterate over bodies and score
            collector.beginRecord();
            collector.writeAttribute('p1xv','Player 1 X Velocity', playerBodies[Player.PLAYER1].GetLinearVelocity().x)
            collector.endRecord();
        }
    };
}
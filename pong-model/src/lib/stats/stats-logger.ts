import { StatsCollector, StatsLogger } from '../types';

export interface StatsLoggerProps {
    collector: StatsCollector;
}

export function createStatsLogger(): StatsLogger {
    const logger = createStatsLogger()
    return {
        onFrame: () => {
            //
        }
    };
}
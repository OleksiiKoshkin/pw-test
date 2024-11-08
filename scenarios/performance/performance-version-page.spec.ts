import { testVersionPerf } from './version-performance-test-executor';
import { scenarioPlayer } from '../../scenarios-player';

scenarioPlayer({ scenarioId: 'performance-version-page', testExecutor: testVersionPerf });

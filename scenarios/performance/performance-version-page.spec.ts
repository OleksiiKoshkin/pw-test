import { scenarioPlayer } from '../shared';
import { testVersionPerf } from './version-performance-test-executor';

scenarioPlayer({ scenarioId: 'performance-version-page', testExecutor: testVersionPerf });

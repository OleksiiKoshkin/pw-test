import { scenarioPlayer } from '../../shared';
import { testPnlLines } from './pnl-line-test-executor';

scenarioPlayer({ scenarioId: 'pnl_values_10x', testExecutor: testPnlLines });


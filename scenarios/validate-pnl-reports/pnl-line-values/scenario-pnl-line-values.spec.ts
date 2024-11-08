import { testPnlLines } from './pnl-line-test-executor';
import { scenarioPlayer } from '../../../scenarios-player';

scenarioPlayer({ scenarioId: 'pnl_values_10x', testExecutor: testPnlLines });
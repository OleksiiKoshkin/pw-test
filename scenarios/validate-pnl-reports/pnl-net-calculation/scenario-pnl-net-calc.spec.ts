import { testNetCalc } from './pnl-net-calc-test-executor';
import { scenarioPlayer } from '../../../scenarios-player';

scenarioPlayer({ scenarioId: 'pnl_net_calculation', testExecutor: testNetCalc });
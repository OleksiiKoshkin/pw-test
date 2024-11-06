import { scenarioPlayer } from '../../shared';
import { testNetCalc } from './pnl-net-calc-test-executor';

scenarioPlayer({ scenarioId: 'pnl_net_calculation', testExecutor: testNetCalc });


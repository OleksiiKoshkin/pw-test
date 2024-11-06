import { scenarioPlayer } from '../shared';
import { testArrNumberChains } from './arr-accuracy-test-executor';

scenarioPlayer({ scenarioId: 'arr_net_top_accuracy', testExecutor: testArrNumberChains });

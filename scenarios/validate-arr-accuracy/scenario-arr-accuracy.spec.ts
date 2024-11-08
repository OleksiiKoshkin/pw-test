import { testArrNumberChains } from './arr-accuracy-test-executor';
import { scenarioPlayer } from '../../scenarios-player';

scenarioPlayer({ scenarioId: 'arr_net_top_accuracy', testExecutor: testArrNumberChains });

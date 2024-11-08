import { scenarioPlayer } from '../../scenarios-player';
import { testLoginFlow } from './login-flow-test-executor';

scenarioPlayer({ scenarioId: 'login-flow', testExecutor: testLoginFlow });

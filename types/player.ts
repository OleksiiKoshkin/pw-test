import { Page } from '@playwright/test';
import { KnownScenario, Widget } from '../scenarios/shared';

export type ScenarioRunContext = {
  page?: Page,
  popup?: Page,
  widget?: Widget
}

export type PlayerParams = {
  scenarioId: KnownScenario;
  testExecutor: (params: ScenarioRunContext) => void
}

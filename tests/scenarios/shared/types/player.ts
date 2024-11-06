import { Page } from '@playwright/test';
import { Widget } from '../models';

export type PlayerTestSinglePageExecutorParams = {
  page: Page
  widget: Widget
}

export type ScenarioRunContext = {
  page?: Page,
  popup?: Page,
  widget?: Widget
}

export type PlayerParams = {
  scenarioId: string;
  testExecutor: (params: ScenarioRunContext) => void
}

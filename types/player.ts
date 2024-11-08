import { Page } from '@playwright/test';
import { Widget } from '../scenarios-player';
import { DomainType, KnownScenario, TenantCode } from './environment';

export type ScenarioRunContext = {
  page?: Page,
  popup?: Page,
  baseUrl: string,
  tenant: TenantCode // acme3
  domain: DomainType // production
  navigate?: (url: string) => Promise<void>, // without base url, just "board" or "versions"
  widget?: Widget
}

export type PlayerParams = {
  scenarioId: KnownScenario;
  testExecutor: (params: ScenarioRunContext) => void
}

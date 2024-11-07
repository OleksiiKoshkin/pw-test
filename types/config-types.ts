import { DomainType, TenantCode } from '../tests/shared/types';

export type ConfigTargetVariant = {
  id?: string
  name: string
  queryParams?: string
} & Record<string, string>;

export type ConfigTarget = {
  id?: string
  tenant: TenantCode // acme3
  domain: DomainType // production
  url?: string
  name?: string
  targetWidgetId?: string // widget container identification
  variants?: ConfigTargetVariant[] // extra navigation parameters
}

export type ConfigScenario = {
  scenarioId: string
  name: string
  targets: ConfigTarget[]
}
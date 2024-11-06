import { DomainType, TenantCode } from '../../../shared/types';

export type ConfigTargetVariant = {
  name: string
  queryParams?: string
} & Record<string, string>;

export type ConfigTarget = {
  tenant: TenantCode // acme3
  domain: DomainType // production
  url?: string
  targetWidgetId?: string // widget container identification
  variants?: ConfigTargetVariant[] // extra navigation parameters
}
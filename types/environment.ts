export const knownScenarios = [
  'arr_net_top_accuracy',
  'pnl_values_10x',
  'pnl_net_calculation',
  'performance-version-page',
  'login-flow'
] as const;

export type KnownScenario = typeof knownScenarios[number];

export const domainTypes = {
  production: 'app.fintastic.ai',
  staging: 'app.staging.fintastic.ai',
  development: 'development.fintastic.ai',
  local: 'localhost:3000'
} as const;

export type DomainType = keyof typeof domainTypes;

export const tenants = {
  acme3: 'acme3',
  claroty: 'd5eh3j'
} as const;

export type TenantCode = keyof typeof tenants;

export type ScenarioUrl = {
  name: string,
  url: string
}

export type ScenarioTarget = {
  tenant: TenantCode
  domain: DomainType
  targets: Array<ScenarioUrl>

  specific?: Record<string, string>; // +extra fields
}
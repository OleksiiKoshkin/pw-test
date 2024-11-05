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

export type ScenarioTarget = {
  tenant: TenantCode
  domain: DomainType
  url: string
} & Record<string, string>;
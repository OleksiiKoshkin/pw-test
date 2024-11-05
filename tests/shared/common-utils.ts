import { Page } from '@playwright/test';
import { testTarget } from '../../lib/test-env';
import { DomainType, domainTypes, TenantCode, tenants } from './types';

export const navigateTo = async (page: Page, url: string) => (page.goto(`${testTarget.baseUrl}/${url}`));

export const whichEnvironment = {
  isProd: testTarget.baseUrl.includes(domainTypes.production),
  isStaging: testTarget.baseUrl.includes(domainTypes.staging),
  isDev: testTarget.baseUrl.includes(domainTypes.development),
  isLocal: testTarget.baseUrl.includes(domainTypes.local)
};

export const whichTenant = testTarget.tenant;

export const isCiCd = !!process.env.CI

export const isTargetDomain = (domain: DomainType) =>
  // @todo: improve check logic?
  testTarget.baseUrl.includes(domainTypes[domain]);


export const isTargetTenant = (tenant: TenantCode) => testTarget.tenant === tenants[tenant];

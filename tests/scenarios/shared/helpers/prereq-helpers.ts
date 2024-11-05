import { isCiCd, isTargetDomain, isTargetTenant } from '../../../shared/common-utils';
import { ScenarioTarget } from '../../../shared/types';
import { test } from '@playwright/test';

export const checkScenarioEnvironment = (target: ScenarioTarget) => {
  if (isCiCd) {
    if (!isTargetDomain(target.domain)) {
      throw new Error('Invalid environment settings (domain)!');
    }
    if (!isTargetTenant(target.tenant)) {
      throw new Error('Invalid environment settings (tenant)!');
    }
  }
  test.skip(!isCiCd && !isTargetDomain(target.domain), 'Incorrect target domain!');
  test.skip(!isCiCd && !isTargetTenant(target.tenant), 'Incorrect target tenant!');
};
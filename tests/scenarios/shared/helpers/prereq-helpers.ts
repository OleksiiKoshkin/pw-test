import { isCiCd, isTargetDomain, isTargetTenant } from '../../../shared/common-utils';
import { ScenarioTarget } from '../../../shared/types';
import { test } from '@playwright/test';
import { testUser } from '../../../../lib/test-user';

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

export const checkScenarioPrerequisites = () => {
  if (!testUser.login) {
    throw new Error('Empty login!');
  }

  if (!testUser.password) {
    throw new Error('Empty password!');
  }
};

export const ensureEndSlash = (str: string) => {
  if (!str) {
    return '';
  }
  if (str.trim().endsWith('/')) {
    return str;
  }
  return str + '/';
};

export const ensureStartQuestion = (str?: string) => {
  if (!str) {
    return '';
  }
  if (str.trim().startsWith('?')) {
    return str;
  }
  return '?' + str;
};
import { testUser } from '../../../lib/test-user';

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
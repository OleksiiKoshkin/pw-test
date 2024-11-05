import { TenantCode } from '../tests/shared/types';

type Target = {
  tenant: TenantCode
  baseUrl: string
}

let normalisedUrl = process.env.DOMAIN || '';
if (normalisedUrl.endsWith('/')) {
  normalisedUrl = normalisedUrl.substring(0, normalisedUrl.length - 1);
}

export const testTarget: Target = {
  tenant: (process.env.TENANT || '') as TenantCode,
  baseUrl: normalisedUrl
};

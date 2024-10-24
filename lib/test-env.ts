type Target = {
  tenant: string
  baseUrl: string
}

console.log('env', process.env);
console.log('tenant', process.env.TENANT);

export const testTarget: Target = {
  tenant: process.env.TENANT || '',
  baseUrl: process.env.DOMAIN || ''
};

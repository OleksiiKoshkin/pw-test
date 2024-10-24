type Target = {
  tenant: string
  baseUrl: string
}

console.log('env', process.env);

export const testTarget: Target = {
  tenant: process.env.TENANT || '',
  baseUrl: process.env.DOMAIN || ''
};

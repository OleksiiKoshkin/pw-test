type Target = {
  tenant: string
  baseUrl: string
}

export const testTarget: Target = {
  tenant: process.env.TENANT || '',
  baseUrl: process.env.DOMAIN || ''
};

type User = {
  login: string
  password: string
}

export const testUser: User = {
  login: process.env.TEST_USER || '',
  password: process.env.TEST_USER_PASSWORD || '',
};

export const standardUser: User = {
  login: process.env.STANDARD_USER || '',
  password: process.env.STANDARD_USER_PASSWORD || '',
};

export const invalidUser: User = {
  login: process.env.INCORRECT_USER || '',
  password: process.env.INCORRECT_USER_PASSWORD || '',
}


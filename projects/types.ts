export type ProjectNames = |
  'config prereq' |
  'login prereq' |
  'login' |
  'logout' |
  'app auth' |
  'app all (logged-in)' |
  'app performance'

export type ProjectConfig = {
  name: ProjectNames
  testMatch: string
  dependencies?: ProjectNames[]
}
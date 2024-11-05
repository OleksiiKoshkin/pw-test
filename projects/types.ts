export type ProjectNames = |
  'config prereq' |
  'login prereq' |
  'login' |
  'logout' |
  'app auth' |
  'app all (logged-in)' |
  'app performance' |
  'scenario arr accuracy numbers'

export type ProjectConfig = {
  name: ProjectNames
  testMatch: string
  dependencies?: ProjectNames[]
}
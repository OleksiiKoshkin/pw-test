export type ProjectNames = |
  'config prereq' |
  'login prereq' |
  'login' |
  'logout' |
  'app auth' |
  'app all (logged-in)' |
  'app performance' |
  'scenario arr accuracy numbers' |
  'scenario pnl report line values' |
  'scenario pnl report net calc'

export type ProjectConfig = {
  name: ProjectNames
  testMatch: string
  dependencies?: ProjectNames[]
}
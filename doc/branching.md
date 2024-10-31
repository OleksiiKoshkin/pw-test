# Fintastic e2e: Branching

Generally, e2e tests are living in the main branch. Usually you can [run them](ci-cd-run.md) on a specific environment.

Sometimes, if you are developing a new feature in a new branch, you need to isolate its tests for the future. To do
that, you can create specific branch in e2e repository and use it on CI/CD.

Usual flow of e2e for new features:

1. Create app branch (optionally - test environment).
2. Create corresponding e2e branch.
3. Develop. 
4. Write and run e2e tests locally.
5. [Optional] If you have app test environment for the feature:
   1. [Create new environment on CI/CD](ci-cd-environments.md) 
   2. Run e2e tests on CI/CD using your branch and new environment.
6. Merge feature to app repository (PR).
7. Merge feature into e2e repository (PR). 
   1. Remove environment created on step 5, if any.

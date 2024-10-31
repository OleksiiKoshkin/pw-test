# Fintastic e2e: Tests setup and teardown

## Data is real

Firstly, we don't have a special database and autosetup. This means that all the changes that the tests make will be
stored in the target database.

**Please be very careful with tests that modify data in a production environment!**

**Please note: in CI/CD it is more or less safe to only have exclusive per-tenant execution for each environment.**

## Nothing is guaranteed

Second, we don't have a stable predefined data set. You cannot rely on any data (version, board, list, metric, etc.) to
exist guaranteed. We have a dedicated test version as well as a set of test users, but it always needs to be pre-tested.

**Please check the prerequisites and fail fast with correct messages**

## Set Up and Clean Up

If your tests modify data, e.g. create a list -> add rows -> check data, they should delete that list after execution (
at `test.afterAll`). Or the name of the list must be generated and uniq - otherwise this test will work only once.

**Please clean up your changes or make tests encapsulating**

**If your test-generated data is used in one of your other tests, set up dependencies and take care of the final
cleanup.**

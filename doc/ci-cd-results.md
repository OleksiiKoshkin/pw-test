# Fintastic e2e: accessing CI/CD test results

## GitHub Console

There are several ways to reach the test results. 

### 1. Just reading the console:

![screenshot](img/ci-cd-open-results.png)

which displays text console:

![screenshot](img/ci-cd-test-results-1.png)

then click and:

![screenshot](img/ci-cd-test-results-2.png)

You can download log or view raw data. Not too user-friendly but OK for preview.

### 2. Local Playwright trace player

Also, you can download the test artifacts:

![screenshot](img/ci-cd-artifact-report.png)

Then, extract archive:

![screenshot](img/ci-cd-downloaded.png)

and run player in a console:

```shell
npx playwright show-report ~/Downloads/playwright-report-2
```

and it will open in the browser:
![screenshot](img/ci-cd-trace.png)

So you need to execute

```shell
npx playwright show-report %path_to_a_folder_with_downloaded_report%
```

(if Playwright is not installed please install it, as well as NodeJS and NPX)

Read more: [Trace viewer](https://playwright.dev/docs/trace-viewer).

### 3. Online player (not recommended but possible)

You can use [Playwright's online player](https://trace.playwright.dev/) to expand downloaded results.


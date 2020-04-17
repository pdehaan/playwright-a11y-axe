# playwright-a11y-axe

Running axe-core a11y linter via Playwright.

## USAGE

```sh
npx pdehaan/playwright-a11y-axe [url1] [url2]
```

This script should write out the Axe report (JSON) and a screenshot of the page to the local directory (using the hostname and current date as a filename). You can overwrite the filename by passing a `FILENAME` env var on the command line, but that probably won't be very useful if you're trying to parse more than one URL per request.

#!/usr/bin/env node

const { AxePuppeteer } = require("axe-puppeteer");
const fs = require("fs-extra");
const playwright = require("playwright");

// Get abs path for minified axe-core (via node_modules) so we can inject it into the rendered page.
const axeCorePath = require.resolve("axe-core/axe.min.js");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const uris = process.argv.slice(2);
  if (uris.length === 0) {
    console.info("USAGE `npx pdehaan/playwright-a11y-axe [url1] [url2]`");
    process.exit(1);
  }
  for (const uri of uris) {
    await scrape(uri);
  }
}

async function scrape(uri, product = "firefox") {
  const hostname = new URL(uri).hostname;
  const date = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const basename = process.env.FILENAME || `${hostname}-${date}`;

  // Launch the specified browser (default: "firefox").
  const browser = await playwright[product].launch();
  // Bypass CSP since we need to inject a special axe-core script tag.
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  await page.goto(uri);
  // Inject the axe-core script tag so it lives in `window.axe` context.
  await page.addScriptTag({ path: axeCorePath });
  // Feel great shame by hacking AxePuppeteer to do the work for us.
  const results = await new AxePuppeteer(page).analyze();
  // Debugging and close browser/session.
  await page.screenshot({ path: `${basename}.png` });
  await fs.writeJson(`${basename}.json`, results, { spaces: 2 });
  await browser.close();
}

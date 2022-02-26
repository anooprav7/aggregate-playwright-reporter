
# aggregate-playwright-reporter

| A custom `playwright reporter` which gives the concise aggregated stats of a complete run (all test stats aggregate).
## Installation

```Shell
npm install aggregate-playwright-reporter --dev
```

#### Sample output
```json
{
  "total": 1,
  "expected": 0,
  "unexpected": 0,
  "flaky": 0,
  "skipped": 1,
  "ok": true,
  "duration": 17
}
```
## Usage with playwright

```ts
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  reporter: [ ['aggregate-playwright-reporter', { outputFile: 'results.json' }] ],
};
export default config;
```
- If `outputFile` option is not provided, then the result is printed to `stdio`.

/**
 * Copyright (c) Microsoft Corporation.
 * Modifications by Anoop Raveendran <https://github.com/anooprav7>
 * https://github.com/allure-framework/allure-js/blob/master/packages/allure-playwright/test/stdio.spec.ts
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from "./fixtures";

test("stdio - expected", async ({
  runInlineTest
}) => {
  const result = await runInlineTest({
    "a.test.ts": `
    import { test, expect } from '@playwright/test';
       test('stdout should work', async ({}) => {
         console.log('System out');
       });
     `
  });
  expect(result).toMatchObject({
    expected: 1,
    flaky: 0,
    ok: true,
    skipped: 0,
    total: 1,
    unexpected: 0
  });
  expect(result.duration).toBeDefined();
});

test("stdio - unexpected", async ({
  runInlineTest
}) => {
  const result = await runInlineTest({
    "a.test.ts": `
      import { test, expect } from '@playwright/test';
      test('stdout should work', async ({}) => {
        expect(1).toEqual(2);
      });
    `
  });
  expect(result).toMatchObject({
    expected: 0,
    flaky: 0,
    ok: false,
    skipped: 0,
    total: 1,
    unexpected: 1
  });
  expect(result.duration).toBeDefined();
});

test("stdio - skipped", async ({
  runInlineTest
}) => {
  const result = await runInlineTest({
    "a.test.ts": `
      import test from '@playwright/test';
      test('stdout should work', async ({}) => {
        test.skip(true, 'Check skipped');
      });
    `
  });
  expect(result).toMatchObject({
    expected: 0,
    flaky: 0,
    ok: true,
    skipped: 1,
    total: 1,
    unexpected: 0
  });
  expect(result.duration).toBeDefined();
});

test("stdio - flaky", async ({
  runInlineTest
}) => {
  const result = await runInlineTest(
    {
      "playwright.config.ts": `
    module.exports = { name: 'project-name', retries: 1 };
  `,
      "a.test.ts": `
      import { test, expect } from '@playwright/test';
      test('flaky', async ({}, testInfo) => {
        expect(testInfo.retry).toEqual(1)
      });
    `
    }
  );
  expect(result).toMatchObject({
    expected: 0,
    flaky: 1,
    ok: false,
    skipped: 0,
    total: 2,
    unexpected: 1
  });
  expect(result.duration).toBeDefined();
});

test("stdio - aggregte (all)", async ({
  runInlineTest
}) => {
  const result = await runInlineTest(
    {
      "playwright.config.ts": `
    module.exports = { name: 'project-name', retries: 1 };
  `,
      "a.test.ts": `
      import { test, expect } from '@playwright/test';
      test('expected', async ({}) => {
        console.log("expected");
      });
      test('skipped', async ({}) => {
        test.skip(true, 'Check skipped');
      });
      test('unexpected', async ({}) => {
        expect(1).toEqual(2);
      });
      test('flaky', async ({}, testInfo) => {
        expect(testInfo.retry).toBe(1);
      });
    `
    }
  );
  expect(result).toMatchObject({
    expected: 1,
    flaky: 1,
    ok: false,
    skipped: 1,
    total: 6,
    unexpected: 3
  });
  expect(result.duration).toBeDefined();
});

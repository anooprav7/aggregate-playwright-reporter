/**
 * Inspired from https://github.com/microsoft/playwright/blob/main/packages/playwright-test/src/reporters/html.ts
 */
import fs from 'fs';
import path from 'path';
import {
  Reporter,
  TestCase,
  TestResult
} from '@playwright/test/reporter';

export type Stats = {
  total: number;
  expected: number;
  unexpected: number;
  flaky: number;
  skipped: number;
  ok: boolean;
  duration: number;
};

const emptyStats = (): Stats => {
  return {
    total: 0,
    expected: 0,
    unexpected: 0,
    flaky: 0,
    skipped: 0,
    ok: true,
    duration: 0,
  };
};

class AggregateReporter implements Reporter {
  private stats!: Stats;
  private _outputFile: string | undefined;

  constructor(options: { outputFile?: string } = {}) {
    this._outputFile = options.outputFile || process.env[`PLAYWRIGHT_AGGREGATE_OUTPUT_NAME`];
  }

  onBegin() {
    this.stats = emptyStats();
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const outcome = test.outcome();
    if (outcome === 'expected') ++this.stats.expected;
    if (outcome === 'skipped') ++this.stats.skipped;
    if (outcome === 'unexpected') ++this.stats.unexpected;
    if (outcome === 'flaky') ++this.stats.flaky;
    ++this.stats.total;
    this.stats.duration += result.duration;
    this.stats.ok = this.stats.unexpected + this.stats.flaky === 0;
  }

  async onEnd() {
    outputReport(this.stats, this._outputFile);
  }
}

function outputReport(stats: Stats, outputFile: string | undefined) {
  const reportString = JSON.stringify(stats, undefined, 2);
  if (outputFile) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, reportString);
  } else {
    console.log(reportString);
  }
}

export default AggregateReporter;

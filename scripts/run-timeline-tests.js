/**
 * scripts/run-timeline-tests.js
 *
 * Node launcher for Vayam Phase 10 Smart Civic Timeline unit tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 10 Smart Civic Timeline Unit Tests...\n");
  execSync("npx tsx lib/timeline/__tests__/timeline.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

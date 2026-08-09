/**
 * scripts/run-i18n-tests.js
 *
 * Node launcher for Vayam Phase 9 i18n & Multilingual unit tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 9 i18n & Multilingual Unit Tests...\n");
  execSync("npx tsx lib/i18n/__tests__/i18n.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

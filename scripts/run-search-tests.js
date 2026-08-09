/**
 * scripts/run-search-tests.js
 *
 * Node launcher for Vayam Phase 7 Search & Discovery tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 7 Search & Discovery Unit Tests...\n");
  execSync("npx tsx lib/knowledge/__tests__/search-discovery.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

/**
 * scripts/run-verification-tests.js
 *
 * Node launcher for Vayam Phase 6B Source & Verification Layer tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 6B Verification Layer Unit Tests...\n");
  execSync("npx tsx lib/knowledge/__tests__/verification-layer.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

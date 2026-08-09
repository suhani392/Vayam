/**
 * scripts/run-core-tests.js
 *
 * Node launcher for Vayam Core Intelligence Engine tests.
 */

const { execSync } = require("child_process");

try {
  const output = execSync("npx tsx lib/core/__tests__/core-engine.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

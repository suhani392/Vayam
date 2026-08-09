/**
 * scripts/run-assistant-tests.js
 *
 * Node launcher for Vayam Phase 8 AI Civic Assistant unit tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 8 AI Civic Assistant Unit Tests...\n");
  execSync("npx tsx lib/ai/__tests__/assistant.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

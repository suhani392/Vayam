/**
 * scripts/run-voice-tests.js
 *
 * Node launcher for Vayam Phase 9 Voice Architecture unit tests.
 */

const { execSync } = require("child_process");

try {
  console.log("Running Phase 9 Voice Architecture Unit Tests...\n");
  execSync("npx tsx lib/voice/__tests__/voice.test.ts", {
    encoding: "utf-8",
    stdio: "inherit",
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}

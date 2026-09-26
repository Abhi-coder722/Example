import { spawn } from "node:child_process";

const processes = [
  spawn("node", ["server/index.mjs"], { stdio: "inherit", env: process.env }),
  spawn("npx", ["vite", "--host", "127.0.0.1"], { stdio: "inherit", env: process.env })
];

function shutdown(signal) {
  for (const proc of processes) proc.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

for (const proc of processes) {
  proc.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown("SIGTERM");
      process.exit(code);
    }
  });
}

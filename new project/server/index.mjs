import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { generateReport, getBootstrapData, projectRoot } from "./reportEngine.mjs";

const port = Number(process.env.PORT ?? 4318);

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(JSON.stringify(body, null, 2));
}

async function sendFile(res, urlPath) {
  const filePath = path.normalize(path.join(projectRoot, urlPath));
  const artifactRoot = path.join(projectRoot, "artifacts");
  if (!filePath.startsWith(artifactRoot)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  const ext = path.extname(filePath);
  const type = ext === ".pptx"
    ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    : "application/json; charset=utf-8";

  const data = await fs.readFile(filePath);
  res.writeHead(200, {
    "content-type": type,
    "content-disposition": `attachment; filename="${path.basename(filePath)}"`
  });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      sendJson(res, 200, {});
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/bootstrap") {
      sendJson(res, 200, getBootstrapData());
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true, service: "kpi-report-generator", at: new Date().toISOString() });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/reports/generate") {
      const payload = await readJson(req);
      const result = await generateReport(payload);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/artifacts/")) {
      await sendFile(res, url.pathname);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Unexpected error"
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`KPI report service listening on http://127.0.0.1:${port}`);
});

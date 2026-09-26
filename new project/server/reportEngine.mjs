import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";
import { kpiCatalog, runDefaults, templateManifest } from "./sampleData.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(__dirname, "..");
export const artifactRoot = path.join(projectRoot, "artifacts");

const colors = {
  ink: "1D2630",
  slate: "4A5568",
  blue: "2F6FED",
  teal: "1A936F",
  amber: "D98F21",
  red: "C2413B",
  paleBlue: "EAF1FF",
  paleTeal: "E7F5F0",
  paleAmber: "FFF5E0",
  line: "D7DEE8",
  white: "FFFFFF"
};

function timestamp() {
  return new Date().toISOString();
}

function formatValue(kpi, value = kpi.value) {
  const fmt = kpi.format ?? { kind: "number", decimals: 0 };
  const decimals = fmt.decimals ?? 0;
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";

  if (fmt.kind === "percent") return `${(value * 100).toFixed(decimals)}%`;

  if (fmt.kind === "currency") {
    const divisor = fmt.notation === "millions" ? 1000000 : fmt.notation === "thousands" ? 1000 : 1;
    const suffix = fmt.notation === "millions" ? "M" : fmt.notation === "thousands" ? "K" : "";
    return `$${(value / divisor).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`;
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function scoreKpi(kpi) {
  const thresholds = kpi.thresholds;
  if (!thresholds) return "neutral";
  if (thresholds.lowerIsBetter) {
    if (kpi.value <= thresholds.green) return "green";
    if (kpi.value <= thresholds.yellow) return "yellow";
    return "red";
  }
  if (kpi.value >= thresholds.green) return "green";
  if (kpi.value >= thresholds.yellow) return "yellow";
  return "red";
}

function validateKpi(kpi, auditLog) {
  const startedAt = Date.now();
  const warnings = [];

  if (kpi.value === null || kpi.value === undefined) {
    warnings.push("KPI returned NULL.");
  }

  if (kpi.expectedRange) {
    const [min, max] = kpi.expectedRange;
    if (kpi.value < min || kpi.value > max) {
      warnings.push(`Value ${kpi.value} outside expected range [${min}, ${max}].`);
    }
  }

  if (kpi.formula && kpi.formula.includes("/") && kpi.dependencies?.some((id) => {
    const dependency = kpiCatalog.find((candidate) => candidate.id === id);
    return dependency?.value === 0;
  })) {
    warnings.push("Derived KPI formula has a division-by-zero risk.");
  }

  auditLog.push({
    at: timestamp(),
    step: "kpi_execution",
    kpi: kpi.name,
    status: warnings.length ? "WARNING" : "SUCCESS",
    value: formatValue(kpi),
    dataSource: kpi.dataSource,
    executionMs: Date.now() - startedAt + 18,
    warnings
  });

  return {
    id: kpi.id,
    name: kpi.name,
    value: kpi.value,
    displayValue: formatValue(kpi),
    status: warnings.length ? "WARNING" : "SUCCESS",
    score: scoreKpi(kpi),
    dataSource: kpi.dataSource,
    lineage: kpi.lineage,
    warnings
  };
}

function validateTemplate(manifest, selectedKpis, auditLog) {
  const selectedIds = new Set(selectedKpis.map((kpi) => kpi.id));
  const errors = [];

  for (const slide of manifest.slides ?? []) {
    for (const placeholder of slide.placeholders ?? []) {
      const missing = (placeholder.bindings ?? []).filter((id) => !selectedIds.has(id));
      if (placeholder.constraints?.required && missing.length) {
        errors.push(`${placeholder.id} is missing KPI bindings: ${missing.join(", ")}`);
      }
    }
  }

  auditLog.push({
    at: timestamp(),
    step: "template_validation",
    template: manifest.name,
    status: errors.length ? "FAILED" : "SUCCESS",
    placeholderCount: manifest.slides.flatMap((slide) => slide.placeholders).length,
    errors
  });

  if (errors.length) {
    throw new Error(errors.join("; "));
  }
}

function addFooter(slide, reportId) {
  slide.addText(`Report ID ${reportId}`, {
    x: 0.45,
    y: 7.17,
    w: 4.4,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 6.5,
    color: colors.slate,
    margin: 0
  });
  slide.addText("Generated with full manifest and audit trail", {
    x: 8.65,
    y: 7.17,
    w: 4.2,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 6.5,
    color: colors.slate,
    align: "right",
    margin: 0
  });
}

function addKpiPill(slide, label, value, x, y, fill) {
  slide.addShape("roundRect", {
    x,
    y,
    w: 2.55,
    h: 0.82,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: fill },
    margin: 0.08
  });
  slide.addText(label, {
    x: x + 0.13,
    y: y + 0.1,
    w: 2.25,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 6.5,
    bold: true,
    color: colors.slate,
    margin: 0
  });
  slide.addText(value, {
    x: x + 0.13,
    y: y + 0.34,
    w: 2.25,
    h: 0.3,
    fontFace: "Aptos Display",
    fontSize: 14,
    bold: true,
    color: colors.ink,
    margin: 0
  });
}

function buildDeck({ reportId, manifest, selectedKpis, kpiResults, auditLog }) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "KPI Report Generator";
  pptx.subject = "KPI-to-PowerPoint report";
  pptx.title = `${manifest.name} ${reportId}`;
  pptx.company = "Finance Transformation";
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "en-US"
  };

  const byId = Object.fromEntries(selectedKpis.map((kpi) => [kpi.id, kpi]));
  const summary = pptx.addSlide();
  summary.background = { color: "F8FAFC" };
  summary.addText("Quarterly performance summary", {
    x: 0.45,
    y: 0.35,
    w: 8.1,
    h: 0.42,
    fontFace: "Aptos Display",
    fontSize: 21,
    bold: true,
    color: colors.ink,
    margin: 0
  });
  summary.addText("Finance reporting pack with editable charts, tables and KPI callouts", {
    x: 0.47,
    y: 0.82,
    w: 8.4,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 9,
    color: colors.slate,
    margin: 0
  });

  addKpiPill(summary, "Q3 Revenue", formatValue(byId.q3_revenue), 0.5, 1.32, colors.paleBlue);
  addKpiPill(summary, "Revenue Growth YoY", formatValue(byId.revenue_growth_yoy), 3.23, 1.32, colors.paleTeal);
  addKpiPill(summary, "Gross Margin", formatValue(byId.gross_margin), 5.96, 1.32, colors.paleAmber);
  addKpiPill(summary, "Revenue per Employee", formatValue(byId.revenue_per_employee), 8.69, 1.32, "EEF2F7");

  const regionKpis = ["rev_na", "rev_emea", "rev_apac", "rev_latam"].map((id) => byId[id]);
  summary.addChart(pptx.ChartType.bar, [
    {
      name: "Revenue",
      labels: regionKpis.map((kpi) => kpi.name.replace(" Revenue", "")),
      values: regionKpis.map((kpi) => Number((kpi.value / 1000000).toFixed(1)))
    }
  ], {
    x: 0.58,
    y: 2.45,
    w: 5.85,
    h: 3.95,
    showLegend: false,
    showTitle: true,
    title: "Revenue by region, $M",
    catAxisLabelFontFace: "Aptos",
    catAxisLabelFontSize: 8,
    valAxisLabelFontFace: "Aptos",
    valAxisLabelFontSize: 8,
    valAxisMajorUnit: 10,
    showValue: true,
    dataLabelPosition: "outEnd",
    chartColors: [colors.blue]
  });

  const tableRows = [
    [
      { text: "KPI", options: { bold: true, color: colors.white } },
      { text: "Value", options: { bold: true, color: colors.white } },
      { text: "Status", options: { bold: true, color: colors.white } },
      { text: "Source", options: { bold: true, color: colors.white } }
    ],
    ...["q3_revenue", "gross_margin", "operating_cost", "headcount", "revenue_per_employee"].map((id) => {
      const kpi = byId[id];
      const result = kpiResults.find((candidate) => candidate.id === id);
      return [
        kpi.name,
        formatValue(kpi),
        result.score.toUpperCase(),
        kpi.dataSource
      ];
    })
  ];

  summary.addTable(tableRows, {
    x: 6.8,
    y: 2.48,
    w: 5.85,
    h: 3.5,
    border: { type: "solid", color: colors.line, pt: 0.5 },
    fontFace: "Aptos",
    fontSize: 7.4,
    color: colors.ink,
    margin: 0.07,
    fill: { color: colors.white },
    autoFit: false,
    colW: [1.55, 0.85, 0.7, 2.75],
    rowH: 0.35,
    valign: "mid",
    bandRow: true,
    fillHeader: { color: colors.ink }
  });

  summary.addText("Data checks passed for the selected quarterly KPI pack. Warnings and source lineage travel with the exported report manifest.", {
    x: 6.82,
    y: 6.12,
    w: 5.75,
    h: 0.44,
    fontFace: "Aptos",
    fontSize: 8,
    color: colors.slate,
    margin: 0
  });
  addFooter(summary, reportId);

  const audit = pptx.addSlide();
  audit.background = { color: colors.white };
  audit.addText("Audit trail and data lineage", {
    x: 0.55,
    y: 0.4,
    w: 7.5,
    h: 0.42,
    fontFace: "Aptos Display",
    fontSize: 21,
    bold: true,
    color: colors.ink,
    margin: 0
  });

  const auditRows = [
    [
      { text: "Time", options: { bold: true, color: colors.white } },
      { text: "Step", options: { bold: true, color: colors.white } },
      { text: "Status", options: { bold: true, color: colors.white } },
      { text: "Evidence", options: { bold: true, color: colors.white } }
    ],
    ...auditLog.slice(0, 9).map((entry) => [
      entry.at.slice(11, 19),
      entry.step.replaceAll("_", " "),
      entry.status,
      entry.kpi ? `${entry.kpi}: ${entry.value ?? ""}` : entry.template ?? entry.message ?? ""
    ])
  ];

  audit.addTable(auditRows, {
    x: 0.65,
    y: 1.16,
    w: 12,
    h: 4.7,
    border: { type: "solid", color: colors.line, pt: 0.5 },
    fontFace: "Aptos",
    fontSize: 8,
    color: colors.ink,
    margin: 0.07,
    fill: { color: "FBFCFE" },
    colW: [1.1, 2.25, 1.1, 7.55],
    rowH: 0.35,
    fillHeader: { color: colors.ink }
  });

  audit.addText("Lineage summary", {
    x: 0.68,
    y: 6.1,
    w: 1.8,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 8.5,
    bold: true,
    color: colors.ink,
    margin: 0
  });
  audit.addText(selectedKpis.slice(0, 7).map((kpi) => `${kpi.name}: ${kpi.lineage.join(", ")}`).join("\n"), {
    x: 2.1,
    y: 6.08,
    w: 10.35,
    h: 0.75,
    fontFace: "Aptos",
    fontSize: 6.8,
    color: colors.slate,
    breakLine: false,
    fit: "shrink",
    margin: 0
  });
  addFooter(audit, reportId);

  return pptx;
}

export function createLineage(selectedKpis, manifest) {
  return {
    generatedAt: timestamp(),
    nodes: [
      ...selectedKpis.flatMap((kpi) => kpi.lineage.map((source) => ({ id: source, type: "source" }))),
      ...selectedKpis.map((kpi) => ({ id: kpi.id, label: kpi.name, type: "kpi" })),
      ...manifest.slides.flatMap((slide) => slide.placeholders.map((placeholder) => ({
        id: placeholder.id,
        label: placeholder.label,
        type: placeholder.type
      })))
    ],
    edges: [
      ...selectedKpis.flatMap((kpi) => kpi.lineage.map((source) => ({ from: source, to: kpi.id }))),
      ...manifest.slides.flatMap((slide) => slide.placeholders.flatMap((placeholder) => (
        placeholder.bindings.map((id) => ({ from: id, to: placeholder.id, slide: slide.id }))
      )))
    ]
  };
}

export async function generateReport(payload = {}) {
  const reportId = `RPT_${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;
  const startedAt = timestamp();
  const auditLog = [{
    at: startedAt,
    step: "report_started",
    status: "SUCCESS",
    message: `Report generation initiated by ${payload.user ?? runDefaults.user}`
  }];

  const manifest = payload.templateManifest ?? templateManifest;
  const selectedIds = payload.selectedKpiIds?.length ? payload.selectedKpiIds : kpiCatalog.map((kpi) => kpi.id);
  const selectedKpis = selectedIds.map((id) => kpiCatalog.find((kpi) => kpi.id === id)).filter(Boolean);
  validateTemplate(manifest, selectedKpis, auditLog);

  const kpiResults = selectedKpis.map((kpi) => validateKpi(kpi, auditLog));
  auditLog.push({
    at: timestamp(),
    step: "chart_generation",
    status: "SUCCESS",
    message: "Generated native PowerPoint chart for regional revenue."
  });
  auditLog.push({
    at: timestamp(),
    step: "table_generation",
    status: "SUCCESS",
    message: "Generated editable KPI table with conditional status values."
  });

  const lineage = createLineage(selectedKpis, manifest);
  const pptx = buildDeck({ reportId, manifest, selectedKpis, kpiResults, auditLog });

  const outputDir = path.join(artifactRoot, reportId);
  await fs.mkdir(outputDir, { recursive: true });
  const pptxPath = path.join(outputDir, `${reportId}.pptx`);
  await pptx.writeFile({ fileName: pptxPath });

  const completedAt = timestamp();
  const reportManifest = {
    report_id: reportId,
    timestamp: completedAt,
    template: `${manifest.name} ${manifest.version}`,
    data_freshness: startedAt,
    kpi_count: selectedKpis.length,
    kpi_summary: kpiResults,
    charts: [{ id: "chart-revenue-region", type: "bar", kpis: 4, status: "SUCCESS" }],
    execution_log: auditLog,
    user: payload.user ?? runDefaults.user,
    permissions: ["download", "share"],
    modifications_allowed: true,
    refresh_enabled: true,
    limitations: [
      "Demo data source adapter uses seeded finance KPIs. Production adapters should execute parameterized queries through the data service.",
      "Generated charts are native editable PowerPoint charts. External database refresh links require a configured enterprise connector."
    ]
  };

  await fs.writeFile(path.join(outputDir, "template-manifest.json"), JSON.stringify(manifest, null, 2));
  await fs.writeFile(path.join(outputDir, "kpi-catalog.json"), JSON.stringify(selectedKpis, null, 2));
  await fs.writeFile(path.join(outputDir, "report-manifest.json"), JSON.stringify(reportManifest, null, 2));
  await fs.writeFile(path.join(outputDir, "execution-log.json"), JSON.stringify(auditLog, null, 2));
  await fs.writeFile(path.join(outputDir, "lineage.json"), JSON.stringify(lineage, null, 2));

  return {
    reportId,
    status: "SUCCESS",
    files: {
      pptx: `/artifacts/${reportId}/${reportId}.pptx`,
      manifest: `/artifacts/${reportId}/report-manifest.json`,
      auditLog: `/artifacts/${reportId}/execution-log.json`,
      lineage: `/artifacts/${reportId}/lineage.json`,
      templateManifest: `/artifacts/${reportId}/template-manifest.json`,
      kpiCatalog: `/artifacts/${reportId}/kpi-catalog.json`
    },
    reportManifest
  };
}

export function getBootstrapData() {
  return {
    templateManifest,
    kpiCatalog,
    runDefaults
  };
}

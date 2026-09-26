import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  FileText,
  Gauge,
  GitBranch,
  LayoutTemplate,
  Loader2,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  Table2
} from "lucide-react";
import "./styles.css";

type PlaceholderType = "text" | "chart" | "table" | "image";

interface Placeholder {
  id: string;
  type: PlaceholderType;
  chartType?: string;
  label: string;
  bindings: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  constraints: Record<string, unknown>;
}

interface TemplateSlide {
  id: string;
  title: string;
  placeholders: Placeholder[];
}

interface TemplateManifest {
  id: string;
  name: string;
  version: string;
  owner: string;
  modifiedBy: string;
  modifiedAt: string;
  slides: TemplateSlide[];
}

interface Kpi {
  id: string;
  name: string;
  description: string;
  owner: string;
  category: string;
  dataSource: string;
  query?: string;
  formula?: string;
  dependencies?: string[];
  aggregation?: string;
  format: { kind: string; currency?: string; notation?: string; decimals?: number };
  value: number;
  previousValue?: number;
  expectedRange?: [number, number];
  lineage: string[];
  thresholds?: Record<string, unknown>;
}

interface BootstrapData {
  templateManifest: TemplateManifest;
  kpiCatalog: Kpi[];
  runDefaults: Record<string, unknown>;
}

interface GeneratedReport {
  reportId: string;
  status: string;
  files: Record<string, string>;
  reportManifest: {
    kpi_count: number;
    execution_log: Array<Record<string, unknown>>;
  };
}

const knownSchema = {
  metrics: ["revenue", "gross margin", "operating cost", "headcount"],
  dimensions: ["region", "quarter", "business unit"],
  filters: ["North America", "EMEA", "APAC", "LATAM"]
};

function formatValue(kpi: Kpi) {
  const decimals = kpi.format.decimals ?? 0;
  if (kpi.format.kind === "percent") return `${(kpi.value * 100).toFixed(decimals)}%`;
  if (kpi.format.kind === "currency") {
    const divisor = kpi.format.notation === "millions" ? 1_000_000 : kpi.format.notation === "thousands" ? 1_000 : 1;
    const suffix = kpi.format.notation === "millions" ? "M" : kpi.format.notation === "thousands" ? "K" : "";
    return `$${(kpi.value / divisor).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })}${suffix}`;
  }
  return kpi.value.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });
}

function inferIntent(text: string) {
  const normalized = text.toLowerCase();
  const metric = knownSchema.metrics.find((item) => normalized.includes(item));
  const dimension = knownSchema.dimensions.find((item) => normalized.includes(item));
  const unknownLocation = /\b(chicago|berlin|tokyo|london)\b/i.exec(text)?.[1];

  return {
    metric,
    dimension,
    comparison: normalized.includes("year-over-year") || normalized.includes("yoy") ? "YoY" : normalized.includes("q2") ? "Q2 comparison" : "None",
    status: metric && !unknownLocation ? "ready" : "needs_clarification",
    reason: !metric
      ? "No known metric matched the connected schema."
      : unknownLocation
        ? `${unknownLocation} is not available in the approved filter catalog.`
        : "Mapped to approved schema elements."
  };
}

function App() {
  const [data, setData] = React.useState<BootstrapData | null>(null);
  const [selectedPlaceholder, setSelectedPlaceholder] = React.useState<string | null>(null);
  const [selectedKpiIds, setSelectedKpiIds] = React.useState<string[]>([]);
  const [intentText, setIntentText] = React.useState("Show Q3 revenue compared to Q2 by region");
  const [isGenerating, setGenerating] = React.useState(false);
  const [report, setReport] = React.useState<GeneratedReport | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/bootstrap")
      .then((res) => res.json())
      .then((payload: BootstrapData) => {
        setData(payload);
        setSelectedKpiIds(payload.kpiCatalog.map((kpi) => kpi.id));
        setSelectedPlaceholder(payload.templateManifest.slides[0]?.placeholders[0]?.id ?? null);
      })
      .catch(() => setError("The local report service is not running."));
  }, []);

  if (!data) {
    return (
      <main className="boot">
        <Loader2 className="spin" size={28} />
        <p>Loading the report workspace</p>
      </main>
    );
  }

  const slide = data.templateManifest.slides[0];
  const selected = slide.placeholders.find((placeholder) => placeholder.id === selectedPlaceholder) ?? slide.placeholders[0];
  const intent = inferIntent(intentText);
  const selectedKpis = data.kpiCatalog.filter((kpi) => selectedKpiIds.includes(kpi.id));

  function addPlaceholder(type: PlaceholderType) {
    if (!data) return;
    const next: Placeholder = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      label: `${type[0].toUpperCase()}${type.slice(1)} placeholder`,
      bindings: selectedKpiIds.slice(0, type === "chart" ? 4 : 2),
      x: 10 + slide.placeholders.length * 3,
      y: 12 + slide.placeholders.length * 4,
      w: type === "text" ? 26 : 36,
      h: type === "text" ? 14 : 26,
      constraints: { required: false, maxDataPoints: type === "chart" ? 5000 : undefined }
    };
    setData({
      ...data,
      templateManifest: {
        ...data.templateManifest,
        slides: [{
          ...slide,
          placeholders: [...slide.placeholders, next]
        }]
      }
    });
    setSelectedPlaceholder(next.id);
  }

  function updatePlaceholder(patch: Partial<Placeholder>) {
    if (!data || !selected) return;
    setData({
      ...data,
      templateManifest: {
        ...data.templateManifest,
        modifiedAt: new Date().toISOString(),
        slides: [{
          ...slide,
          placeholders: slide.placeholders.map((placeholder) => (
            placeholder.id === selected.id ? { ...placeholder, ...patch } : placeholder
          ))
        }]
      }
    });
  }

  function toggleKpi(id: string) {
    setSelectedKpiIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  }

  async function generateReport() {
    if (!data) return;
    setGenerating(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: "alice@company.com",
          templateManifest: data.templateManifest,
          selectedKpiIds
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Report generation failed.");
      setReport(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Report generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Gauge size={21} /></div>
          <div>
            <h1>KPI Report Studio</h1>
            <p>Editable PowerPoint automation</p>
          </div>
        </div>
        <nav>
          <a href="#template"><LayoutTemplate size={17} /> Template</a>
          <a href="#kpis"><Database size={17} /> KPI catalog</a>
          <a href="#guardrails"><ShieldCheck size={17} /> Guardrails</a>
          <a href="#generate"><Play size={17} /> Generate</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Finance report generation engine</p>
            <h2>{data.templateManifest.name}</h2>
          </div>
          <div className="status-strip">
            <span><CheckCircle2 size={16} /> {selectedKpis.length} KPIs selected</span>
            <span><FileJson size={16} /> Manifest v{data.templateManifest.version}</span>
          </div>
        </header>

        <section className="grid-two" id="template">
          <div className="panel canvas-panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">Subsystem A</p>
                <h3>Template canvas</h3>
              </div>
              <div className="tool-row">
                <button onClick={() => addPlaceholder("chart")}><Plus size={16} /> Chart</button>
                <button onClick={() => addPlaceholder("table")}><Plus size={16} /> Table</button>
                <button onClick={() => addPlaceholder("text")}><Plus size={16} /> Text</button>
              </div>
            </div>
            <div className="slide-canvas" aria-label="Template builder canvas">
              <div className="slide-title">{slide.title}</div>
              {slide.placeholders.map((placeholder) => (
                <button
                  key={placeholder.id}
                  className={`placeholder ${placeholder.type} ${placeholder.id === selected.id ? "active" : ""}`}
                  style={{
                    left: `${placeholder.x}%`,
                    top: `${placeholder.y}%`,
                    width: `${placeholder.w}%`,
                    height: `${placeholder.h}%`
                  }}
                  onClick={() => setSelectedPlaceholder(placeholder.id)}
                >
                  {placeholder.type === "chart" && <Boxes size={16} />}
                  {placeholder.type === "table" && <Table2 size={16} />}
                  {placeholder.type === "text" && <FileText size={16} />}
                  <span>{placeholder.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel inspector">
            <div className="panel-title">
              <div>
                <p className="eyebrow">Manifest source of truth</p>
                <h3>Placeholder rules</h3>
              </div>
            </div>
            <label>
              Placeholder ID
              <input value={selected.id} onChange={(event) => updatePlaceholder({ id: event.target.value })} />
            </label>
            <label>
              Label
              <input value={selected.label} onChange={(event) => updatePlaceholder({ label: event.target.value })} />
            </label>
            <label>
              Type
              <select value={selected.type} onChange={(event) => updatePlaceholder({ type: event.target.value as PlaceholderType })}>
                <option value="chart">Chart</option>
                <option value="table">Table</option>
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </label>
            <label>
              KPI bindings
              <select
                multiple
                value={selected.bindings}
                onChange={(event) => updatePlaceholder({
                  bindings: Array.from(event.currentTarget.selectedOptions).map((option) => option.value)
                })}
              >
                {data.kpiCatalog.map((kpi) => <option key={kpi.id} value={kpi.id}>{kpi.name}</option>)}
              </select>
            </label>
            <div className="dimension-grid">
              {(["x", "y", "w", "h"] as const).map((key) => (
                <label key={key}>
                  {key.toUpperCase()}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selected[key]}
                    onChange={(event) => updatePlaceholder({ [key]: Number(event.target.value) })}
                  />
                </label>
              ))}
            </div>
            <pre>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        </section>

        <section className="grid-two" id="kpis">
          <div className="panel">
            <div className="panel-title">
              <div>
                <p className="eyebrow">Subsystem B</p>
                <h3>KPI catalog</h3>
              </div>
              <span className="badge">{selectedKpis.length} active</span>
            </div>
            <div className="kpi-list">
              {data.kpiCatalog.map((kpi) => (
                <label className="kpi-row" key={kpi.id}>
                  <input type="checkbox" checked={selectedKpiIds.includes(kpi.id)} onChange={() => toggleKpi(kpi.id)} />
                  <div>
                    <strong>{kpi.name}</strong>
                    <span>{kpi.category} · {kpi.owner}</span>
                  </div>
                  <b>{formatValue(kpi)}</b>
                </label>
              ))}
            </div>
          </div>

          <div className="panel" id="guardrails">
            <div className="panel-title">
              <div>
                <p className="eyebrow">LLM guardrail demo</p>
                <h3>Natural language to structured config</h3>
              </div>
              <Sparkles size={19} />
            </div>
            <label>
              User intent
              <textarea value={intentText} onChange={(event) => setIntentText(event.target.value)} />
            </label>
            <div className={`intent-box ${intent.status}`}>
              {intent.status === "ready" ? <CheckCircle2 size={19} /> : <AlertTriangle size={19} />}
              <div>
                <strong>{intent.status === "ready" ? "Ready for user confirmation" : "Needs clarification"}</strong>
                <p>{intent.reason}</p>
              </div>
            </div>
            <div className="structured-form">
              <label>
                Metric
                <input value={intent.metric ?? "Unmapped"} readOnly />
              </label>
              <label>
                Dimension
                <input value={intent.dimension ?? "None"} readOnly />
              </label>
              <label>
                Comparison
                <input value={intent.comparison} readOnly />
              </label>
            </div>
          </div>
        </section>

        <section className="panel generate-panel" id="generate">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Subsystem C</p>
              <h3>Report generation run</h3>
            </div>
            <button className="primary" onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="spin" size={17} /> : <Play size={17} />}
              Generate PowerPoint
            </button>
          </div>
          <div className="run-grid">
            <div>
              <h4>Pre-flight checks</h4>
              <ul>
                <li><CheckCircle2 size={16} /> Template manifest has {slide.placeholders.length} placeholders</li>
                <li><CheckCircle2 size={16} /> KPI set includes {selectedKpis.length} definitions</li>
                <li><CheckCircle2 size={16} /> Data freshness policy: 24 hours</li>
                <li><CheckCircle2 size={16} /> Audit trail and lineage exports enabled</li>
              </ul>
            </div>
            <div>
              <h4>Output package</h4>
              {error && <div className="error-box">{error}</div>}
              {!report && !error && <p className="muted">Run the generator to create an editable PPTX plus documentation artifacts.</p>}
              {report && (
                <div className="download-list">
                  <a href={report.files.pptx}><Download size={16} /> PowerPoint deck</a>
                  <a href={report.files.manifest}><FileJson size={16} /> Report manifest</a>
                  <a href={report.files.auditLog}><FileText size={16} /> Execution log</a>
                  <a href={report.files.lineage}><GitBranch size={16} /> Data lineage</a>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export const templateManifest = {
  id: "tpl-finance-quarterly-v1",
  name: "Quarterly Finance Board Pack",
  version: "1.0.0",
  owner: "Finance Transformation",
  modifiedBy: "demo.user@company.com",
  modifiedAt: "2026-09-24T09:00:00Z",
  slides: [
    {
      id: "slide-exec-summary",
      title: "Quarterly performance summary",
      placeholders: [
        {
          id: "headline-revenue",
          type: "text",
          label: "Revenue headline",
          bindings: ["q3_revenue", "revenue_growth_yoy"],
          x: 6,
          y: 7,
          w: 36,
          h: 18,
          constraints: { minW: 22, minH: 10, maxKpis: 2 }
        },
        {
          id: "chart-revenue-region",
          type: "chart",
          chartType: "bar",
          label: "Revenue by region",
          bindings: ["rev_na", "rev_emea", "rev_apac", "rev_latam"],
          x: 45,
          y: 12,
          w: 46,
          h: 38,
          constraints: { maxDataPoints: 5000, required: true }
        },
        {
          id: "table-core-kpis",
          type: "table",
          label: "Core KPI table",
          bindings: ["q3_revenue", "gross_margin", "operating_cost", "headcount", "revenue_per_employee"],
          x: 6,
          y: 52,
          w: 85,
          h: 35,
          constraints: { maxRows: 20, required: true }
        }
      ]
    }
  ]
};

export const kpiCatalog = [
  {
    id: "q3_revenue",
    name: "Q3 Revenue",
    description: "Total recognized revenue for the current quarter.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    query: "SELECT SUM(revenue) AS revenue FROM finance_dw.sales_fact WHERE fiscal_quarter = :quarter",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 125400000,
    previousValue: 112900000,
    expectedRange: [100000000, 150000000],
    lineage: ["finance_dw.sales_fact.revenue", "calendar_dim.fiscal_quarter"],
    thresholds: { green: 120000000, yellow: 105000000 }
  },
  {
    id: "revenue_growth_yoy",
    name: "Revenue Growth YoY",
    description: "Year-over-year revenue growth for the quarter.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "DERIVED",
    formula: "(q3_revenue - q3_revenue_py) / q3_revenue_py",
    dependencies: ["q3_revenue", "q3_revenue_py"],
    format: { kind: "percent", decimals: 1 },
    value: 0.111,
    expectedRange: [-0.2, 0.35],
    lineage: ["q3_revenue", "q3_revenue_py"],
    thresholds: { green: 0.08, yellow: 0.02 }
  },
  {
    id: "q3_revenue_py",
    name: "Q3 Revenue Prior Year",
    description: "Total recognized revenue for the same quarter in the prior fiscal year.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    query: "SELECT SUM(revenue) AS revenue FROM finance_dw.sales_fact WHERE fiscal_quarter = :prior_year_quarter",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 112900000,
    expectedRange: [85000000, 130000000],
    lineage: ["finance_dw.sales_fact.revenue", "calendar_dim.fiscal_quarter"]
  },
  {
    id: "gross_margin",
    name: "Gross Margin",
    description: "Revenue less cost of goods sold, divided by revenue.",
    owner: "FP&A",
    category: "Margin",
    dataSource: "DERIVED",
    formula: "(q3_revenue - cogs) / q3_revenue",
    dependencies: ["q3_revenue", "cogs"],
    format: { kind: "percent", decimals: 1 },
    value: 0.424,
    expectedRange: [0.3, 0.55],
    lineage: ["q3_revenue", "cogs"],
    thresholds: { green: 0.4, yellow: 0.35 }
  },
  {
    id: "cogs",
    name: "Cost of Goods Sold",
    description: "Direct costs associated with quarterly revenue.",
    owner: "FP&A",
    category: "Cost",
    dataSource: "finance_dw.cost_fact",
    query: "SELECT SUM(cogs) AS cogs FROM finance_dw.cost_fact WHERE fiscal_quarter = :quarter",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 72230000,
    expectedRange: [60000000, 85000000],
    lineage: ["finance_dw.cost_fact.cogs"]
  },
  {
    id: "operating_cost",
    name: "Operating Cost",
    description: "Quarterly operating expenses excluding direct costs.",
    owner: "FP&A",
    category: "Cost",
    dataSource: "finance_dw.opex_fact",
    query: "SELECT SUM(opex) AS operating_cost FROM finance_dw.opex_fact WHERE fiscal_quarter = :quarter",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 31450000,
    expectedRange: [25000000, 38000000],
    lineage: ["finance_dw.opex_fact.opex"],
    thresholds: { green: 28000000, yellow: 33000000, lowerIsBetter: true }
  },
  {
    id: "headcount",
    name: "Headcount",
    description: "Active employees at quarter end.",
    owner: "People Analytics",
    category: "Workforce",
    dataSource: "hr_dw.employee_snapshot",
    query: "SELECT COUNT(*) AS headcount FROM hr_dw.employee_snapshot WHERE snapshot_date = :quarter_end",
    aggregation: "COUNT",
    format: { kind: "number", decimals: 0 },
    value: 512,
    expectedRange: [450, 575],
    lineage: ["hr_dw.employee_snapshot.employee_id"]
  },
  {
    id: "revenue_per_employee",
    name: "Revenue per Employee",
    description: "Quarterly revenue divided by active employees.",
    owner: "FP&A",
    category: "Productivity",
    dataSource: "DERIVED",
    formula: "q3_revenue / headcount",
    dependencies: ["q3_revenue", "headcount"],
    format: { kind: "currency", currency: "USD", notation: "thousands", decimals: 0 },
    value: 244922,
    expectedRange: [180000, 290000],
    lineage: ["q3_revenue", "headcount"],
    thresholds: { green: 230000, yellow: 200000 }
  },
  {
    id: "rev_na",
    name: "North America Revenue",
    description: "Q3 revenue in North America.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 52600000,
    expectedRange: [40000000, 65000000],
    lineage: ["finance_dw.sales_fact.region", "finance_dw.sales_fact.revenue"]
  },
  {
    id: "rev_emea",
    name: "EMEA Revenue",
    description: "Q3 revenue in EMEA.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 38400000,
    expectedRange: [30000000, 48000000],
    lineage: ["finance_dw.sales_fact.region", "finance_dw.sales_fact.revenue"]
  },
  {
    id: "rev_apac",
    name: "APAC Revenue",
    description: "Q3 revenue in APAC.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 22900000,
    expectedRange: [15000000, 30000000],
    lineage: ["finance_dw.sales_fact.region", "finance_dw.sales_fact.revenue"]
  },
  {
    id: "rev_latam",
    name: "LATAM Revenue",
    description: "Q3 revenue in LATAM.",
    owner: "Revenue Operations",
    category: "Revenue",
    dataSource: "finance_dw.sales_fact",
    aggregation: "SUM",
    format: { kind: "currency", currency: "USD", notation: "millions", decimals: 1 },
    value: 11500000,
    expectedRange: [8000000, 16000000],
    lineage: ["finance_dw.sales_fact.region", "finance_dw.sales_fact.revenue"]
  }
];

export const runDefaults = {
  user: "alice@company.com",
  templateId: templateManifest.id,
  kpiSetId: "q3-standard-finance-pack",
  freshnessHours: 24,
  failOnValidationError: true,
  distribution: "download"
};

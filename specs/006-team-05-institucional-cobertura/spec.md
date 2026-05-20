# Feature Specification: TEAM-05 - Análisis Institucional y Estrategias de Cobertura

**Feature Branch**: `006-team-05-institucional-cobertura`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: TEAM-05 plan, tasks canon, platform standards, existing data sources (platform ingestion store, historical archive), coverage strategy drafts

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Institutional Flow Explorer (Priority: P1)

Un analista de inversiones necesita explorar flujos institucionales, exposiciones agregadas y posiciones relevantes para identificar señales que puedan requerir cobertura o ajuste de posiciones.

**Why this priority**: Provee valor inmediato al permitir detectar riesgos y oportunidades derivadas del comportamiento institucional; priorizará alertas y acciones preventivas.  

**Independent Test**: Con una cuenta de analista y dataset de prueba, el usuario filtra por ticker/sector/periodo y confirma que la vista muestra: (a) volumen institucional, (b) cambios netos de posición, (c) indicadores de concentración.  

**Acceptance Scenarios**:

1. **Given** datos institucionales cargados, **When** el analista selecciona un ticker y rango, **Then** la UI muestra flujos agregados y una recomendación de cobertura inicial (ver estrategia y justificantes).
2. **Given** un objeto de alerta (threshold superado), **When** se abre la alerta, **Then** la página enlaza a la simulación de cobertura y al histórico de P&L hipotético.

---

### User Story 2 - Strategy Suggestion & Backtest (Priority: P1)

Un gestor de portafolio solicita opciones de cobertura sugeridas (protective put, collar, covered straddle, married put) y puede ejecutar un backtest sobre periodos históricos.

**Why this priority**: Permite convertir insight en acción prototipada y evaluar impactos en P&L antes de ejecutar órdenes.

**Independent Test**: El gestor selecciona un ticker y ventana histórica; el sistema devuelve 3 estrategias sugeridas con métricas comparativas (max drawdown, cost, P&L simulado).

**Acceptance Scenarios**:

1. **Given** datos históricos y de precios, **When** se solicita backtest de una estrategia, **Then** el sistema entrega un reporte con métricas y gráfico de P&L.

---

### User Story 3 - Risk Manager Approval Flow (Priority: P2)

Un risk manager revisa propuestas de cobertura, ajusta parámetros (notional, strike selection, fechas) y aprueba/rechaza la ejecución con comentarios.

**Why this priority**: Control operativo y cumplimiento antes de ejecutar coberturas en cuentas institucionales.  

**Independent Test**: Crear una propuesta de cobertura, enviar a revisión y confirmar que el risk manager puede aprobarla con comentarios; el estatus cambia y la propuesta queda registrada.

**Acceptance Scenarios**:

1. **Given** una propuesta pendiente, **When** el risk manager aprueba, **Then** la propuesta pasa a estado `Aprobada` y se notifica al gestor.

---

### Edge Cases

- Si faltan series históricas completas para el backtest, el sistema debe indicar insuficiencia y ofrecer el modo "partial backtest" con advertencias.  
- En presencia de spreads/estrategias multi-leg con líquidez insuficiente, mostrar costo estimado y advertir sobre ejecuciones fuera de mercado.  
- Si datos institucionales contienen duplicados o posiciones inconsistentes entre fuentes, indicar conflicto y mostrar fuente priorizada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST ingest and normalize institutional flow data from configured sources (platform ingestion pipelines and archival store).
- **FR-002**: System MUST provide a browsable UI to filter institutional flows by ticker, sector, timeframe, and account segment.
- **FR-003**: System MUST compute suggested coverage strategies (protective put, collar, married put, covered straddle, iron condor) with cost and P&L simulation.
- **FR-004**: System MUST run historical backtests for suggested strategies over selectable windows and return standardized metrics (cum. P&L, max drawdown, cost, ROI).
- **FR-005**: System MUST store proposals, approval status, and audit trail (who suggested, who approved, timestamps, parameters).
- **FR-006**: System MUST expose programmatic access for retrieval of suggested strategies and reports for integration with automation workflows.
- **FR-007**: System MUST flag data quality issues and surface provenance (source, ingestion time) in the UI.
- **FR-008**: System MUST respect role-based access: Analyst, PM, Risk, Auditor; only authorized roles may approve/execute proposals.
- **FR-009**: System MUST export coverage reports in PDF and CSV for record-keeping and compliance.

### Key Entities *(include if feature involves data)*

- **InstitutionalFlow**: { ticker, date, volume, direction, source, accountSegment, confidenceScore }
- **CoverageProposal**: { id, ticker, strategyType, legs[], notional, strikes, expiries, costEstimate, simulatedMetrics, status, createdBy, approvedBy }
- **BacktestReport**: { proposalId, periodStart, periodEnd, cumulativePnL, maxDrawdown, tradeCount, liquidityFlags }

## Experience & Component Contract *(required for UI-heavy features)*

### Target UX

- **Reference Experience**: Dashboard-first analytics workspace (desktop-first) with a detail panel for backtests and a strategy builder modal.  
- **Primary User Workspace**: Split view - left: filters and list of tickers/alerts; right: details (flows, suggested strategies, backtest charts, approval actions).

### Control-by-Field Contract

- **Ticker Selector**: Combobox with typeahead; Data Source: instruments catalog; Behavior: on select, load flows and cached backtest summary.
- **Time Range**: Date range picker; Behavior: updates flows and backtest horizon.
- **Strategy Builder**: Modal with fields for strategy type, notional, strike selection (auto / manual), expiry; Behavior: preview cost and simulated metrics before saving.

### Runtime Modes & Source Selection

- **Mode Online**: Real-time flows from the configured ingestion pipeline; backtests use the historical price archive.
- **Mode Demo**: Uses seeded sample datasets and synthetic liquidity levels for safe experimentation.

## Dynamic Schema & Configurability

- **Config Registry**: `platform.configs.coverage` (role-driven presets and available strategy catalog).
- **Evolvability Rule**: Add new strategy types by registering into the strategy catalog and mapping to evaluation handlers; UI reads catalog dynamically.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Analysts can identify top-5 institutional flow movers for a selected universe in under 30s (measured with production-sized dataset).
- **SC-002**: Suggested strategies for a given ticker return a backtest report with metrics computed within 60s for a 5-year window (on standard infra profile).
- **SC-003**: 95% of CoverageProposal lifecycle actions (create, submit, approve) must be auditable with full metadata retained for 2 years.
- **SC-004**: Risk approval turnaround (time from submission to decision) should be under 24 hours for >90% of cases in normal operations.

## Assumptions

- Target users are institutional analysts, PMs and risk managers with access to the platform and role-assigned permissions.
- Existing authentication and RBAC systems will be reused; no new auth mechanism is introduced.
- Primary data source for institutional flows is the platform ingestion pipeline; a historical archive is available for backtests.
 - Execution (order routing) is out of scope for v1 — the feature provides proposals and exportable orders, not live execution.
 - Any proposed execution (including stop-loss or close requests) MUST require explicit human approval from the `Risk` role before any order is routed to brokers. This feature will NOT perform automatic order execution or automatic stop-loss actions in v1; the system only generates suggested actions and approval requests.

## Coverage Report (feature-level)

This report summarizes the functional coverage delivered by this spec and identifies gaps vs. the platform's transversal standards.

- Coverage of strategy types: protective put, collar, married put, covered straddle, iron condor (design-level included); implementation required for multi-leg pricing and liquidity checks.
- Data coverage: ingestion pipelines defined for the platform ingestion store; historical price coverage requires validation for thinly-traded tickers.
- Compliance & audit: proposal audit trail specified; PDF/CSV export included to meet record-keeping needs.
- Gaps / Risks:
  - Multi-leg execution constraints and broker integration are out of scope — this may affect feasibility of some strategies in live trading.
  - Market liquidity modeling (slippage, implied volatility surface shifts) will require specialized models not covered here; v1 will use simplified assumptions with warnings.

## Next Steps / Handoff

1. Define ingestion schema and mapping for InstitutionalFlow in backend (ingestion pipeline).  
2. Implement strategy evaluation handlers in backend modules/strategies/coverage with unit tests.  
3. UI: build dashboard and strategy builder workspace; connect to backend services.  
4. Add auditing and export capabilities; integrate role checks in the approval flow.

---

Spec created by: TEAM-05 (draft)

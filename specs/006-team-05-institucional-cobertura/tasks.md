---

description: "Task list for TEAM-05 institutional and coverage slice"

---

# Tasks: 006-team-05-institucional-cobertura

**Input**: TEAM-05 plan.md + spec.md + backlog canonico (.drfic/diana-sdk/.../TEAM-05/tasks.md)
**Prerequisites**: plan.md (required), spec.md (required)
**Tests**: Requeridos por RNF-006 (unit e integration, >=80% en rutas criticas)

**Organizacion**: Tareas agrupadas por historia de usuario para ejecucion y validacion independientes.

## Formato: `[ID] [P?] [Story] Descripcion`

- **[P]**: Se puede ejecutar en paralelo (archivos distintos, sin dependencias)
- **[Story]**: Historia de usuario (US1, US2, US3)
- Incluir rutas de archivo exactas

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparacion de estructura base para modulo institucional y cobertura

- [ ] T187 [P] Crear barrels/exports base en backend/src/modules/institutional/index.ts y backend/src/modules/strategies/coverage/index.ts
- [ ] T188 Registrar rutas base institucionales y de cobertura en backend/src/routes/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cumplimiento y observabilidad transversal requeridos por todas las historias

- [x] T030 [P] [US2] Adaptador Alpaca en backend/src/modules/brokers/alpacaAdapter.ts
- [x] T054 Reporte de cobertura MFA en backend/src/observability/mfaCoverageReport.ts
- [ ] T189 [P] Implementar auditoria de eventos institucionales/cobertura en backend/src/observability/institutionalCoverageAudit.ts
 - [ ] T190 Implementar job de retencion 730 dias (2 años) para eventos institucionales/cobertura en backend/src/jobs/retention/institutionalCoverageRetention.ts con pruebas de validacion
- [ ] T191 [P] Definir tipos compartidos de outputs institucionales/cobertura en backend/src/types/institutional.ts y backend/src/types/coverage.ts

**Checkpoint**: Fundacion lista - se habilita trabajo por historias

---

## Phase 3: User Story 1 - Contexto institucional y lectura operativa (Priority: P1) MVP

**Goal**: Producir contexto institucional util, trazable y consumible por otros equipos

**Independent Test**: Ejecutar endpoints institucionales y validar zonas/tendencias/posicionamiento con trazabilidad

### Tests para User Story 1

- [ ] T184 [P] [US1] Tests unitarios para institutionalZonesEngine, institutionalTrendEngine y expirationAnalysisEngine en tests/unit/institutional/
- [ ] T186 [P] [US1] Tests de integracion para routes/institutional/institutionalAnalysis y routes/institutional/regulatoryPositions en tests/integration/institutional/

### Implementacion para User Story 1

- [ ] T106 [US1] Definir contrato de parametros para analisis institucional en backend/src/modules/institutional/institutionalContract.ts incluyendo instrumento/ticker, strike, periodos (intradiario/diario/mensual/trimestral), volumen, liquidez, plazo (corto/mediano/largo), porcentaje en manos de fondos, flujos de entrada/salida y posiciones abiertas
- [ ] T107 [US1] Implementar servicio de integracion con fuentes externas institucionales en backend/src/modules/institutional/institutionalDataService.ts consumiendo SEC EDGAR 13F filings, FINRA short interest, Unusual Whales, Finviz institutional y alternativas gratuitas/de paga configurables, con normalizacion de respuesta, cache, fallback y manejo de rate limits
- [ ] T108 [P] [US1] Implementar motor de zonas institucionales en backend/src/modules/institutional/institutionalZonesEngine.ts para identificar soportes y resistencias donde fondos acumulan o distribuyen usando volumen institucional, analisis de velas OHLC y filtros de alta liquidez
- [ ] T109 [P] [US1] Implementar motor de tendencias institucionales en backend/src/modules/institutional/institutionalTrendEngine.ts con MAs de 50 y 200 dias, deteccion de cruces, correlacion entre reportes trimestrales y volumen diario creciente, y calculo de probabilidad de continuidad de tendencia
- [ ] T110 [P] [US1] Implementar motor de analisis de vencimientos en backend/src/modules/institutional/expirationAnalysisEngine.ts que detecta fechas clave de opciones y futuros (mensual/trimestral) donde los institucionales ajustan posiciones y evalua impacto esperado en precio del subyacente
- [ ] T111 [US1] Implementar API de analisis institucional en backend/src/routes/institutional/institutionalAnalysis.ts retornando zonas S/R institucionales, tendencias MAs largas, cruce de periodos y metricas de posicionamiento como overlay para grafico de velas
- [ ] T112 [US1] Implementar API de posiciones y reportes regulatorios en backend/src/routes/institutional/regulatoryPositions.ts retornando posiciones abiertas de fondos, flujos y datos 13F para visualizacion en modal/panel de interfaz

**Checkpoint**: Contexto institucional funcional y validable de forma independiente

---

## Phase 4: User Story 2 - Estrategias de cobertura y simulacion (Priority: P2)

**Goal**: Modelar, simular y comparar estrategias de cobertura con riesgos trazables

**Independent Test**: Ejecutar simulaciones y comparar estrategias con salidas consistentes y auditables

### Tests para User Story 2

- [ ] T185 [P] [US2] Tests unitarios para protectivePutEngine, collarEngine, coveredStraddleEngine y coverageComparator en tests/unit/strategies/coverage/
- [ ] T193 [P] [US2] Tests de integracion para rutas de cobertura en tests/integration/strategies/coverage/

### Implementacion para User Story 2

- [ ] T113 [US2] Definir contrato base de estrategias de cobertura en backend/src/modules/strategies/coverage/coverageStrategyContract.ts con interfaz unificada de inputs (ticker, cantidad de acciones, strikes, fechas de vencimiento, primas, capital, tolerancia al riesgo) y validacion de consistencia
 - [ ] T114 [US2] Implementar core de Protective Put / Married Put en backend/src/modules/strategies/coverage/protectivePutEngine.ts con calculo de proteccion maxima (strike – precio actual), simulacion de escenarios de caida del subyacente, analisis costo-beneficio de cobertura y alertas configurables (incluyendo niveles de stop-loss recomendados). No ejecutar órdenes automáticamente; generar propuestas para aprobación.
 - [ ] T115 [US2] Implementar core de Collar Put en backend/src/modules/strategies/coverage/collarEngine.ts con simulacion de rango de proteccion (put) y techo de ganancia (call), calculo de costo neto (prima put – prima call), proyeccion de payoff en tiempo real y alertas de stop-loss configurables. No ejecutar órdenes automáticamente; generar propuestas para aprobación.
 - [ ] T116 [US2] Implementar core de Covered Straddle en backend/src/modules/strategies/coverage/coveredStraddleEngine.ts con calculo de ingresos por primas vendidas, simulacion de escenarios de alta volatilidad y riesgo ilimitado, cuantificacion de perdidas potenciales en movimientos fuertes, alertas de margen y niveles de stop-loss recomendados. No ejecutar órdenes automáticamente; generar propuestas para aprobación.
- [ ] T117 [US2] Implementar motor de simulacion avanzada en backend/src/modules/strategies/coverage/coverageSimulationEngine.ts con Monte Carlo, escenarios deterministas (subida/bajada %), backtesting con datos historicos de Supabase y proyeccion de payoff en tiempo real para las tres estrategias de cobertura
 - [ ] T118 [US2] Implementar servicio de alertas y gestion de riesgos en backend/src/modules/strategies/coverage/coverageRiskService.ts que calcule niveles de alerta y stop-loss recomendados, registre propuestas de cierre y notifique a los usuarios/roles pertinentes. Cualquier solicitud de ejecución (cierre/stop) debe generar una propuesta registrada y requerir aprobación explícita del `Risk` role; NO debe ejecutar órdenes via broker automáticamente.
- [ ] T119 [US2] Implementar modulo de reporting de cobertura en backend/src/modules/strategies/coverage/coverageReportService.ts con resumen de resultados esperados por estrategia, estadisticas de riesgo/beneficio, logs de simulacion y ejecucion y reportes exportables
- [ ] T120 [US2] Implementar comparador de estrategias de cobertura en backend/src/modules/strategies/coverage/coverageComparator.ts que evalua Protective Put, Collar Put y Covered Straddle segun P&L esperado, costo neto, nivel de riesgo y contexto multi-core para recomendar la estrategia mas adecuada
- [ ] T192 [US2] Implementar API de estrategias de cobertura en backend/src/routes/strategies/coverage/coverageStrategies.ts exponiendo simulacion, comparador y reportes

**Checkpoint**: Estrategias de cobertura operativas y verificables de forma independiente

---

## Phase 5: User Story 3 - Risk Manager Approval Flow (Priority: P2)

**Goal**: Asegurar que todas las propuestas de cobertura, cierres y ejecuciones recomendadas requieran aprobación humana y queden auditadas.

**Independent Test**: Crear una propuesta de cobertura, enviar a revisión, aprobar/rechazar como `Risk` y verificar estado, notificaciones y auditoria.

### Tests para User Story 3

 - [ ] T195 [P] [US3] Tests de integracion para el flujo de aprobacion en tests/integration/approval/coverageApproval.test.ts

### Implementacion para User Story 3

 - [ ] T121 [US3] Implementar workflow de aprobacion de propuestas en backend/src/modules/approvals/coverageApprovalService.ts con estados (Pending, Approved, Rejected), comentarios y metadatos inmutables
 - [ ] T194 [US3] Implementar API de aprobacion en backend/src/routes/approvals/coverageApprovals.ts con validacion RBAC (solo `Risk` puede aprobar) y hooks de notificacion
 - [ ] T196 [US3] Implementar UI de panel de aprobacion en projects/pwa/inversions_app/src/features/coverage/ApprovalPanel.tsx mostrando propuestas pendientes, historial y detalles; incluir comentarios y acciones de aprobar/rechazar

**Checkpoint**: Flujo de aprobacion operativo y auditado

## Phase 5.1: Chat IA (separado, Priority: P3)

**Goal**: Chat IA explicativo debe ser un feature separado que use outputs aprobados y datos de solo-lectura; no debe controlar ejecuciones.

 - [ ] T197 [P] [US3.1] Crear feature separado `institutional-copilot` para chat IA explicativo y mover implementacion a otro spec/feature

## Phase X: Tasks añadidas para cobertura y cumplimiento

 - [ ] T198 [US2] Implementar motor `ironCondorEngine` en backend/src/modules/strategies/coverage/ironCondorEngine.ts con pricing multi-leg, liquidez checks y simulacion de P&L
 - [ ] T199 [US2] Tests unitarios para `ironCondorEngine` en tests/unit/strategies/coverage/ironCondor.test.ts
 - [ ] T200 [US1] Implementar UI filtrable avanzado (ticker/sector/periodo/segmento) en projects/pwa/inversions_app/src/features/dashboard/InstitutionalFilters.tsx
 - [ ] T201 [US1] Implementar panel de provenance/data-quality en UI y API en backend/src/routes/institutional/provenance.ts y projects/pwa/inversions_app/src/features/coverage/ProvenancePanel.tsx
 - [ ] T202 [US3] Implementar enforcement RBAC para aprobaciones en backend/src/middleware/roleAuth.ts y pruebas de integracion
 - [ ] T203 [US3] Implementar export PDF/CSV en backend/src/modules/export/coverageExportService.ts y UI hooks
 - [ ] T204 [SC] Implementar benchmark y pruebas de rendimiento para SC-001/SC-002 en tests/perf/coverageBench.spec.ts y jobs/benchmarks/coverageBenchmarkJob.ts

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes transversales posteriores a las historias

- [ ] T173 Ejecutar ajuste de TEAM-05 al estandar transversal en backend/src/modules/strategies/coverage/ (protective/married put, collar, covered straddle)

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): Sin dependencias
- Foundational (Phase 2): Depende de Setup
- User Stories (Phases 3-5): Dependen de Foundational
- Polish (Phase 6): Depende de historias completadas

### User Story Dependencies

- US1 (P1): Sin dependencias de otras historias
- US2 (P2): Puede iniciar tras Foundational; integra contratos y datos propios
- US3 (P3): Requiere outputs de US1 y US2 para explicabilidad

### Parallel Opportunities

- Setup: T187 en paralelo con T188 si el registro de rutas usa placeholders
- Foundational: T189 y T191 en paralelo
- US1: T108, T109 y T110 en paralelo despues de T107
- US2: T114, T115, T116 en paralelo despues de T113

---

## Parallel Example: User Story 2

```bash
Task: "Implementar core de Protective Put / Married Put en backend/src/modules/strategies/coverage/protectivePutEngine.ts"
Task: "Implementar core de Collar Put en backend/src/modules/strategies/coverage/collarEngine.ts"
Task: "Implementar core de Covered Straddle en backend/src/modules/strategies/coverage/coveredStraddleEngine.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup + Foundational
2. Completar US1 y sus tests
3. Validar endpoints institucionales y trazabilidad

### Incremental Delivery

1. US1 (contexto institucional)
2. US2 (estrategias de cobertura)
3. US3 (chat IA explicativo)
4. Polish (estandar transversal)

---

## Coverage Report

**Preserved (canonico sin cambios de contenido)**
- T030, T054, T106, T107, T108, T109, T110, T111, T112, T113, T114, T115, T116, T117, T118, T119, T120, T121, T173, T184, T185, T186

**Expanded (nuevas tareas agregadas)**
- T187, T188, T189, T190, T191, T192, T193, T194, T195, T196

**Merged**
- Ninguna

**Dropped**
- Ninguna

---

## Gaps de Skills (speckit.tasks)

- Sin gaps: 008-inv-market-data-and-realtime, 010-inv-broker-integration-ibkr-alpaca, 011-inv-portfolio-and-performance-analytics, 012-inv-compliance-audit-retention disponibles con docs completos.

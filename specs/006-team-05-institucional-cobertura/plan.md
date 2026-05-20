# Plan de Implementacion: TEAM-05 - Analisis Institucional y Estrategias de Cobertura

**Branch**: `006-team-05-institucional-cobertura` | **Date**: 2026-05-20 | **Spec**: [spec.md](spec.md)  
**Input**: Especificacion de feature desde [spec.md](spec.md)

## Resumen

Implementar una experiencia de analisis institucional y cobertura orientada a tres resultados operativos: exploracion filtrable de flujos institucionales, sugerencia y backtest de estrategias de cobertura, y flujo de aprobacion con trazabilidad completa. La implementacion se apoya en el monorepo existente, con la PWA en `projects/pwa/inversions_app` y la REST API en `projects/rest-api/inversions_api`, usando Supabase como store operacional primario y el catalogo de estrategias como capa dinamica y extensible.

El backlog existente se conserva como base de entrega: las tareas de setup, fundacion, motores de analisis/cobertura, auditoria y retencion se reutilizan como unidades de trabajo. El plan solo normaliza su orden, boundaries y criterios de validacion para que encajen con el alcance de la spec nueva.

## Contexto Tecnico

**Language/Version**: TypeScript 5.x en frontend y backend; Node.js 22 LTS en la API; React 18 en la PWA  
**Primary Dependencies**: Vite, Express, Supabase JS client, Vitest, Supertest, Lightweight Charts, Zustand, React DOM, utilidades compartidas en `projects/packages/*`  
**Storage**: Supabase para propuestas, aprobaciones, auditoria y resultados persistidos; historicos de mercado desde el store historico/plataforma; MongoDB solo si se requiere archivo analitico adicional para series institucionales  
**Testing**: `npm test` y `npm run lint`; pruebas unitarias e integracion sobre rutas y motores criticos; cobertura minima reforzada en flujos de riesgo/aprobacion  
**Target Platform**: Web PWA + REST API  
**Project Type**: Monorepo web con frontend y backend separados  
**Performance Goals**: identificar top-5 movimientos institucionales en menos de 30s; generar backtest de 5 anos en menos de 60s; mantener 95% de acciones de ciclo de vida con metadata auditada  
**Constraints**: aprobacion humana obligatoria antes de cualquier accion sensible; sin ejecucion viva en v1; roles Analyst/PM/Risk/Auditor; export PDF/CSV; modo parcial con advertencias si faltan series historicas  
**Scale/Scope**: universo acotado por ticker/sector/periodo/segmento; estrategias de cobertura configurables y extensibles por catalogo

## Constitution Check

*GATE: Debe pasar antes de Phase 0 research. Revalidar despues de Phase 1 design.*

- Idioma oficial en espanol: **PASS**
- Modelo semi-automatico con aprobacion humana obligatoria: **PASS**
- Separacion clara entre PWA y REST API: **PASS**
- RBAC, auditoria y retencion: **PASS**
- Sin auto-trading ni bypass de gobernanza: **PASS**
- Documentacion y trazabilidad compatibles con el estandar del proyecto: **PASS**

Resultado del gate inicial: **PASS (sin violaciones constitucionales)**.

## UX Architecture & Control Strategy

- **Target Experience**: workspace de dashboard-first con vista dividida; a la izquierda filtros, universo y alertas; a la derecha detalle de flujo institucional, estrategia sugerida, backtest, aprobacion y exportacion.
- **Critical Controls**:
  - Selector de ticker con typeahead y apoyo de catalogo de instrumentos.
  - Filtro por sector, periodo y segmento de cuenta.
  - Selector de estrategia de cobertura con catalogo dinamico.
  - Modal de estrategia para notional, strikes, expiries y parametros de simulacion.
  - Panel de aprobacion con comentarios, estado y metadatos inmutables.
  - Acciones de exportacion a PDF y CSV.
- **State Strategy**: estado local para layout, filtros y modales; estado servidor para flujos, backtests, propuestas, aprobaciones y auditoria; cache de resueltas por ticker/periodo; jobs de backtest en segundo plano con progreso visible.
- **Performance Boundaries**: virtualizacion de listas y tablas largas; carga diferida de graficos; filtros con debounce; refresco incremental de resultados pesados; no bloquear UI durante el calculo de backtests.

## Data Source Routing & Runtime Modes

- **Source Domains**: flujos institucionales, precios historicos, catalogo de estrategias, propuestas, aprobaciones, auditoria y artefactos de exportacion.
- **Routing Rules**:
  - flujos institucionales -> pipeline de ingestion de plataforma -> modelo normalizado.
  - precios historicos -> archivo historico -> motor de backtest.
  - catalogo de estrategias -> registro de configuracion `platform.configs.coverage`.
  - propuestas/aprobaciones/auditoria -> tablas operacionales en Supabase.
  - exportaciones -> generadas desde snapshots persistidos de propuesta/reporte.
- **Runtime Modes**:
  - **Online**: usa fuentes reales, pipeline de ingestion y archivo historico.
  - **Demo**: usa datos semilla y supuestos sinteticos de liquidez/costo para experimentacion segura.
- **Credential/Account Strategy**: lectura para Analyst y PM; aprobacion/escritura para Risk; solo lectura de auditoria para Auditor; la API valida el rol y el contexto de aprobacion en cada mutacion.

## Dynamic Schema Governance

- **Registry Model**: catalogo dinamico de estrategias de cobertura, entidades `CoverageProposal`, `BacktestReport` e ingestiones de `InstitutionalFlow`.
- **Runtime Adaptation**: la UI lee el catalogo para mostrar estrategias nuevas sin branching duro; el backend enruta por `strategyType` hacia handlers especializados.
- **Preset Strategy**: por defecto, Analyst ve recomendaciones y resumenes; PM crea propuestas; Risk revisa y aprueba; Auditor navega historico y exportaciones.
- **Validation Rules**: ticker, rango temporal y estrategia son obligatorios; notional/strike/expiry deben ser coherentes con el tipo de estrategia; el modo parcial de backtest exige advertencia visible y registro de limitaciones.

## Project Structure

### Documentacion de la feature

```text
specs/006-team-05-institucional-cobertura/
├── plan.md
├── spec.md
├── tasks.md
└── checklists/
```

### Estructura del codigo fuente

```text
projects/
├── pwa/inversions_app/
│   └── src/
│       ├── components/
│       ├── features/
│       │   ├── audit/
│       │   ├── dashboard/
│       │   ├── execution/
│       │   └── signals/
│       ├── pages/
│       ├── services/
│       ├── store/
│       └── types/
├── rest-api/inversions_api/
│   └── src/
│       ├── modules/
│       │   ├── institutional/
│       │   └── strategies/coverage/
│       ├── routes/
│       ├── observability/
│       ├── jobs/
│       ├── repositories/
│       └── services/
└── packages/
    ├── types/
    ├── ui-library/
    └── utils/
```

**Structure Decision**: se adopta el monorepo existente con PWA y REST API separadas, mas paquetes compartidos para tipos, utilidades y componentes UI reutilizables. La feature vive en `specs/006-team-05-institucional-cobertura` y el codigo se distribuye entre `projects/pwa/inversions_app` y `projects/rest-api/inversions_api`.

## Plan de Entrega y Backlog

La implementacion sigue el backlog canonico ya creado, sin reescribirlo desde cero:

1. **Setup**: exponer barrels y registrar rutas base para institucional y cobertura.
2. **Foundation**: implementar auditoria transversal, retencion y tipos compartidos.
3. **User Story 1**: habilitar la exploracion institucional y la lectura operativa de flujos con trazabilidad.
4. **User Story 2**: construir motores de cobertura, simulacion y comparacion, con tests unitarios e integracion.
5. **User Story 3**: cerrar el flujo de aprobacion del risk manager con comentarios, registro y exportacion.
6. **Polish**: ajustar naming, cobertura transversal, y hardening de roles, logs y exportes.

## Cambios Recientes (alineacion con análisis)

- Retención: el job de retención de eventos institucionales/cobertura se ha alineado a 730 días (2 años) para cumplir `SC-003`.
- Automatismos: se ha reforzado la regla de que ninguna acción sensitive (stop-loss/close) se ejecuta automáticamente; debe pasar por el flujo de aprobación `Risk` antes de enrutarse a brokers.
- Nuevas tareas añadidas al backlog: motor `iron condor`, UI filtrable, panel de provenance, enforcement RBAC para aprobaciones, export PDF/CSV y benchmark/perf para `SC-001`/`SC-002`.

## Progreso de Implementación (Actual)

**Fecha de Inicio**: 2026-05-20

### Completed Phases

#### Phase 1: Setup ✅ COMPLETE
- **T187**: Barrels created for institutional and coverage modules
- **T188**: Base routes registered at `/api/institutional` and `/api/strategies/coverage`
- **Tests**: Smoke tests validate module structure and route registration
- **Branch**: `feat/006/setup-foundation`
- **Status**: Ready for Phase 2 (Foundational)

### Pending Phases

#### Phase 2: Foundational (NEXT)
- T189: Audit service for institutional/coverage events
- T190: Retention job (730 days)
- T191: Shared types (institutional, coverage)
- **Estimated**: After T187/T188 completion; no blockers

#### Phase 3: User Story 1 - Institutional Analysis (P1)
- T106-T112: Institutional engines and endpoints
- T184, T186: Unit and integration tests
- **Blocked By**: Phase 2 (types/audit)
- **Blocks**: Phase 4 (institutional data consumed by backtests)

#### Phase 4: User Story 2 - Coverage Strategies (P2)
- T113-T120, T192: Coverage engines, simulators, comparators
- T198-T199: Iron condor engine
- T185, T193: Unit and integration tests
- **Blocked By**: Phase 3 (institutional context), Phase 2 (types)
- **Blocks**: Phase 5 (proposals creation)

#### Phase 5: Approval Flow & RBAC (P2)
- T121, T194, T196, T202: Approval service, APIs, UI, RBAC enforcement
- T195: Integration tests for approval workflow
- **Blocked By**: Phase 4 (coverage proposals exist)
- **Blocks**: Release (no execution without approval)

#### Transversals & Polish
- T200: Institutional UI filters
- T201: Provenance panel
- T203: Export PDF/CSV
- T204: Performance benchmarks
- T173: Standard transversal hardening
- **Blocked By**: End of Phase 4
- **Status**: Can start in parallel with Phase 5

### Implementation Statistics

| Phase | Tasks | Complete | Pending | % Done |
|-------|-------|----------|---------|--------|
| Phase 1 (Setup) | 2 | 2 | 0 | 100% ✅ |
| Phase 2 (Foundation) | 3 | 0 | 3 | 0% |
| Phase 3 (US1) | 8 | 0 | 8 | 0% |
| Phase 4 (US2) | 11 | 0 | 11 | 0% |
| Phase 5 (Approval) | 5 | 0 | 5 | 0% |
| Transversals | 8 | 0 | 8 | 0% |
| **TOTAL** | **37** | **2** | **35** | **5.4%** |

### Critical Path to Completion

1. ✅ Phase 1: Setup (DONE)
2. 🔄 Phase 2: Foundational (NEXT) — 3 tasks, est. 2-3 days
3. 🔄 Phase 3: Institutional (PARALLEL after Phase 2) — 8 tasks, est. 5-7 days
4. 🔄 Phase 4: Coverage (PARALLEL/AFTER Phase 3) — 11 tasks, est. 7-10 days
5. 🔄 Phase 5: Approval (AFTER Phase 4) — 5 tasks, est. 3-5 days
6. 🔄 Transversals/Polish (PARALLEL with Phases 3-5) — 8 tasks, est. 3-5 days

**Estimated Total Duration**: 20-30 working days (depending on team size and parallelization)

### Alineacion con el backlog existente

- Se preservan los bloques de setup, fundacion y cobertura ya definidos en `tasks.md` como unidades de trabajo.
- Las tareas de analisis institucional existentes sirven como base para la vista de flujos y la lectura operativa.
- El flujo de aprobacion de la spec queda como prioridad de integracion sobre las rutas y servicios ya planificados en el backlog.

## Complexity Tracking

No hay violaciones constitucionales que justificar. El alcance cabe en la arquitectura separada PWA + REST API ya establecida, con configuracion dinamica para estrategias y persistencia operacional en Supabase.

## Recomendaciones de Knowledge

No se detectan gaps relevantes en el knowledge local para esta fase. El conjunto de skills disponible cubre analisis tecnico, logica de senales, estrategia de opciones/cobertura, flujo institucional, datos en tiempo real, broker integration y analitica de rendimiento.
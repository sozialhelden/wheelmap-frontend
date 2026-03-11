---
name: writing-e2e-tests
description: Guide for writing end to end tests using plawright. Use this when asked to write an end-to-end-test.
---

## Projektübersicht

Dies ist das Frontend für Wheelmap.org, eine Plattform zur Erfassung der Barrierefreiheit von öffentlichen Orten. Stack: Next.js 14, React 18, TypeScript, Playwright, Mapbox GL.

## Testing

### Test-Framework & Konfiguration

- **E2E-Tests**: Playwright (`e2e/` Verzeichnis)
- **Test-Ausführung**: `npm test` oder `npx playwright test`
- **Test-Report**: `npx playwright show-report`
- **Debugging**: `npx playwright test --debug`
- **Einzelner Test**: `npx playwright test e2e/dateiname.spec.ts`
- **Browser-Auswahl**: `npx playwright test --project=chromium`

### Playwright-Konfiguration

- Tests laufen gegen `CI_TEST_DEPLOYMENT_BASE_URL` oder `TEST_DEPLOYMENT_BASE_URL`
- Projekte: chromium, firefox, webkit, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12)
- Traces und Videos werden bei Fehlern aufgezeichnet (`retain-on-failure`)
- Parallelisierung nur lokal, nicht in CI

### Test-Struktur

```typescript
// Standard-Import
import { test, expect } from './lib/axe-test';  // Inkludiert Accessibility-Testing
import getBaseURL from './lib/base-url';
import { skipOnboarding } from './skipOnboarding';

// Test-Setup
test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await skipOnboarding(page);
});

// Test schreiben
test('beschreibung', async ({ page }) => {
  // Playwright-Selektoren bevorzugen: page.getByRole() > page.locator()
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});
```

### Best Practices für Tests

1. **ARIA-Selektoren**: Immer `page.getByRole()` mit ARIA-Labels bevorzugen - nie `page.locator()`!
2. **Screenreader-Fokus**: Tests spiegeln die Screenreader-Erfahrung wider
3. **ARIA-Snapshots**: Semantische Struktur dokumentieren, Clutter vermeiden
4. **Warten**: `page.waitForLoadState()` nach Navigation
5. **Device-Unterscheidung**: `skipOnMobiles()` / `skipOnDesktops()` aus `./lib/device-type`
6. **Axe-Integration**: `makeAxeBuilder()` Fixture für automatisierte Accessibility-Checks

### Testdaten

- Test-Orte in `e2e/test-data/`
- Beispiele aus der Doku:
    - TU Berlin ER-Gebäude: `/buildings/way:23517902`
    - 'TRYP Berlin Mitte': `nodes/vnDZSz73newE2WmnJ`
    - 'S Hauptbahnhof Berlin': `nodes/3856100106`

### Asana CI-Test-Backlog

- **Projekt**: [Asana CI Test Backlog](https://app.asana.com/1/1200321573365931/project/1213356985075012/list/1213352858878732)
- **Workspace GID**: `1200321573365931`
- **Projekt GID**: `1213356985075012`

### Asana-Workflow für Tests

1. **Pro Ticket ein eigener PR** - IMMER einen separaten Branch/PR pro Asana-Ticket erstellen
2. **Branch basiert auf `beta`** - Neue Branches normalerweise von `beta` abzweigen
3. **PRs BEIDSEITIG mit Asana-Ticket verlinken** - IMMER im Commit und PR UND im Asana-Ticket:
    - Commit: `... (Asana #TASK_GID)`
    - PR-Beschreibung: Link `https://app.asana.com/0/PROJECT_GID/TASK_GID` → GitHub-Asana Integration zeigt PR als Karte
    - Asana-Ticket-Description: PR-Deeplink unten anfügen via `mcp_asana_asana_update_task`
4. **PR-Links immer mit korrektem Deeplink** - Format: `https://github.com/sozialhelden/wheelmap-frontend/pull/123`
5. **CI-Status im Ticket aktualisieren** - Vor Änderung nachfragen
6. **Kein passendes Ticket?** → Neues Ticket vorschlagen
7. **Tools verfügbar**: Asana MCP (für Copilot), Asana Python SDK

### Asana MCP-Befehle (Beispiele)

```
# Workspaces auflisten
mcp_asana_asana_list_workspaces

# Tasks in Projekt suchen
mcp_asana_asana_search_tasks workspace_gid="1200321573365931" project_gid="1213356985075012"

# Task Details abrufen
mcp_asana_asana_get_task task_gid="TASK_GID"

# Task aktualisieren
mcp_asana_asana_update_task task_gid="TASK_GID" opt_fields="..."
```

## Entwicklung

### Lokaler Start

```bash
npm install
npm run dev
# App läuft unter http://localhost:3000
```

### Linting & Formatting

```bash
npm run lint        # ESLint + Next.js Lint
npm run format      # Code formatieren
```

### Übersetzungen

```bash
npm run transifex:push   # Neue Strings zu Transifex pushen
```

## Code-Konventionen

- TypeScript streng typisiert
- React Functional Components mit Hooks
- CSS: Modular mit `.module.css` oder SCSS
- Icons: SVG-Komponenten in `src/components/icons/`

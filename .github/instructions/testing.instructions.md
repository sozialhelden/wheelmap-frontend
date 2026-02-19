---
applyTo: "e2e/**,tests/**,**/test*,**/*.spec.ts"
---

# Testing Instructions für Wheelmap Frontend

## Test-Framework

- **Playwright** für E2E-Tests
- Tests im `e2e/` Verzeichnis
- Accessibility-Extension via `@axe-core/playwright`

## Test-Befehle

```bash
npm test                                    # Alle Tests
npx playwright test e2e/datei.spec.ts       # Einzelne Datei
npx playwright test --project=chromium      # Nur Chrome
npx playwright test --debug                 # Debug-Modus
npx playwright show-report                  # HTML-Report
```

## Playwright-Selektoren (Priorität)

**Fokus auf ARIA-Labels und Screenreader-Barrierefreiheit!**

1. `page.getByRole('button', { name: 'ARIA-Label' })` - **Bevorzugt!**
2. `page.getByRole('link', { name: 'Text' })`
3. `page.getByRole('heading', { name: 'Überschrift' })`
4. `page.getByLabel('Formular-Label')` - Für Inputs
5. `page.getByText('exakter Text')` - Nur wenn kein ARIA-Label
6. `page.getByTestId('test-id')` - Vermeiden, nur als letzter Ausweg
7. `page.locator('.class')` - **Nie verwenden!**

### Warum ARIA-Labels?

- Tests spiegeln die Screenreader-Erfahrung wider
- Fehlende Labels werden sofort sichtbar
- Semantische Struktur wird automatisch getestet
- Saubere, lesbare ARIA-Snapshots

### Tab-Reihenfolge & Semantik

- **Tab-Reihenfolge muss logisch sein** - Elemente in der DOM-Reihenfolge, nicht per CSS umpositioniert
- **Korrekte HTML-Elemente verwenden**: `<button>` für Aktionen, `<a>` für Navigation, `<input>` für Eingaben
- **Keine `tabindex > 0`** - Nur `0` oder `-1` verwenden
- **Fokus-Management testen**: Nach Dialogen zurück zum Auslöser, Skip-Links vorhanden
- **Landmark-Regionen**: `<header>`, `<nav>`, `<main>`, `<footer>` korrekt einsetzen

## Test-Template

```typescript
import { test, expect } from './lib/axe-test';
import getBaseURL from './lib/base-url';
import { skipOnboarding } from './skipOnboarding';

const baseURL = getBaseURL();

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await skipOnboarding(page);
});

test('beschreibender Testname', async ({ page }) => {
  // Arrange
  await page.goto(`${baseURL}/pfad`);
  await page.waitForLoadState();
  
  // Act
  await page.getByRole('button', { name: 'Aktion' }).click();
  
  // Assert
  await expect(page.getByText('Erwarteter Text')).toBeVisible();
});
```

## Device-spezifische Tests

```typescript
import { skipOnMobiles, skipOnDesktops } from './lib/device-type';

test('nur Desktop', async ({ page }) => {
  skipOnMobiles();
  // ...
});

test('nur Mobile', async ({ page }) => {
  skipOnDesktops();
  // ...
});
```

## Accessibility-Tests

### ARIA-Snapshots (Semantische Struktur)

**ARIA-Snapshots sind zentral für unsere Tests!** Sie dokumentieren die Screenreader-Struktur.

```typescript
// Sauberer, semantischer Snapshot - so sollte es aussehen
await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
  - banner:
    - link "Home":
      - img "Wheelmap logo"
    - navigation:
      - list:
        - listitem:
          - link "Get involved"
`);

// Vermeide Clutter: Keine IDs, Klassen oder technische Details im Snapshot
```

### Axe Accessibility-Checks

```typescript
test('sollte keine Accessibility-Violations haben', async ({ page, makeAxeBuilder }) => {
  await page.goto(baseURL);
  const results = await makeAxeBuilder().analyze();
  expect(results.violations).toEqual([]);
});
```

## Bekannte Test-Orte

| Ort | URL-Pfad |
|-----|----------|
| TU Berlin ER | `/buildings/way:23517902` |
| TRYP Berlin Mitte | `nodes/vnDZSz73newE2WmnJ` |
| S Hauptbahnhof | `nodes/3856100106` |
| Cube 3 (mit Fotos) | `nodes/4733951222` |
| Bunte Schokowelt | `nodes/619366460` |

## Asana Integration

### CI-Test-Backlog

- **Projekt**: [Asana CI Test Backlog](https://app.asana.com/1/1200321573365931/project/1213356985075012/list/1213352858878732)
- **Workspace GID**: `1200321573365931`
- **Projekt GID**: `1213356985075012`

### Workflow

1. **Jeder Test braucht ein Asana-Ticket**
2. **PRs mit Ticket verlinken** - Immer das passende Ticket referenzieren
3. **CI-Status aktualisieren** - Nutzer vorher fragen
4. **Kein Ticket vorhanden?** → Neues Ticket vorschlagen

### Verfügbare Tools

- **Asana MCP**: `mcp_asana_*` Funktionen für Copilot-Integration
- **Asana Python SDK**: `pip install asana` (global installiert)
- **MCP Server**: `@roychri/mcp-server-asana` (global installiert)

### MCP-Beispiele

```typescript
// Tasks im Projekt suchen
mcp_asana_asana_search_tasks({ workspace_gid: "1200321573365931", project_gid: "1213356985075012" })

// Task-Details holen
mcp_asana_asana_get_task({ task_gid: "TASK_ID" })

// Task aktualisieren (CI-Status)
mcp_asana_asana_update_task({ task_gid: "TASK_ID", ... })
```

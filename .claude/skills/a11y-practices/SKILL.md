ire---
name: a11y-practices
description: >
  Guide for implementing accessible UI in the wheelmap-frontend codebase.
  Use this skill whenever working on any UI component, interactive element,
  form, dialog, image, heading, navigation, or any code that users interact
  with — especially when adding new components, fixing visual bugs, or
  reviewing PRs. Apply proactively even when accessibility isn't explicitly
  mentioned: accessible code is the default expectation in this project.
---

# Web Accessibility Practices — wheelmap-frontend

This project is a wheelchair accessibility mapping app, so getting a11y right
is especially important. Below are the patterns actually used in this codebase,
with concrete examples and file references.

---

## Stack overview

- **Radix UI Themes** (`@radix-ui/themes`) — provides semantic components with
  built-in ARIA support: `Dialog`, `DropdownMenu`, `Heading`, `VisuallyHidden`,
  `IconButton`, `Button`, `Popover`, `Tooltip`
- **styled-components** — layout and visual styling; a11y logic lives in JSX,
  not CSS (with one notable exception: list semantics, see below)
- **lucide-react** — icons; always pair with visible label or `aria-hidden`
- **@transifex/native** + `useTranslations` — all user-visible strings
  (including ARIA labels) must be translatable

---

## 1. Screen-reader-only content: `VisuallyHidden`

Use `VisuallyHidden` from `@radix-ui/themes` to provide context that is
meaningful to screen readers but not shown visually. This is the preferred
approach over CSS `sr-only` classes.

**Common use cases:**

```tsx
import { VisuallyHidden, Heading } from "@radix-ui/themes";

// Section headings inside FeatureDetails — sighted users see the layout;
// screen readers hear a logical document outline
<VisuallyHidden>
  <Heading as="h2">{t("Wheelchair section")}</Heading>
</VisuallyHidden>

// Dialog title/description when no visible heading exists
// (required by Radix Dialog for ARIA compliance)
<Dialog.Title>
  <VisuallyHidden>{t("Image gallery")}</VisuallyHidden>
</Dialog.Title>
```

**Reference files:**
- `src/needs-refactoring/modules/feature-panel/components/FeatureDetails.tsx`
- `src/needs-refactoring/components/CombinedFeaturePanel/components/Gallery/Gallery.tsx`
- `src/needs-refactoring/modules/feature-panel/components/ToiletsSection.tsx`
- `src/needs-refactoring/modules/feature-panel/components/StringFieldEditor.tsx`
- `src/modules/categories/components/CategoryFilter.tsx`

---

## 2. ARIA attributes

### `aria-hidden`

Hide decorative/redundant elements from the accessibility tree. Do **not** use
`aria-hidden` on elements that contain interactive children.

```tsx
// Decorative icon next to visible label text
<AlertCircle aria-hidden />

// Visual star display — numeric and text alternatives are provided separately
<span className="stars" aria-hidden="true">{stars}</span>
```

### `aria-label`

Provide a label when an element has no visible text, or when the visible text
is insufficient for context.

```tsx
// Edit button — the visible icon says nothing; the label says everything
<IconButton aria-label={t("Edit wheelchair accessibility")}>
  <PencilIcon />
</IconButton>

// Logo link — "home" isn't visible text
<a href="/" aria-label={t("Go to home page")}>
  <Logo />
</a>
```

> When the label depends on the feature being shown (e.g. "Edit accessibility
> for Café Sternchen"), build it dynamically from the feature name rather than
> using a generic string.

### `aria-live`

For dynamic content that updates without a page navigation, use
`aria-live="polite"` so screen readers announce the change at the next
opportunity without interrupting speech.

```tsx
// Gallery image counter — announces "Image 3 of 12" when user navigates
<VisuallyHidden aria-live="polite">
  {t("Image shown: {imageDescription}", { imageDescription })}
</VisuallyHidden>
```

Use `aria-live="assertive"` only for urgent errors; prefer `"polite"` for
informational updates.

**Reference:** `src/needs-refactoring/components/CombinedFeaturePanel/components/Gallery/GalleryFullscreenItem.tsx`

### `aria-describedby`

Link a description to its element by ID. Radix UI Dialog handles this
automatically when you provide `Dialog.Description`.

```tsx
<Dialog.Content aria-describedby="editor-description">
  <Dialog.Description id="editor-description">
    <VisuallyHidden>{t("Choose wheelchair accessibility level")}</VisuallyHidden>
  </Dialog.Description>
</Dialog.Content>
```

---

## 3. Headings and document outline

The heading hierarchy must form a logical outline even when headings are
visually hidden. Use the `Heading` component with an explicit `as` prop to
separate visual size from semantic level.

```tsx
// h1 — place name (one per panel view)
<Heading as="h1">{placeName}</Heading>

// h2 — logical sections (often visually hidden)
<VisuallyHidden>
  <Heading as="h2">{t("Wheelchair section")}</Heading>
</VisuallyHidden>
```

When a heading component is reused at different nesting levels, accept a `level`
prop and forward it:

```tsx
// FeatureNameHeader accepts level="h1" | "h2"
<FeatureHeader level="h1" feature={feature} />
```

**Reference:** `src/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader.tsx`

---

## 4. Emojis and screen readers

Emojis in OSM tag values are wrapped with `aria-hidden` to prevent screen
readers from reading out their Unicode names (e.g., "wheelchair symbol").

```tsx
import { maskEmojisForScreenReaders } from
  "~/needs-refactoring/modules/edit/utils/getValueLabel";

const displayText = maskEmojisForScreenReaders(translatedValue);

// Renders as: "Accessible <span aria-hidden="true">♿</span>"
<StyledMarkdown inline>{displayText}</StyledMarkdown>
```

**Always apply `maskEmojisForScreenReaders`** before rendering any string that
may contain emojis from OSM tag values.

**Reference:** `src/needs-refactoring/modules/edit/utils/getValueLabel.ts`

---

## 5. Keyboard navigation

### Dialogs and menus

Radix UI `Dialog`, `DropdownMenu`, and `Popover` handle keyboard navigation
(Tab, Shift+Tab, Escape, Arrow keys, Enter/Space) automatically. Prefer these
over custom implementations.

### Custom keyboard handlers

When building custom keyboard-navigable widgets, follow the established pattern
from `SearchFormField`:

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  switch (e.key) {
    case "ArrowDown": /* highlight next */; break;
    case "ArrowUp":  /* highlight previous */; break;
    case "Enter":    /* activate highlighted */; break;
    case "Escape":   /* dismiss / clear */; break;
  }
};
```

Gallery uses the same pattern with Left/Right arrows and R for report.

**References:**
- `src/modules/search/components/SearchFormField.tsx`
- `src/needs-refactoring/components/CombinedFeaturePanel/components/Gallery/Gallery.tsx`

---

## 6. Focus management

### Dialogs

Radix Dialog automatically traps focus when open and restores it on close. If
you need to direct focus to a specific element on open, use `onOpenAutoFocus`:

```tsx
<Dialog.Content
  onOpenAutoFocus={(e) => {
    e.preventDefault();
    specificRef.current?.focus();
  }}
  onCloseAutoFocus={(e) => {
    e.preventDefault();
    triggerRef.current?.focus();
  }}
>
```

### Panel navigation

The feature panel heading is managed via a ref so focus can be directed to it
programmatically when a new feature loads:

```tsx
const headingRef = useRef<HTMLHeadingElement>(null);
// headingRef is passed to <FeatureHeader ref={headingRef} />
// focus() would be called here when the feature changes
```

**Reference:** `src/needs-refactoring/modules/feature-panel/components/FeatureDetails.tsx`

---

## 7. Semantic HTML

### Lists

Use `<ul>` / `<li>` for collections. When Radix or styled-components suppress
the default bullet style, preserve the list semantics explicitly — VoiceOver on
macOS removes list semantics when `list-style` is `none`:

```tsx
// Keeps the implicit list role in VoiceOver on macOS
const ImageList = styled.ul`
  list-style-type: "";   /* intentionally empty string, not "none" */
`;
```

**Reference:** `src/needs-refactoring/components/CombinedFeaturePanel/components/Gallery/GalleryFullscreenItem.tsx`

### Definition lists

Key-value accessibility data uses `<dt>` / `<dd>` for proper semantics:

```tsx
<dl>
  <dt>{label}</dt>
  <dd>{value}</dd>
</dl>
```

**Reference:** `src/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityDetailsTree.tsx`

### Buttons vs. divs

Always use `<button>` (or a Radix `Button` / `IconButton`) for interactive
elements. Never attach `onClick` to a `<div>` or `<span>` without also adding
`role="button"`, `tabIndex={0}`, and keyboard handlers — and even then, prefer
the button element.

---

## 8. Images and icons

```tsx
// Decorative icon — hidden from screen reader
<Accessibility size={24} color="white" aria-hidden />

// Meaningful image — provide descriptive alt text
<img src={imageUrl} alt={imageDescription} />

// Purely decorative image in a list — empty alt, do not omit it
<img src={thumbnailUrl} alt="" />
```

Radix UI `IconButton` does not automatically hide its children from screen
readers; add `aria-hidden` to the icon inside it and rely on the button's
`aria-label` for the accessible name.

---

## 9. Translatable ARIA labels

All strings visible to users — including `aria-label`, `aria-describedby`
target text, `VisuallyHidden` text, and button labels — must go through
the translation pipeline:

```tsx
import { t } from "@transifex/native";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";

// Static labels (used outside React render or in event handlers)
aria-label={t("Close dialog")}

// Dynamic / hook-based (inside components, when value depends on data)
const labelText = useTranslations(tagProps?.keyLabel);
```

Do not hardcode English strings in ARIA attributes.

---

## 10. Ratings and compound values

When displaying a value that has both a visual and a text representation
(e.g., star ratings), provide one accessible label and mark the visual
representations as `aria-hidden`:

```tsx
<span aria-label={`${rating} stars`}>
  <span aria-hidden="true">{starSymbols}</span>
  <span aria-hidden="true">{rating}/5</span>
</span>
```

**Reference:** `src/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/PlaceAccessibility/AccessibilityDetailsTree.tsx`

---

## 11. Testing

- E2E tests (Playwright) use **role-based queries** — test IDs are a fallback,
  not the primary selector:
  ```ts
  await dialog.getByRole("button", { name: "Confirm" }).click();
  ```
- Components expose `data-testid` attributes for cases where role queries are
  ambiguous (e.g. `data-testid="wheelchair-section"`).
- WCAG compliance testing is planned but not yet implemented
  (see TODO in `src/needs-refactoring/modules/edit/tests/edit-wheelchair-accessibility.e2e-spec.ts`).

---

## Quick reference checklist

When adding or reviewing a UI component, verify:

- [ ] Interactive elements are `<button>` or `<a>`, not `<div>`
- [ ] Icon-only buttons have `aria-label` (translated)
- [ ] Icons inside labeled buttons have `aria-hidden`
- [ ] Section headings exist in the DOM (even if `VisuallyHidden`)
- [ ] Heading levels are sequential and don't skip (h1 → h2 → h3)
- [ ] Emojis in OSM-sourced text are masked with `maskEmojisForScreenReaders`
- [ ] Dynamic content updates use `aria-live="polite"`
- [ ] Lists use `<ul>/<li>` with `list-style-type: ""` (not `none`)
- [ ] Dialogs use Radix `Dialog` (not custom) for focus trap and ARIA
- [ ] All ARIA label strings are wrapped in `t()` or `useTranslations()`
- [ ] Images have meaningful `alt` or `alt=""` if decorative
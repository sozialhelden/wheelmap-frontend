---
name: map-interactions
description: How map movement, state, and geolocation work. Use this when modifying the map, its position/zoom, URL sync, or geolocation behaviour.
---

## Core Principle: Map-First, URL-Second

Map movements are **always imperative** — driven by direct user interaction (drag, zoom, click, geolocation trigger) — and **never declarative** (never derived from URL/query parameters).

The URL is updated **after** the map has moved, never the other way around. This one-way data flow (`map → URL`) prevents endless UI loops where a URL change moves the map, which updates the URL, which moves the map, etc.

```
user interaction → map moves → onMoveEnd / onZoomEnd fires → URL updated (shallow)
```

**Never** read position from the URL and feed it back into the map as a controlled value.

## Key Files

| File | Purpose |
|---|---|
| `src/modules/map/components/MapComponent.tsx` | The main `<ReactMapGL>` wrapper. Renders the map, sources, layers, and controls. |
| `src/modules/map/hooks/useMap.tsx` | `MapContext` — shares the `MapRef` instance and an `isReady` flag across the app. |
| `src/modules/map/hooks/useMapInteraction.ts` | Mouse/touch handlers and the `onViewStateChange` callback that syncs map position → URL. |
| `src/modules/map/hooks/useMapStyle.ts` | Manages dark/light map style and icon loading. Temporarily resets `isReady` during style switches. |
| `src/modules/app-state/hooks/useAppState.tsx` | The global `AppState` context. Position is one slice of app state, serialised to/from URL query params. |
| `src/modules/app-state/app-state.tsx` | Declares the `appStateConfig` — default position is `{ lat: 52.5, lon: 13.3, zoom: 10 }` (Berlin). |

## MapComponent

- Uses `react-map-gl/mapbox` `<Map>` with **`initialViewState`** (not `viewState`), making the map uncontrolled — it manages its own internal position.
- `initialViewState` is read from `appState.position` (parsed from URL on first render) and used only once.
- `onMoveEnd` and `onZoomEnd` both call `onViewStateChange`, which writes the new position back to the URL via `setAppState(..., { routerOperation: "shallow" })`. This uses `window.history.replaceState` so there is no navigation/re-render.
- The map instance is shared via `MapContext` (`useMap()`) by passing the `ref={setMap}` callback to `<ReactMapGL>`.
- `isReady` flips to `true` after `onLoad` completes (style loaded + icons loaded). Other parts of the app can check this before interacting with the map.

## useMap (MapContext)

- Provides `map` (`MapRef | undefined`), `setMap`, `isReady`, `setIsReady`.
- `MapRef` is react-map-gl's wrapper around `mapboxgl.Map` — it exposes `flyTo`, `easeTo`, `getZoom`, etc.
- `isReady` is `false` until the map style + icons are loaded, and is temporarily reset to `false` when switching between dark/light mode.

## useMapInteraction

- `onViewStateChange(event: ViewStateChangeEvent)` — extracts `{ longitude, latitude, zoom }` from the event and writes it to `appState.position` with a **shallow** router operation (no Next.js navigation, just `history.replaceState`).
- `position` (returned to `MapComponent` for `initialViewState`) is always read from `appState.position`.
- `onMouseClick` — resolves clicked features and navigates to the feature URL via the app-state-aware router.
- Cursor state is local (`useState`), toggled on `mouseEnter`/`mouseLeave` over interactive layers.

## Geolocation (GeolocateControl)

- Mapbox's `GeolocateControl` is rendered inside the map with `trackUserLocation` enabled. This shows the blue dot and follows the user.
- A callback ref (`setGeolocateControl`) is used instead of a plain `useRef` because react-map-gl's `GeolocateControl` expects a ref callback, not a mutable ref object.
- `geoControlRef.current.trigger()` is called once after the map is ready (`isReady` flips true). This programmatically starts the browser geolocation flow — identical to the user clicking the geolocate button.
- `onGeolocate` fires a `handleGeolocate` callback that calls `map.flyTo()` to the reported coordinates, zooming to at least 15.
- The geolocation flow is also used in onboarding (`useGeolocationPermission`), which asks for permission via `navigator.geolocation.getCurrentPosition`.

## AppState & URL Sync

- `AppState` is derived from URL search params on each render (`getAppStateFromSearchParams`).
- `setAppState` merges new values, serialises to query params, and pushes/replaces/shallow-updates the URL.
- `routerOperation: "shallow"` (used by map position updates) calls `window.history.replaceState` directly — no Next.js router cycle, no re-render.
- Position is persisted to `localStorage` so returning users resume where they left off (when no URL params are present).

## Rules for Modifying Map Behaviour

1. **Do not** bind `viewState` on the map — always use `initialViewState` to keep it uncontrolled.
2. **Do not** derive map position from URL reactively (e.g. in a `useEffect` watching query params). The URL reflects the map, not the other way around.
3. To move the map programmatically, call `map.flyTo()` / `map.easeTo()` / `map.jumpTo()` on the `MapRef` obtained from `useMap()`.
4. After a programmatic move, the `onMoveEnd` handler will automatically sync the new position back to the URL.
5. Guard any map interaction behind `isReady` — the map instance exists before icons/style are loaded, but interacting too early can cause errors.


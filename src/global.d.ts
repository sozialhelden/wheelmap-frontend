import type { Map as MapboxGLMap } from "mapbox-gl";

declare global {
  interface Window {
    __e2eMapInstances?: Record<string, MapboxGLMap>;
  }
}

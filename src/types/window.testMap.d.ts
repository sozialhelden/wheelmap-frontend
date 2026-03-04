import type { Map as MapboxGLMap } from "mapbox-gl";

declare global {
  interface Window {
    testMap?: MapboxGLMap;
  }
}

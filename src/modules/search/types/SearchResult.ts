import type { Extent } from "~/utils/focus-map-on-feature";

export type SearchResult = {
  id: string;
  title: string;
  lat: number;
  lon: number;
  url?: string;
  address?: string;
  extent?: Extent;
  category?: string;
};

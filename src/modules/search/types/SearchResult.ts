export type SearchResult = {
  id: string;
  title: string;
  lat: number;
  lon: number;
  url?: string;
  address?: string;
  extent?: number[];
  category?: string;
};

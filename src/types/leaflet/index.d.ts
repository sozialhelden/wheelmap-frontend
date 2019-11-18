declare module 'leaflet' {
  export const control: any;
  export const Browser: any;
  export const Util: any;
  export const Control: any;
  export const DomUtil: any;
  export const DomEvent: any;
  export const Map: any;
  export const Handler: any;

  export class CircleMarker {}

  export type Map = any;
  export class LatLng {
    constructor(a: any, b: any);
  }
  export type Layer = any;

  export class LatLngBounds {
    constructor(a: any);

    public equals(a: LatLngBounds, b: number): boolean;
  }

  export class MarkerClusterGroup extends LayerGroup {
    constructor(obtions: any);

    public on(type: string, f: any): void;
  }

  export class Marker extends LayerGroup {
    constructor(latlng: LatLng, options?: any);

    public on(a: string, f: (a: any) => void): void;

    protected getIcon(): any;
    protected setIcon(icon: any): void;
    protected setOpacity(n: number): void;
    protected getLatLng(): LatLng;
  }

  export class LayerGroup {
    constructor(options?: any);

    public addLayer(layerGroup: LayerGroup): void;
    public removeLayer(layerGroup: LayerGroup): void;
    public hasLayer(layerGroup: LayerGroup): boolean;
    public getLayers(): LayerGroup;
    public clearLayers(): void;
  }

  export type TileLayerOptions = any;

  export class TileLayer extends LayerGroup {
    public readonly _url: string;

    protected options: TileLayerOptions;
    protected _layerGroup: LayerGroup;
    protected _tiles: any;
    protected _tilesToLoad: any;
    protected _map: any;
    protected _globalTileRange: any;

    constructor(url: string, options: TileLayerOptions);

    public setUrl(url: string): void;
    public _update(a: any[]): any;

    protected fire(a: string, b: any): void;
    protected _getSubdomain(coords: any): string;
    protected _getZoomForUrl(): any;
  }

  export class Point {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number);
  }

  export type IconOptions = any;

  export class Icon {
    protected options: IconOptions
    protected iconSvgElement: React.ReactElement;
    protected onClick: () => void;
    protected href: string;
    protected highlighted: boolean;
    protected accessibleName: string;
    protected size: any;

    constructor(options: IconOptions);

    protected _setIconStyles(a: any, b: any): void;
  }

  export function extend(a: any, b: any, c?: any): any;

  export function point(a: number, b: number): Point;

  export function layerGroup(options?: any): LayerGroup;

  export function circle(latlng: LatLng, radius: number, style: string): any;

  export function bind(a: any, b: any): any;

  export function map(a: any, b: any): any;

  export function tileLayer(a: any, b: any): any;

  export function latLngBounds(a: any): any;
}
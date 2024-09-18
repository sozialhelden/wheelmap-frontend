const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a

export const uriFriendlyPosition = ({ latitude, longitude, zoom }: { latitude: number, longitude: number, zoom: number }) => {
  const precision = Math.floor(lerp(1, 15, zoom / 22))
  return {
    latitude: latitude.toFixed(precision),
    longitude: longitude.toFixed(precision),
    zoom: zoom.toFixed(precision),
  } as const
}

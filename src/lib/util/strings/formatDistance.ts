import shouldPreferImperialUnits from '../../model/geo/shouldPreferImperialUnits';

const unitSets = {
  metric: [
    {
      unit: 'm',
      max: 995,
      mult: 1,
    },
    {
      unit: 'km',
      mult: 1 / 1000,
    },
  ],
  imperialFeet: [
    {
      unit: 'ft',
      mult: 3.28084,
      max: 5000,
    },
    {
      unit: 'mi',
      mult: 1 / 5280,
    },
  ],
  imperialYard: [
    {
      unit: 'yd',
      mult: 1.09361,
      max: 995,
    },
    {
      unit: 'mi',
      mult: 1 / 1760,
    },
  ],
};

// transforms the distance into the closest fitting unit and displays with reduced precision
//    5.31 becomes 5.3m
//    254.1234 becomes 250m
//    2123.12 becomes  2.1km
//    12123.12 becomes  12km
export function formatDistance(
  distanceInMeters: number,
  precision: number = 2,
): { unit: string | number; distance: string | number } {
  const unitSet = shouldPreferImperialUnits() ? unitSets.imperialYard : unitSets.metric;

  // TODO: check types
  let distance: number | string = distanceInMeters;
  let unit: number | string = distanceInMeters;
  // find the best matching unit to display
  for (const step of unitSet) {
    distance *= (step.mult || 1.0);
    unit = step.unit;

    if (!step.max || distance < step.max) {
      break;
    }
  }

  // format according to precision, parseFloat ensures no 5e+2 from toPrecision remains
  distance = parseFloat(distance.toPrecision(precision)).toString();
  return { unit, distance };
}

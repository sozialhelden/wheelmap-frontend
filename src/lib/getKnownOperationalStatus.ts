import { isEquipmentStatusOutdated } from './equipmentStatusFreshness';

type StatusProperties = Parameters<typeof isEquipmentStatusOutdated>[0] & {
  isWorking?: boolean;
};

/**
 * Combined operational status of a place's elevators/escalators, if it is currently known.
 * One facility out of order is enough to make the place unusable (e.g. a bridge needs both of its
 * elevators), so `false` wins. `true` needs a current 'working' status for every facility.
 */
export function getKnownOperationalStatus(
  facilityProperties: StatusProperties[],
  now = new Date()
): boolean | undefined {
  const currentStatuses = facilityProperties.map(properties =>
    isEquipmentStatusOutdated(properties, now) ? undefined : properties.isWorking
  );
  if (currentStatuses.includes(false)) return false;
  if (currentStatuses.length > 0 && currentStatuses.every(isWorking => isWorking === true)) {
    return true;
  }
  return undefined;
}

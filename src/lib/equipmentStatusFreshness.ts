const hourInMilliseconds = 1000 * 60 * 60;

/** Operational status older than this is shown as unknown. */
export const maximalStatusAgeInMilliseconds = 2 * hourInMilliseconds;

/**
 * Hardware sensors confirm their facility's status with every check-in (every 4 hours), so their
 * status stays valid longer – and a sensor that stopped checking in still turns 'unknown'.
 */
export const maximalSensorStatusAgeInMilliseconds = 6 * hourInMilliseconds;

type StatusTimestampProperties = {
  stateLastUpdate?: string;
  lastUpdate?: string;
  lastDisruptionProperties?: { lastUpdate?: string };
  statusHardwareSensorId?: string;
};

export function isExistingInformationOutdated(
  lastUpdate: Date | null | undefined,
  maximalAgeInMilliseconds = maximalStatusAgeInMilliseconds,
  now = new Date()
): boolean {
  if (!lastUpdate) return false;
  return now.getTime() - lastUpdate.getTime() > maximalAgeInMilliseconds;
}

export function getEquipmentStatusLastUpdate(properties: StatusTimestampProperties): Date | null {
  const lastUpdateDateString =
    properties.stateLastUpdate ||
    properties.lastUpdate ||
    properties.lastDisruptionProperties?.lastUpdate;
  return lastUpdateDateString ? new Date(lastUpdateDateString) : null;
}

export function isEquipmentStatusOutdated(
  properties: StatusTimestampProperties,
  now = new Date()
): boolean {
  const maximalAge = properties.statusHardwareSensorId
    ? maximalSensorStatusAgeInMilliseconds
    : maximalStatusAgeInMilliseconds;
  return isExistingInformationOutdated(getEquipmentStatusLastUpdate(properties), maximalAge, now);
}

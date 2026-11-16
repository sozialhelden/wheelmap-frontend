const hourInMilliseconds = 1000 * 60 * 60;

/** Operational status older than this is shown as unknown. */
export const maximalStatusAgeInMilliseconds = 2 * hourInMilliseconds;

/**
 * Hardware sensors confirm their facility's status with every check-in (every 4 hours), so their
 * status stays valid longer – and a sensor that stopped checking in still turns 'unknown'.
 */
export const maximalSensorStatusAgeInMilliseconds = 6 * hourInMilliseconds;

export function isExistingInformationOutdated(
  lastUpdate: Date | null | undefined,
  maximalAgeInMilliseconds = maximalStatusAgeInMilliseconds,
  now = new Date(),
): boolean {
  if (!lastUpdate) return false;
  return now.getTime() - lastUpdate.getTime() > maximalAgeInMilliseconds;
}

export function isEquipmentStatusOutdated(
  properties: {
    stateLastUpdate?: Date | string;
    statusHardwareSensorId?: string;
  },
  now = new Date(),
): boolean {
  const lastUpdate = properties.stateLastUpdate
    ? new Date(properties.stateLastUpdate)
    : null;
  const maximalAge = properties.statusHardwareSensorId
    ? maximalSensorStatusAgeInMilliseconds
    : maximalStatusAgeInMilliseconds;
  return isExistingInformationOutdated(lastUpdate, maximalAge, now);
}

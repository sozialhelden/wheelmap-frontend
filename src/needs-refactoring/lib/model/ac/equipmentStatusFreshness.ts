const hourInMilliseconds = 1000 * 60 * 60;

/** Operational status older than this is shown as unknown. */
export const maximalStatusAgeInMilliseconds = 2 * hourInMilliseconds;

/**
 * Hardware sensors confirm their facility's status with every event they send, so their status
 * stays valid longer than manually maintained data.
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
    isWorking?: boolean;
    stateLastUpdate?: Date | string;
    statusHardwareSensorId?: string;
    statusHardwareSensorType?: string;
  },
  now = new Date(),
): boolean {
  // A relay reports every change, so its last reported state stays valid. The UI shows it together
  // with its date (`stateLastUpdate`, refreshed with every sensor event).
  if (
    properties.statusHardwareSensorType === "relay" &&
    typeof properties.isWorking === "boolean"
  ) {
    return false;
  }
  const lastUpdate = properties.stateLastUpdate
    ? new Date(properties.stateLastUpdate)
    : null;
  const maximalAge = properties.statusHardwareSensorId
    ? maximalSensorStatusAgeInMilliseconds
    : maximalStatusAgeInMilliseconds;
  return isExistingInformationOutdated(lastUpdate, maximalAge, now);
}

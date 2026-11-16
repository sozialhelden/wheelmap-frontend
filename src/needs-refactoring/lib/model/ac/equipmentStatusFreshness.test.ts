import { describe, expect, it } from "vitest";
import {
  isEquipmentStatusOutdated,
  isExistingInformationOutdated,
} from "./equipmentStatusFreshness";

const now = new Date("2026-11-16T12:00:00.000Z");
const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 60 * 60 * 1000);

describe("isExistingInformationOutdated", () => {
  it("treats missing dates as not outdated", () => {
    expect(isExistingInformationOutdated(null, undefined, now)).toBe(false);
  });

  it("uses two hours by default", () => {
    expect(isExistingInformationOutdated(hoursAgo(1.9), undefined, now)).toBe(
      false,
    );
    expect(isExistingInformationOutdated(hoursAgo(2.1), undefined, now)).toBe(
      true,
    );
  });
});

describe("isEquipmentStatusOutdated", () => {
  it("keeps a two hour window for facilities without a status sensor", () => {
    expect(
      isEquipmentStatusOutdated({ stateLastUpdate: hoursAgo(3) }, now),
    ).toBe(true);
  });

  it("allows six hours for facilities whose status comes from a hardware sensor", () => {
    const statusHardwareSensorId = "sensor-id";
    expect(
      isEquipmentStatusOutdated(
        { statusHardwareSensorId, stateLastUpdate: hoursAgo(5) },
        now,
      ),
    ).toBe(false);
    expect(
      isEquipmentStatusOutdated(
        { statusHardwareSensorId, stateLastUpdate: hoursAgo(7) },
        now,
      ),
    ).toBe(true);
  });

  it("accepts timestamps as strings, as delivered by the API", () => {
    expect(
      isEquipmentStatusOutdated(
        { stateLastUpdate: hoursAgo(1).toISOString() },
        now,
      ),
    ).toBe(false);
  });
});

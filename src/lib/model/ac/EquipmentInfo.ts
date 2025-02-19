import {
  EquipmentInfo,
  type EquipmentProperties,
} from "@sozialhelden/a11yjson";
import { t } from "@transifex/native";
import type { FeatureCollection, Point } from "geojson";
import { currentLocales } from "../../i18n/i18n";
import type { YesNoLimitedUnknown, YesNoUnknown } from "./Feature";

export type EquipmentInfoFeatureCollection = FeatureCollection<
  Point,
  EquipmentProperties
>;

export function equipmentStatusTitle(isWorking: boolean, isOutdated: boolean) {
  return {
    // translator: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    true: t("In operation"),
    // translator: An equipment or facility status. This does not mean the facility is broken: It might just be in maintenance! The facility might be an elevator, escalator, switch, sitemap, …
    false: t("Out of order"),
    // translator: An equipment or facility status. The facility might be an elevator, escalator, switch, sitemap, …
    undefined: t("Unknown operational status"),
  }[String(isOutdated ? undefined : isWorking)];
}

export function isExistingInformationOutdated(
  lastUpdate: Date | undefined,
): boolean {
  if (!lastUpdate) return false;
  const twoHoursInMilliseconds = 1000 * 60 * 60 * 2;
  return new Date().getTime() - lastUpdate.getTime() > twoHoursInMilliseconds;
}

export function isEquipmentAccessible(
  properties: { stateLastUpdate?: Date; isWorking?: boolean } | undefined,
): YesNoLimitedUnknown | null {
  if (!properties) {
    return null;
  }

  const lastUpdate = properties.stateLastUpdate
    ? new Date(properties.stateLastUpdate)
    : null;
  const isOutdated = isExistingInformationOutdated(lastUpdate);
  const resultMap: Record<string, YesNoUnknown> = {
    true: "yes",
    false: "no",
    undefined: "unknown",
  };
  return resultMap[String(isOutdated ? undefined : properties.isWorking)];
}

export function lastUpdateString({
  lastUpdate,
  isWorking,
  category,
  isOutdated,
}: {
  lastUpdate: Date | null;
  isWorking: boolean | undefined;
  category: string | null;
  isOutdated: boolean;
}) {
  if (!lastUpdate) {
    // translator: Shown next to equipment status when the system does not know a last update.
    return "Unfortunately there is no information when this status was last updated.";
  }

  const translatedEquipmentCategory = {
    escalator: t("Escalator"),
    elevator: t("Elevator"),
    // translator: An equipment or facility whose category we don't know. It might be an elevator, escalator, switch, sitemap, …
    undefined: t("Facility"),
  }[String(category)];

  const now = new Date();
  const today = t("today");
  const yesterday = t("yesterday");
  const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;
  const isShortAgo =
    now.getTime() - lastUpdate.getTime() < twoDaysInMilliseconds;
  const isToday = isShortAgo && lastUpdate.getDay() === now.getDay();
  let dateString = lastUpdate.toLocaleDateString(
    currentLocales.map((l) => l.string),
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  if (
    isExistingInformationOutdated(lastUpdate) &&
    typeof isWorking !== "undefined"
  ) {
    const lastStatus = equipmentStatusTitle(isWorking, false);
    // translator: Shown for equipment when the last known status information is too old.
    return t(
      `Last known operational status: ${translatedEquipmentCategory} was ${lastStatus} on ${dateString}.`,
    );
  }
  if (isShortAgo) {
    dateString = `${
      isToday ? today : yesterday
    }, ${lastUpdate.toLocaleTimeString(
      currentLocales.map((l) => l.string),
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )}`;
  }
  // translator: Shown next to equipment status.
  return t("Last update: {dateString}", { dateString });
}

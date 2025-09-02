import { t } from "@transifex/native";
import { DateTime } from "luxon";
import opening_hours from "opening_hours";
import * as React from "react";
import { useAdminAreas } from "~/needs-refactoring/lib/fetchers/osm-api/fetchAdminAreas";
import {
  isOSMFeature,
  type TypeTaggedOSMFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { log } from "~/needs-refactoring/lib/util/logger";
import FeatureContext from "../FeatureContext";
import { Badge, Flex, Text } from "@radix-ui/themes";

function getReadableState(oh: opening_hours) {
  const comment = oh.getComment();
  let string = undefined;
  if (oh.getUnknown()) {
    if (comment) {
      string = t("Maybe open – {comment}", { comment });
    }
    string = t("Maybe open");
  } else {
    const state = oh.getState();
    string = state ? t("Open now") : t("Closed");
    if (comment) {
      string = [string, t("({comment})", { comment })].join(" ");
    }
  }
  return string;
}

export default function OpeningHoursValue(props: {
  value: string;
  tagKey: string;
  osmFeature?: TypeTaggedOSMFeature;
}) {
  // https://openingh.ypid.de/evaluation_tool/?lng=en
  // https://github.com/opening-hours/opening_hours.js
  const { value, osmFeature, tagKey } = props;
  const feature = React.useContext(FeatureContext);

  let lat: number | undefined;
  let lon: number | undefined;

  if (isOSMFeature(feature)) {
    [lon, lat] = feature.geometry.coordinates;
  }
  const adminAreas = useAdminAreas({ longitude: lon, latitude: lat });
  const { featuresByType } = adminAreas;
  const country = [
    feature?.properties?.["addr:country"],
    featuresByType?.country?.properties?.["ISO3166-1:alpha2"],
  ].find((c) => typeof c === "string");
  const state = [
    feature?.properties?.["addr:state"],
    (featuresByType?.state || featuresByType?.city)?.properties?.state_code,
  ].find((c) => typeof c === "string");

  const hoursUrl = osmFeature?.properties["opening_hours:url"];

  const { openState, closesIn, oh, niceString } = React.useMemo(() => {
    try {
      const oh = new opening_hours(
        value,
        lat && lon && country && state
          ? {
              lat,
              lon,
              address: { country_code: country, state },
            }
          : null,
        {
          locale: navigator.language.slice(0, 2),
          tag_key: tagKey,
          map_value: true,
          mode: 2, //mode.both
          warnings_severity: 6, //warnings_severity.info
        },
      );
      const isOpen = oh.getState(); // for current date
      const nextChangeDate = oh.getNextChange();
      const openState = getReadableState(oh);

      let closesIn = undefined;
      if (typeof nextChangeDate === "undefined") closesIn = t("Always open");
      else {
        const isUnknown = oh.getUnknown(nextChangeDate);
        const nextChangeDateTime = DateTime.fromJSDate(nextChangeDate);
        const nextChangeDateFormatted = nextChangeDateTime.toRelative({
          base: DateTime.now(),
        });

        if (!isUnknown && !isOpen) {
          closesIn = t("Opens {nextChangeDateFormatted}", {
            nextChangeDateFormatted,
          });
        } else if (!isUnknown && isOpen) {
          closesIn = t("Closes {nextChangeDateFormatted}", {
            nextChangeDateFormatted,
          });
        } else if (isUnknown && !isOpen) {
          closesIn = t("Might open {nextChangeDateFormatted}", {
            nextChangeDateFormatted,
          });
        } else if (isUnknown && isOpen) {
          closesIn = t("Might close {nextChangeDateFormatted}", {
            nextChangeDateFormatted,
          });
        }
      }
      return { openState, closesIn, oh, niceString };
    } catch (e) {
      log.error(e);
      return { outputs: [] };
    }
  }, [lat, lon, country, state, value, tagKey]);

  const shownValue = ((niceString as string) || value)
    .replace(/\bMo\b/g, t("Monday"))
    .replace(/\bTu\b/g, t("Tuesday"))
    .replace(/\bWe\b/g, t("Wednesday"))
    .replace(/\bTh\b/g, t("Thursday"))
    .replace(/\bFr\b/g, t("Friday"))
    .replace(/\bSa\b/g, t("Saturday"))
    .replace(/\bSu\b/g, t("Sunday"))

    .replace(/\bJan\b/g, t("January"))
    .replace(/\bFeb\b/g, t("February"))
    .replace(/\bMar\b/g, t("March"))
    .replace(/\bApr\b/g, t("April"))
    .replace(/\bMay\b/g, t("May"))
    .replace(/\bJun\b/g, t("June"))
    .replace(/\bJul\b/g, t("July"))
    .replace(/\bAug\b/g, t("August"))
    .replace(/\bSep\b/g, t("September"))
    .replace(/\bOct\b/g, t("October"))
    .replace(/\bNov\b/g, t("November"))
    .replace(/\bDec\b/g, t("December"))

    .replace(/\bPH\b/g, t("public holiday"))
    .replace(/\boff\b/g, t("closed"))
    .replace(/\bSH\b/g, t("school holiday"))
    .replace(/,/g, ", ");

  const shownElements = shownValue.split(/;|\|\||\s*,\s*/);

  if (!closesIn && !openState) {
    return <Text size="2">{shownElements}</Text>;
  }

  return (
    <Flex direction="column" gap="3" pb="4">
      <Flex direction="row" gap="2">
        <Badge color="green" size="3" radius="full" highContrast>
          {openState}
        </Badge>
        <Text size="3">{closesIn}</Text>
      </Flex>

      <Flex direction="column" pr="3" pl="3">
        {shownElements.map((e) => (
          <Text key={e} size="3" color="gray">
            {e}
          </Text>
        ))}
      </Flex>

      {hoursUrl && (
        <a href={String(osmFeature.properties["opening_hours:url"])}>
          {t("See website")}.
        </a>
      )}
    </Flex>
  );
}

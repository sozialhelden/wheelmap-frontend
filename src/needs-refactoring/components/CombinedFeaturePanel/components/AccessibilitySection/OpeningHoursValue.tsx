import { t } from "@transifex/native";
import intersperse from "intersperse";
import { DateTime } from "luxon";
import opening_hours from "opening_hours";
import * as React from "react";
import { useAdminAreas } from "~/needs-refactoring/lib/fetchers/osm-api/fetchAdminAreas";
import {
  isOSMFeature,
  type TypeTaggedOSMFeature,
} from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { log } from "~/needs-refactoring/lib/util/logger";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";
import FeatureContext from "../FeatureContext";
import { Text } from "@radix-ui/themes";

function getReadableState(oh: opening_hours) {
  const outputs: string[] = [];
  const comment = oh.getComment();
  if (oh.getUnknown()) {
    const maybeOpen = t("Maybe open");
    const maybeOpenBut = t("Maybe open – {comment}", { comment });
    outputs.push(comment ? maybeOpenBut : maybeOpen);
  } else {
    const state = oh.getState();
    outputs.push(state ? t("Now open.") : t("Now closed."));
    if (comment) {
      outputs.push(t("(“{comment}”)"), { comment });
    }
  }
  return outputs;
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

  const { outputs, oh, niceString } = React.useMemo(() => {
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
      const outputs = getReadableState(oh);

      if (typeof nextChangeDate === "undefined")
        outputs.push(t("(indefinitely)"));
      else {
        const isUnknown = oh.getUnknown(nextChangeDate);
        const nextChangeDateTime = DateTime.fromJSDate(nextChangeDate);
        const nextChangeDateFormatted = nextChangeDateTime.toRelative({
          base: DateTime.now(),
        });

        if (!isUnknown && !isOpen) {
          outputs.push(
            t("Will open {nextChangeDateFormatted}.", {
              nextChangeDateFormatted,
            }),
          );
        } else if (!isUnknown && isOpen) {
          outputs.push(
            t("Will close {nextChangeDateFormatted}.", {
              nextChangeDateFormatted,
            }),
          );
        } else if (isUnknown && !isOpen) {
          outputs.push(
            t("Might open {nextChangeDateFormatted}.", {
              nextChangeDateFormatted,
            }),
          );
        } else if (isUnknown && isOpen) {
          outputs.push(
            t(
              "Might close {nextChangeDateFormatted}.",
              nextChangeDateFormatted,
            ),
          );
        }
      }
      return { outputs, oh, niceString };
    } catch (e) {
      log.error(e);
      return { outputs: [] };
    }
  }, [lat, lon, country, state, value, tagKey]);

  const niceLines = oh?.prettifyValue();
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

  const shownElements = intersperse(shownValue.split(/;|\|\|/), <br />);

  if (!outputs.length) {
    return <Text size="2">{shownElements}</Text>;
  }

  return (
    <div style={{ padding: "var(--space-1)" }}>
      <strong>
        <StyledMarkdown inline element="span">
          {outputs[0]}
        </StyledMarkdown>
      </strong>
      {outputs.length > 1 && (
        <>
          &nbsp;
          <StyledMarkdown inline element="span">
            {outputs.slice(1).join(" ")}
          </StyledMarkdown>
        </>
      )}
      &nbsp;
      {osmFeature?.properties["opening_hours:url"] && (
        <a href={String(osmFeature.properties["opening_hours:url"])}>
          {t("See website")}.
        </a>
      )}
      <div style={{ marginTop: "var(--space-2)", opacity: 0.8 }}>
        {shownElements}
      </div>
    </div>
  );
}

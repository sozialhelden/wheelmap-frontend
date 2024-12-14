import Color from "colorjs.io";
import type React from "react";
import { t } from "ttag";
import type {
  TypeTaggedOSMFeature,
  TypeTaggedPlaceInfo,
} from "../../../../lib/model/geo/AnyFeature";
import { classifyHSLColor } from "../../../../lib/util/classifyHSLColor";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import { useDarkMode } from "../../../shared/useDarkMode";
import AddWheelchairDescription from "./AddWheelchairDescription";
import DisplayedQuantity from "./DisplayedQuantity";
import OpeningHoursValue from "./OpeningHoursValue";
import { determineIfZerothLevelIsSkippedHere } from "./determineIfZerothLevelIsSkippedHere";

export type ValueRenderProps = {
  key: string;
  value: string | number;
  matches: RegExpMatchArray;
  languageTags: string[];
  osmFeature: TypeTaggedOSMFeature | undefined;
  accessibilityCloudFeature: TypeTaggedPlaceInfo | undefined;
  defaultValueLabel: string | undefined;
};

function BuildingLevel({
  defaultValueLabel,
  value,
  osmFeature,
  languageTags,
}: ValueRenderProps) {
  const featureProperties = osmFeature?.properties;
  // https://wiki.openstreetmap.org/wiki/Key:level#Level_designations
  if (featureProperties?.["level:ref"] || featureProperties?.["addr:floor"]) {
    // In case the level has a human-readable reference, we display it as a string so the UI
    // matches signs in the real world.
    return null;
  }

  const valueAsNumber =
    typeof value === "number" ? value : Number.parseFloat(value);

  const isUnderground = valueAsNumber < 0;
  if (isUnderground) {
    if (valueAsNumber === -1) {
      return <>{t`Basement floor`}</>;
    }
    return <>{t`Basement ${-1 * valueAsNumber}`}</>;
  }

  const skipZerothLevel = determineIfZerothLevelIsSkippedHere(languageTags);
  const localGroundFloorLevelDesignation = skipZerothLevel ? 1 : 0;
  const isGroundFloor = valueAsNumber === localGroundFloorLevelDesignation;
  if (isGroundFloor) {
    return <>{t`Ground floor`}</>;
  }
  const displayedLevel = skipZerothLevel ? valueAsNumber + 1 : valueAsNumber;

  return (
    <span>
      {defaultValueLabel} {displayedLevel}
    </span>
  );
}

function ColorContainer({
  children,
  backgroundColor,
  textColor,
}: { children: React.ReactNode; backgroundColor: string; textColor: string }) {
  return (
    <span style={{ display: "flex", gap: ".25rem", alignItems: "center" }}>
      <span
        lang="en"
        aria-label=""
        style={{
          backgroundColor,
          borderRadius: "0.5rem",
          boxShadow:
            "inset 0 0 1px rgba(196, 196, 196, 0.5), inset 0 2px 4px rgba(255, 255, 255, .2), 0 1px 10px rgba(0,0,0,.1)",
          width: "1.25rem",
          height: "1.25rem",
          lineHeight: "1rem",
          display: "inline-block",
        }}
      />
      <span style={{ color: textColor }}>{children}</span>
    </span>
  );
}
function DisplayedColor({ type, value }: { type: string; value: string }) {
  const isDarkMode = useDarkMode();
  try {
    const valueString = String(value);
    const color = new Color(valueString);
    const hslColor = color.to("hsl");
    const classifiedColor = valueString.match(/^\w+$/)
      ? valueString
      : classifyHSLColor(hslColor);
    const textColor = hslColor.mix(isDarkMode ? "white" : "black", 0.8, {
      space: "lch",
      outputSpace: "srgb",
    });
    const backgroundColor = hslColor.mix(isDarkMode ? "black" : "white", 0.8, {
      space: "lch",
      outputSpace: "srgb",
    });
    return (
      <ColorContainer
        backgroundColor={backgroundColor}
        textColor={textColor.toString({ precision: 3 })}
      >
        {String(classifiedColor)} {type}
      </ColorContainer>
    );
  } catch (error) {
    return value;
  }
}

/**
 * This file contains functions that render values of OSM tags in a human-readable way.
 * The functions are used in the {@link OSMTagTable} to display the values of OSM tags.
 *
 * The keys of the `valueRenderFunctions` object are regular expressions that match OSM tag keys.
 * The values are functions that take a {@link ValueRenderProps} object and return a React node.
 */

export const valueRenderFunctions: Record<
  string,
  (props: ValueRenderProps) => React.ReactNode
> = {
  "^wheelchair$": ({ defaultValueLabel }) => <div>{defaultValueLabel}</div>,
  "^addWheelchairDescription$": () => <AddWheelchairDescription />,
  "^opening_hours$": ({ key, value, osmFeature }) => (
    <OpeningHoursValue
      value={String(value)}
      osmFeature={osmFeature}
      tagKey={key}
    />
  ),
  "^opening_hours:(atm|covid19|drive_through|kitchen|lifeguard|office|pharmacy|reception|store|workshop|checkin|checkout)$":
    ({ key, value }) => (
      <OpeningHoursValue value={String(value)} tagKey={key} />
    ),
  "^service_times:?\\w*$": ({ key, value, osmFeature }) => (
    <OpeningHoursValue
      value={String(value)}
      osmFeature={osmFeature}
      tagKey={key}
    />
  ),

  ":step_height$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="cm" prefix={<>↕</>} />
  ),
  "^kerb:height$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="cm" prefix={<>↕</>} />
  ),
  "^entrance_width$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="cm" prefix={<>↔</>} />
  ),
  ":?width$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="m" prefix={<>↔</>} />
  ),
  ":?height$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="m" prefix={<>↕</>} />
  ),
  ":?depth$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="m" suffix={t`depth`} />
  ),
  ":?levels$": ({ value }) => (
    <DisplayedQuantity
      value={value}
      defaultUnit=""
      prefix={<>↕</>}
      suffix={t`levels`}
    />
  ),
  "^level$": (props) => <BuildingLevel {...props} />,
  "([\\w_]+):colour$": ({ matches, value }) => (
    <DisplayedColor type={matches[1]} value={String(value)} />
  ),
  "^power_supply:voltage$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="V" />
  ),
  "^power_supply:current$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="A" />
  ),
  "^power_supply:maxcurrent$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="A" />
  ),
  "^power_supply:frequency$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="Hz" />
  ),
  "^socket:([\\w_]+)$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="×" />
  ),
  "^(?:socket:([\\w_]+):)?amperage$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="A" />
  ),
  "^(?:socket:([\\w_]+):)?current$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="A" />
  ),
  "^(?:socket:([\\w_]+):)?maxamperage$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="A" />
  ),
  "^(?:socket:([\\w_]+):)?voltage$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="V" />
  ),
  "^(?:socket:([\\w_]+):)?output$": ({ value }) => (
    <DisplayedQuantity value={value} defaultUnit="W" />
  ),
  "^(?:([\\w_]+):)?description(?:(\\w\\w))?$": ({ value, matches }) => {
    const text = value;
    const targetGroup = matches[1];
    const lang = matches[2];
    const targetGroupMarker = {
      wheelchair: "🧑",
      hearing: "👂",
      blind: "👁",
    }[targetGroup];
    return (
      <StyledMarkdown lang={lang}>
        {t`${targetGroupMarker} “${text}”`}
      </StyledMarkdown>
    );
  },
};

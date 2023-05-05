import { AnchorButton, Button, HTMLTable } from "@blueprintjs/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import colors from "../../../../lib/colors";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LanguageTagContext";
import { useAccessibilityAttributesIdMap } from "../../../../lib/fetchers/fetchAccessibilityAttributes";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import StyledMarkdown from "../../../shared/StyledMarkdown";
import OpeningHoursValue from "./tags/values/OpeningHoursValue";

const StyledTable = styled.table`
  background-color: rgba(255, 255, 255, 1);
  margin: 1rem 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  border: 1px solid rgba(16, 22, 26, 0.15);
  color: ${colors.textColorTonedDownSlightly};
  tbody {

  }

  tr {

  }

  th {
    text-align: left;
    vertical-align: top;
    padding-right: 1rem;
  }

  td {

  }

  th, td {
    p:first-child {
      margin-top: 0;
    }
  }
`;

export default function OSMTagTable(props: {
  keys: string[];
  feature: TypeTaggedOSMFeature;
}) {
  const router = useRouter();
  const { ids, id } = router.query;

  return (
    <StyledTable>
      {props.keys.map((k) => (
        <OSMTagRow key={k} {...{ k, props, ids }} />
      ))}
    </StyledTable>
  );
}

type ValueRenderProps = {
  value: string;
  matches: RegExpMatchArray;
}

const valueRenderFunctions: Record<string, (props: ValueRenderProps) => React.ReactNode> = {
  opening_hours: (props) => <OpeningHoursValue value={props.value} />,
  "opening_hours:(atm|covid19|drive_through|kitchen|lifeguard|office|pharmacy|reception|store|workshop)": (props) => <OpeningHoursValue value={props.value} />,
  "wheelchair:description(?:(\w\w))?": (props) => {
    const text = props.value;
    const lang = props.matches[1];
    return <p lang={lang}>{t`“${text}”`}</p>;
  },
};

const editableKeys = new Set([
  "wheelchair",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
]);

const tagsWithoutDisplayedKey = new Set([
  // "wheelchair",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
]);

function OSMTagRow({ k: key, props, ids }: { k: string; props: { keys: string[]; feature: TypeTaggedOSMFeature; }; ids: string | string[]; }): JSX.Element {
  const appToken = useCurrentAppToken();
  const value = props.feature.properties[key];
  const languageTagStrings = useCurrentLanguageTagStrings();
  const { data: attributesById, isValidating } = useAccessibilityAttributesIdMap(languageTagStrings, appToken);
  const keyAttribute = attributesById?.get(`osm:${key}`);
  const valueAttribute = attributesById?.get(`osm:${key}=${value}`);
  const keyLabel = getLocalizedStringTranslationWithMultipleLocales(keyAttribute?.shortLabel, languageTagStrings) || getLocalizedStringTranslationWithMultipleLocales(keyAttribute?.label, languageTagStrings) || key;
  let valueLabel: string | React.ReactNode | undefined;
  const matchedKey = React.useMemo(() => Object.keys(valueRenderFunctions).find((renderFunctionKey) => key.match(renderFunctionKey)), [key]);
  const matches = matchedKey ? key.match(matchedKey) : undefined;
  if (valueRenderFunctions[matchedKey]) {
    valueLabel = valueRenderFunctions[matchedKey]({ value, matches });
  } else {
    valueLabel = getLocalizedStringTranslationWithMultipleLocales(valueAttribute?.label, languageTagStrings)
      || getLocalizedStringTranslationWithMultipleLocales(valueAttribute?.shortLabel, languageTagStrings)
      || value;
  }
  const summary = getLocalizedStringTranslationWithMultipleLocales(valueAttribute?.summary, languageTagStrings);
  const details = getLocalizedStringTranslationWithMultipleLocales(valueAttribute?.details, languageTagStrings);
  const shownDetailsLine = details || (!valueLabel && summary);
  const hasDisplayedKey = !tagsWithoutDisplayedKey.has(key);
  return <tbody key={key}>
    <tr>
      <th rowSpan={2}>{hasDisplayedKey && keyLabel}</th>

      {valueLabel && valueLabel !== '' && typeof valueLabel === 'string'
        ? <th><StyledMarkdown inline={true}>{valueLabel}</StyledMarkdown></th>
        : <td>{valueLabel}</td>}

      <td style={{ textAlign: 'right' }}>
        {editableKeys.has(key) && <AnchorButton aria-label={t`Edit`} icon="edit" minimal small  href={`/composite/${ids}/${props.feature._id}/${key}/edit`} />}
      </td>
    </tr>

    {shownDetailsLine && shownDetailsLine !== '' && <tr>
      <td colSpan={2}>
        <StyledMarkdown>
          {shownDetailsLine}
        </StyledMarkdown>
      </td>
    </tr>}
  </tbody>;
}

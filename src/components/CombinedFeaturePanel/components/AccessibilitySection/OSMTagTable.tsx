import { Button, HTMLTable } from "@blueprintjs/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import { useAccessibilityAttributesIdMap } from "../../../../lib/fetchers/fetchAccessibilityAttributes";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import { SKELETON } from "@blueprintjs/core/lib/esm/common/classes";
import { translatedStringFromObject } from "../../../../lib/i18n/translatedStringFromObject";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LocaleContext";

const StyledTable = styled(HTMLTable)`
  background-color: rgba(255, 255, 255, 1);
  margin: 1rem 0;
  border-radius: 0.5rem;
  padding: 0.25rem 0;
  border: 1px solid rgba(16, 22, 26, 0.15);
`;

// function humanizeOSMTag(tag: string) {
//   switch(tag) {
//     case 'wheelchair':
//       return t`Wheelchair accessibility`;
//     case 'wheelchair:description':
//       return t`Wheelchair accessibility description`;
//     case 'wheelchair:toilet':
//       return t`Wheelchair accessible toilet`;
//   // return humanizeThroughInflection(tag.replace(/:/g, ' '));
// }

const StyledTableBody = styled.tbody`
  border: none;
`;

export default function OSMTagTable(props: {
  keys: string[];
  feature: TypeTaggedOSMFeature;
}) {
  const router = useRouter();
  const { ids, id } = router.query;

  return (
    <StyledTable
      bordered={false}
      condensed={true}
      striped={false}
    >
      <StyledTableBody>
        {props.keys.map((k) => (
          <OSMTagRow key={k} {...{ k, props, ids }} />
        ))}
      </StyledTableBody>
    </StyledTable>
  );
}
function OSMTagRow({ k: key, props, ids }: { k: string; props: { keys: string[]; feature: TypeTaggedOSMFeature; }; ids: string | string[]; }): JSX.Element {
  const appToken = useCurrentAppToken();
  const value = props.feature.properties[key];
  const languageTagStrings = useCurrentLanguageTagStrings();
  const { data: attributesById, isValidating } = useAccessibilityAttributesIdMap(languageTagStrings, appToken);
  const keyAttribute = attributesById?.get(`osm:${key}`);
  const valueAttribute = attributesById?.get(`osm:${key}=${value}`);
  const keyLabel = getLocalizedStringTranslationWithMultipleLocales(keyAttribute?.label, languageTagStrings) || key;
  const valueLabel = getLocalizedStringTranslationWithMultipleLocales(valueAttribute?.label, languageTagStrings) || value;

  return <tr key={key}>
    <th>{keyLabel}</th>
    <td>{valueLabel}</td>
    <td>
      <Link href={`/composite/${ids}/${props.feature._id}/${key}/edit`}>
        <Button aria-label={t`Edit`} icon="edit" minimal small />
      </Link>
    </td>
  </tr>;
}


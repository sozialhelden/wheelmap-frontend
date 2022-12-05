import { t } from "ttag";
import * as React from "react";
import { TypeTaggedPlaceInfo } from "../../../../lib/model/shared/AnyFeature";
import { useSourceSWR } from "../../../../lib/fetchers/useSourceSWR";
import WorldIcon from "../../../icons/actions/World";
import Link from "next/link";

type Props = {
  feature?: TypeTaggedPlaceInfo;
};

export default function ExternalInfoAndEditPageLinks(props: Props) {
  const { feature } = props;
  const featureId = feature._id;
  const source = useSourceSWR(featureId);
  const sourceNameString = source.data?.name;
  const { editPageUrl, infoPageUrl } = feature.properties;

  return (
    <>
      {infoPageUrl && sourceNameString && (
        <li>
          <Link href={infoPageUrl}>
            <WorldIcon />
            {/* translator: Button caption in the place toolbar. Navigates to a place's details on an external page. */}
            <span>{t`Open on ${sourceNameString}`}</span>
          </Link>
        </li>
      )}

      {editPageUrl && editPageUrl !== infoPageUrl && (
        <li>
          <Link href={editPageUrl}>
            <WorldIcon />
            {/* translator: Button caption in the place toolbar. Navigates to a place's details on an external page. */}
            <span>{t`Add info on ${sourceNameString}`}</span>
          </Link>
        </li>
      )}
    </>
  );
}

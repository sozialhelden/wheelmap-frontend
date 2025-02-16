import Link from "next/link";
import { t } from "ttag";
import useDocumentSWR from "../../../../lib/fetchers/ac/useDocumentSWR";
import type { TypeTaggedPlaceInfo } from "../../../../lib/model/geo/AnyFeature";
import WorldIcon from "../../../icons/actions/World";
import { CaptionedIconButton } from "./CaptionedIconButton";

type Props = {
  feature?: TypeTaggedPlaceInfo;
};

export default function ExternalInfoAndEditPageLinks(props: Props) {
  const { feature } = props;
  const featureId = feature?._id;
  const source = useDocumentSWR({
    type: "ac:Source",
    cached: true,
    _id: featureId,
  });
  const sourceNameString = source.data?.name;
  const { editPageUrl, infoPageUrl } = feature?.properties ?? {};

  return (
    <>
      {infoPageUrl && sourceNameString && (
        <CaptionedIconButton
          href={infoPageUrl}
          icon={<WorldIcon />}
          caption={sourceNameString}
        />
      )}

      {editPageUrl && editPageUrl !== infoPageUrl && (
        <CaptionedIconButton
          href={editPageUrl}
          icon={<WorldIcon />}
          caption={t`Edit on ${sourceNameString}`}
        />
      )}
    </>
  );
}

import { t } from "@transifex/native";
import Link from "next/link";
import useDocumentSWR from "~/needs-refactoring/lib/fetchers/ac/useDocumentSWR";
import type ISource from "~/needs-refactoring/lib/model/ac/ISource";
import type { TypeTaggedPlaceInfo } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import WorldIcon from "../../../../../components/icons/actions/World";

type Props = {
  feature?: TypeTaggedPlaceInfo;
};

export default function ExternalInfoAndEditPageLinks(props: Props) {
  const { feature } = props;
  const featureId = feature._id;
  const source = useDocumentSWR<ISource>({
    collectionName: "Sources",
    _id: featureId,
  });
  const sourceNameString = source.data?.name;
  const { editPageUrl, infoPageUrl } = feature.properties;

  return (
    <>
      {infoPageUrl && sourceNameString && (
        <li>
          <Link href={infoPageUrl}>
            <WorldIcon />
            {/* translator: Button caption in the place toolbar. Navigates to a place's details on an external page. */}
            <span>{t("Open on {sourceNameString}", { sourceNameString })}</span>
          </Link>
        </li>
      )}

      {editPageUrl && editPageUrl !== infoPageUrl && (
        <li>
          <Link href={editPageUrl}>
            <WorldIcon />
            {/* translator: Button caption in the place toolbar. Navigates to a place's details on an external page. */}
            <span>
              {t("Add info on {sourceNameString}", { sourceNameString })}
            </span>
          </Link>
        </li>
      )}
    </>
  );
}

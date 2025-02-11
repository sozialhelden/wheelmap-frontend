import { uniq } from "lodash";
import Link from "next/link";
import { t } from "ttag";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import PhoneIcon from "../../../icons/actions/Phone";
import { CaptionedIconButton } from "./CaptionedIconButton";

type Props = {
  feature: AnyFeature;
};

function SinglePhoneNumberLink({
  phoneNumber,
  extraInfo,
}: {
  phoneNumber: string;
  extraInfo?: string;
}) {
  return (
    <CaptionedIconButton
      href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
      icon={<PhoneIcon />}
      caption={t`Call`}
      extraInfo={extraInfo}
    />
  );
}

export default function PhoneNumberLinks({ feature }: Props) {
  let phoneNumber: string | undefined;
  let mobilePhoneNumbers: string[] | undefined;

  if (feature["@type"] === "osm:Feature") {
    phoneNumber = (feature.properties["contact:phone"] ||
      feature.properties.phone) as string | undefined;
    mobilePhoneNumbers = uniq(
      (
        (feature.properties["contact:mobile"] || feature.properties.mobile) as
          | string
          | undefined
      )?.split(/[;,]\s*/) || [],
    );
  } else if (
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "ac:PlaceInfo"
  ) {
    phoneNumber = feature.properties.phoneNumber;
  }

  if (typeof phoneNumber !== "string") return null;

  return (
    <>
      {phoneNumber && <SinglePhoneNumberLink phoneNumber={phoneNumber} />}
      {mobilePhoneNumbers?.map((mobilePhoneNumber) => (
        <SinglePhoneNumberLink
          key={mobilePhoneNumber}
          phoneNumber={mobilePhoneNumber}
          extraInfo={t`Mobile`}
        />
      ))}
    </>
  );
}

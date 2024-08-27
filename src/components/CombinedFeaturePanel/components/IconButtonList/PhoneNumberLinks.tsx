import { uniq } from 'lodash'
import Link from 'next/link'
import { t } from 'ttag'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'
import PhoneIcon from '../../../icons/actions/Phone'

type Props = {
  feature: AnyFeature | null;
};

function SinglePhoneNumberLink({
  phoneNumber,
  extraInfo,
}: {
  phoneNumber: string;
  extraInfo?: string;
}) {
  return (
    <li>
      <Link href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}>
        <PhoneIcon />
        <span>
          {t`Call ${phoneNumber}`}
          {extraInfo && ` (${extraInfo})`}
        </span>
      </Link>
    </li>
  )
}

export default function PhoneNumberLinks(props: Props) {
  const { feature } = props
  let phoneNumber: string | undefined
  let mobilePhoneNumbers: string[] | undefined
  if (feature['@type'] === 'osm:Feature') {
    phoneNumber = feature.properties['contact:phone'] || feature.properties.phone
    mobilePhoneNumbers = uniq(
      (
        feature.properties['contact:mobile'] || feature.properties.mobile
      )?.split(/[;,]\s*/) || [],
    )
  } else if (feature['@type'] === 'a11yjson:PlaceInfo') {
    phoneNumber = feature.properties.phoneNumber
  }

  if (typeof phoneNumber !== 'string') return null

  return (
    <>
      {phoneNumber && <SinglePhoneNumberLink phoneNumber={phoneNumber} />}
      {mobilePhoneNumbers.map((mobilePhoneNumber) => (
        <SinglePhoneNumberLink
          key={mobilePhoneNumber}
          phoneNumber={mobilePhoneNumber}
          extraInfo={t`Mobile`}
        />
      ))}
    </>
  )
}

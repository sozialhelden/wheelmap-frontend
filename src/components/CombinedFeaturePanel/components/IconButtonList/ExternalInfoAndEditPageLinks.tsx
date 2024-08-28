import Link from 'next/link'
import { t } from 'ttag'
import { TypeTaggedPlaceInfo } from '../../../../lib/model/geo/AnyFeature'
import WorldIcon from '../../../icons/actions/World'
import ISource from '../../../../lib/model/ac/ISource'
import useDocumentSWR from '../../../../lib/fetchers/ac/useDocumentSWR'

type Props = {
  feature?: TypeTaggedPlaceInfo;
};

export default function ExternalInfoAndEditPageLinks(props: Props) {
  const { feature } = props
  const featureId = feature._id;
  const source = useDocumentSWR<ISource>({ collectionName: 'Sources', _id: featureId });
  const sourceNameString = source.data?.name
  const { editPageUrl, infoPageUrl } = feature.properties

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
  )
}

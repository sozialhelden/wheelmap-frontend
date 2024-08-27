import MockedPOIDetails from '../../../../lib/fixtures/mocks/features/MockedPOIDetails'
import {
  AnyFeature,
  TypeTaggedEquipmentInfo,
} from '../../../../lib/model/geo/AnyFeature'

type Props = {
  equipmentInfo: TypeTaggedEquipmentInfo | AnyFeature;
};

// TODO implement or remove this
export default function EquipmentInfoDetails(props: Props) {
  const { equipmentInfo } = props
  return (
    <MockedPOIDetails feature={equipmentInfo} description="EquipmentInfo" />
  )
}

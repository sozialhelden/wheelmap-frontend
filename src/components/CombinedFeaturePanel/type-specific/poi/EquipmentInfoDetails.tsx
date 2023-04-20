import React from "react";

import {
  AnyFeature,
  TypeTaggedEquipmentInfo,
} from "../../../../lib/model/shared/AnyFeature";
import MockedPOIDetails from "../../../../lib/fixtures/mocks/features/MockedPOIDetails";
type Props = {
  equipmentInfo: TypeTaggedEquipmentInfo | AnyFeature;
};

// TODO implement or remove this
export default function EquipmentInfoDetails(props: Props) {
  const { equipmentInfo } = props;
  return (
    <MockedPOIDetails feature={equipmentInfo} description="EquipmentInfo" />
  );
}

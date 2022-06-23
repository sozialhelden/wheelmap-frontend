import { UL } from "@blueprintjs/core";
import { LIST_UNSTYLED } from "@blueprintjs/core/lib/esm/common/classes";
import { uniqBy } from "lodash";
import React from "react";
import { Popup } from "react-map-gl";
import { FeatureId } from "../../model/Feature";
import FeatureDetails from "./details/FeatureDetails";

type Props = {
  featureIds: FeatureId[];
  latitude: number;
  longitude: number;
  onClose?: () => void;
};

export default function FeatureListPopup(props: Props) {
  const { featureIds } = props;
  const uniquefeatureIds = uniqBy(featureIds, (f) => f.id);
  const content = (
    <UL className={LIST_UNSTYLED}>
      {uniquefeatureIds.map((featureId) => (
        <li
          className={LIST_UNSTYLED}
          key={`${featureId.source}/${featureId.id}`}
        >
          <FeatureDetails featureId={featureId} />
        </li>
      ))}
    </UL>
  );

  return (
    <Popup
      latitude={props.latitude}
      longitude={props.longitude}
      closeButton={true}
      closeOnClick={false}
      onClose={props.onClose}
      anchor="top"
    >
      {content}
    </Popup>
  );
}

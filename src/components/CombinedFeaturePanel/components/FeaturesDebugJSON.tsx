import { Button } from "@blueprintjs/core";
import { omit } from "lodash";
import { AnyFeature } from "../../../lib/model/shared/AnyFeature";
import { Popover2 } from "@blueprintjs/popover2";
import styled from "styled-components";

const Pre = styled.pre`
  margin: 0;
  padding: 1rem;
`;

export default function FeaturesDebugJSON(props: { features: AnyFeature[] }) {
  const json = <Pre>
    {JSON.stringify(
      props.features.map((f) =>
        omit(f, "geometry.coordinates", "centroid", "type")
      ),
      null,
      2
    )}
  </Pre>;

  return (
    <Popover2 content={json} lazy={true}  minimal={true}>
      <Button intent="none" text="JSON" />
    </Popover2>
  );
}

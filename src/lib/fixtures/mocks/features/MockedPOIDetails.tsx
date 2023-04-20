import React from "react";
import { fixtureDivStyle } from "../styles";
import { AnyFeature } from "../../../model/shared/AnyFeature";

type Props = {
  feature?: AnyFeature | any;
  relation?: any;
  description: string;
  heading?: string;
};

export default function MockedPOIDetails(props: Props) {
  const { feature, relation, description, heading } = props;
  return (
    <>
      <header>{heading}</header>
      <div style={fixtureDivStyle}>
        <p>This is: {description}</p>
        <section>
          <pre>{JSON.stringify(feature ? feature : relation, null, 2)}</pre>
        </section>
      </div>
    </>
  );
}

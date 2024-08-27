import { AnyFeature } from '../../../model/geo/AnyFeature';
import { fixtureDivStyle } from '../styles';

type Props = {
  feature?: AnyFeature | any;
  relation?: any;
  description: string;
  heading?: string;
};

export default function MockedPOIDetails(props: Props) {
  const {
    feature, relation, description, heading,
  } = props;
  return (
    <>
      <header>{heading}</header>
      <div style={fixtureDivStyle}>
        <p>
          This is:
          {description}
        </p>
        <p>In case of error a default element is shown</p>
        <section>
          <pre>{JSON.stringify(feature || relation, null, 2)}</pre>
        </section>
      </div>
    </>
  );
}

import Link from "next/link";
import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { dataSourceCache } from "../../../../lib/cache/DataSourceCache";
import { TypeTaggedPlaceInfo } from "../../../../lib/model/shared/AnyFeature";
import WorldIcon from "../../../icons/actions/World";

export type PropertyName = "infoPageUrl" | "editPageUrl";

type Props = {
  feature: TypeTaggedPlaceInfo;
  className?: string;
  knownSourceNameCaption: (value: string) => string;
  propertyName: PropertyName;
  appToken: string;
};

const defaultState: State = { sourceName: null };

class SourceLink extends React.Component<Props, State> {
  props: Props;
  state: State = defaultState;

  fetchSource(props: Props) {
    if (!props.properties || !props.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    dataSourceCache
      .getDataSourceWithId(
        String(props.properties.sourceId),
        this.props.appToken
      )
      .then(
        (source) => {
          if (source && typeof source.name === "string") {
            this.setState({ sourceName: source.name });
          } else {
            this.setState(defaultState);
          }
        },
        () => {
          this.setState(defaultState);
        }
      );
  }

  componentDidMount() {
    this.fetchSource(this.props);
  }

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    this.fetchSource(newProps);
  }

  render() {
    const { feature, className } = this.props;
    const href = properties[this.props.propertyName];
    if (!href) return null;
    if (!href.match(/^https?:\/\//i)) {
      return null;
    }

    const sourceName = this.state.sourceName;
    const sourceNameString = String(sourceName);

    // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
    const unknownSourceNameCaption = t`Details`;
    const knownSourceNameCaption = this.props.knownSourceNameCaption(
      sourceNameString
    );

    const caption = sourceName
      ? knownSourceNameCaption
      : unknownSourceNameCaption;

    return (

    );
  }
}

const StyledSourceLink = styled(SourceLink)`
  margin-top: 0.5em;
`;

export default StyledSourceLink;

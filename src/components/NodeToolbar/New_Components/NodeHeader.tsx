import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import colors from "../../../lib/colors";
import BreadCrumbs from "../BreadCrumbs";
import { PlaceNameH1 } from "../../shared/PlaceName";
import ChevronRight from "../../shared/ChevronRight";
import { t } from "ttag/types";

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -0.1rem;
  height: 0.9rem;
`;

export const StyledNodeHeader = styled.header`
  /**
    This is necessary to make the sticky header get a shadow that extends from the whole panel's
    margin.
  */
  margin: -8px -16px 8px -16px;
  padding: 8px 16px;
  display: flex;
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);
  background-color: ${colors.colorizedBackgroundColor};

  ${PlaceNameH1} {
    flex-grow: 2;
  }
`;

const StyledBreadCrumbs = styled(BreadCrumbs).attrs({ hasPadding: false })`
  margin-left: ${(props) => (props.hasPadding ? "42" : "0")}px;
  font-size: 16px;
  margin-top: 8px;
`;

const PlaceNameDetail = styled.div`
  margin-top: 0.5rem;
  color: ${colors.textMuted};
  font-size: 1rem;
`;

function getRoomNumberString(roomNumber: string) {
  // TODO Fix ttag import module error: t`Room ${roomNumber}`
  return t`Room ${roomNumber}`;
}

const NodeHeader = () => {
  return (
    <>
      <div>new node header</div>
    </>
  );
};

export default NodeHeader;

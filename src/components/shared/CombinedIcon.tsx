import isEqual from "lodash/isEqual";
import styled, { CSSProperties } from "styled-components";

import { YesNoLimitedUnknown, YesNoUnknown } from "../../lib/model/ac/Feature";
import { isAccessibilityFiltered } from "../../lib/model/ac/filterAccessibility";
import ToiletStatusAccessible from "../icons/accessibility/ToiletStatusAccessible";
import Icon from "./Icon";

type Props = {
  accessibilityFilter?: YesNoLimitedUnknown[];
  toiletFilter?: YesNoUnknown[];
  category?: string | null;
  isMainCategory?: boolean;
  className?: string;
  style?: CSSProperties;
  showUnfilteredAccessibilityAsAllIcons?: boolean;
};

function CombinedIcon(props: Props) {
  if (!props.accessibilityFilter) return null;

  const showUnfilteredAccessibilityAsAllIcons = props.showUnfilteredAccessibilityAsAllIcons ?? false;

  let accessibilities: YesNoLimitedUnknown[];
  if (isAccessibilityFiltered(props.accessibilityFilter)) {
    accessibilities = props.accessibilityFilter;
  } else {
    accessibilities = showUnfilteredAccessibilityAsAllIcons
      ? ["yes", "limited", "no", "unknown"]
      : [null];
  }

  return (
    <div aria-hidden className={props.className} style={props.style}>
      {accessibilities.map((accessibility) => (
        <Icon
          key={accessibility}
          accessibility={accessibility}
          category={props.category}
          isMainCategory={props.isMainCategory}
          size="medium"
        />
      ))}
      {isEqual(props.toiletFilter, ["yes"]) ? (
        <ToiletIcon>
          <ToiletStatusAccessible />
        </ToiletIcon>
      ) : null}
    </div>
  );
}

const ToiletIcon = styled.figure``;

export default styled(CombinedIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;

  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  figure {
    line-height: 0;
  }

  figure + figure {
    margin-left: -30px;
  }

  figure:nth-child(1) {
    z-index: 3;
  }

  figure:nth-child(2) {
    z-index: 2;
    transform: scale(0.95, 0.95);

    .icon {
      display: none;
    }
  }

  figure:nth-child(3) {
    z-index: 1;
    transform: scale(0.9, 0.9);

    .icon {
      display: none;
    }
  }

  figure:nth-child(4) {
    z-index: 0;
    transform: scale(0.85, 0.85);

    .icon {
      display: none;
    }
  }

  figure${ToiletIcon} {
    z-index: 3;
    margin: 0 0 0 -13px;

    &:nth-child(3) {
      margin-left: -18px;
    }
  }

  figure.add-stroke svg.background {
    circle,
    path {
      stroke-width: 1.2px;
      stroke: white;
    }
  }
`;

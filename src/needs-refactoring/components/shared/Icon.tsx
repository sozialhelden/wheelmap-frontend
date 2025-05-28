import type * as React from "react";
import styled from "styled-components";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { log } from "~/needs-refactoring/lib/util/logger";
import * as markers from "src/needs-refactoring/components/icons/markers";

type Size = "big" | "medium" | "small";

type ContainerProps = {
  size: Size;
  withArrow?: boolean;
  accessibility?: YesNoLimitedUnknown;
  foregroundColor?: string;
  backgroundColor?: string;
};

type Props = ContainerProps & {
  category?: string;
  isMainCategory?: boolean;
  className?: string;
  shadowed?: boolean;
  children?: React.ReactNode;
  containerHTMLAttributes?: React.HTMLAttributes<HTMLElement>;
  markerHTMLAttributes?: React.HTMLAttributes<SVGSVGElement>;
  iconHTMLAttributes?: React.HTMLAttributes<SVGSVGElement>;
};

function width(size: Size = "medium") {
  return {
    big: 60,
    medium: 40,
    small: 25,
  }[size];
}

function fontSize(size: Size = "medium") {
  return {
    big: 32,
    medium: 24,
    small: 14,
  }[size];
}

function convertYesNoLimitedToRating(yesNoLimited: YesNoLimitedUnknown) {
  return {
    yes: "good",
    no: "bad",
    limited: "mediocre",
    unknown: "unknown",
  }[yesNoLimited];
}

export const StyledIconContainer = styled.div.attrs({})<ContainerProps>`
  position: relative;
  margin: 0;

  width: ${(props) => width(props.size)}px;
  min-width: ${(props) => width(props.size)}px;
  height: ${(props) => width(props.size)}px;
  font-size: ${(props) => width(props.size)}px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  > .foreground {
    z-index: 300;
    font-size: ${(props) => fontSize(props.size)}px;
    color: var(${(props) => (props.accessibility ? `--rating-${convertYesNoLimitedToRating(props.accessibility)}` : "--accent")});
  } 

  > small {
    position: absolute;
    bottom: 1px;
    right: 1px;
    font-size: 8px;
  }

  svg {
    &.background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

      g,
      polygon,
      path,
      circle,
      rect {
        fill: ${(props) =>
          props.accessibility
            ? `var(--rating-${convertYesNoLimitedToRating(props.accessibility)})`
            : props.backgroundColor || "var(--accent-a3)"};
      }
    }

    &.icon {
      position: relative;
      width: 60%;
      height: 60%;

      g,
      polygon,
      path,
      circle,
      rect {
        fill: ${(props) =>
          props.accessibility
            ? `var(--rating-${convertYesNoLimitedToRating(props.accessibility)}-contrast)`
            : props.foregroundColor || "var(--accent-12)"};
      }
    }
  }
`;

// @TODO Rename it to CategoryIcon
export default function Icon({
  accessibility,
  children,
  backgroundColor,
  foregroundColor,
  category,
  className,
  size,
  withArrow,
  containerHTMLAttributes,
  markerHTMLAttributes,
  iconHTMLAttributes,
}: Props) {
  let iconName = category;

  if (iconName === "2nd_hand") {
    iconName = "second_hand";
  }

  // const CategoryIconComponent == categories[]
  const MarkerComponent =
    markers[`${String(accessibility)}${withArrow ? "With" : "Without"}Arrow`];

  if (typeof CategoryIconComponent === "object") {
    // eslint-disable-next-line no-console
    log.log(
      "Found a CategoryIconComponent that was an object, but should not be.",
    );
  }

  return (
    <StyledIconContainer
      size={size}
      className={className}
      accessibility={accessibility}
      backgroundColor={backgroundColor}
      foregroundColor={foregroundColor}
      {...containerHTMLAttributes}
    >
      {accessibility && MarkerComponent ? (
        <MarkerComponent
          className="background"
          fill={backgroundColor}
          {...markerHTMLAttributes}
        />
      ) : null}
      {children}
      {CategoryIconComponent ? (
        <CategoryIconComponent className="icon" {...iconHTMLAttributes} />
      ) : null}
    </StyledIconContainer>
  );
}

StyledIconContainer.displayName = "StyledIconContainer";

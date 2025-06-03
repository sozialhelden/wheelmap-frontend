import { type BoxProps, Button, Flex } from "@radix-ui/themes";
import intersperse from "intersperse";
import { compact, uniq } from "lodash";
import * as React from "react";
import styled from "styled-components";
import { unknownCategory } from "~/modules/categories/utils/cache";
import { isWheelchairAccessible } from "~/needs-refactoring/lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import ChevronRight from "~/needs-refactoring/components/shared/ChevronRight";
import Icon from "~/needs-refactoring/components/shared/Icon";
import {
  PlaceNameH1,
  PlaceNameH2,
} from "~/needs-refactoring/components/shared/PlaceName";
import { useFeatureLabel } from "../utils/useFeatureLabel";

const Container = styled(Flex)`
    flex-direction: column;
    order: 1;
    @media (min-width: 576px) {
        order: 2;
    }
`;

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -0.1rem;
  height: 0.9rem;
`;

const PlaceNameDetail = styled.div`
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

type Props = BoxProps & {
  feature: AnyFeature;
  onClickCurrentMarkerIcon?: (feature: AnyFeature) => void;
  onHeaderClicked?: () => void;
  children?: React.ReactNode;
  size?: "small" | "medium" | "big";
  iconSize?: "small" | "medium" | "big";
};

export default function FeatureNameHeader(props: Props) {
  const {
    feature,
    children,
    onClickCurrentMarkerIcon,
    onHeaderClicked,
    size,
    iconSize,
    ...boxProps
  } = props;

  const handleMarkerClick = React.useCallback(() => {
    if (feature && onClickCurrentMarkerIcon) {
      onClickCurrentMarkerIcon(feature);
    }
  }, [feature, onClickCurrentMarkerIcon]);

  const {
    parentPlaceName,
    levelName,
    roomNameAndNumber,
    placeName,
    hasLongName,
    ariaLabel,
    categoryName,
    buildingName,
    buildingNumber,
    category,
    categoryTagKeys,
    ref,
    localRef,
  } = useFeatureLabel({
    feature,
  });

  if (!feature) return null;
  const { properties } = feature;
  if (!properties) return null;

  const icon = (
    <Icon
      accessibility={isWheelchairAccessible(feature)}
      category={
        (category && category !== unknownCategory
          ? category._id
          : categoryTagKeys[0]) || "undefined"
      }
      size={iconSize || "medium"}
    />
  );

  const nameElements = uniq(
    compact([
      parentPlaceName?.trim(),
      levelName?.trim(),
      roomNameAndNumber?.trim(),
      placeName?.trim(),
    ]),
  );

  const lastNameElement = nameElements[nameElements.length - 1];
  const parentElements = intersperse(
    nameElements.slice(0, nameElements.length - 1),
    <StyledChevronRight />,
  );

  const refNames = uniq(
    compact([
      !placeName?.match(String(buildingName)) && buildingName?.trim(),
      !buildingName?.match(String(buildingNumber)) && buildingNumber?.trim(),
      ref?.trim().replace(/;/, " / "),
      localRef?.trim().replace(/;/, " / "),
    ]),
  );

  const HeaderElement = size === "small" ? PlaceNameH2 : PlaceNameH1;
  const detailFontSize = size === "small" || lastNameElement ? "0.9em" : "1em";
  const categoryElement = categoryName &&
    !lastNameElement
      ?.toLocaleLowerCase()
      .match(categoryName?.toLocaleLowerCase()) && (
      <PlaceNameDetail style={{ fontSize: detailFontSize }}>
        {categoryName} {refNames.join(" / ")}
      </PlaceNameDetail>
    );
  const placeNameElement = (
    <HeaderElement isSmall={hasLongName} aria-label={ariaLabel}>
      <Button variant="ghost" onClick={handleMarkerClick}>
        {icon}
      </Button>
      <div>
        {lastNameElement && (
          <div>{intersperse(lastNameElement.split(/;/), <br />)}</div>
        )}
        {categoryElement}
        {nameElements.length > 1 && (
          <PlaceNameDetail style={{ fontSize: detailFontSize }}>
            {parentElements}
          </PlaceNameDetail>
        )}
      </div>
    </HeaderElement>
  );

  return (
    <Container onClick={onHeaderClicked} {...boxProps}>
      {placeNameElement}
      {children}
    </Container>
  );
}

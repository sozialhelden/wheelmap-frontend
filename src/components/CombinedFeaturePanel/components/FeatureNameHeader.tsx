import intersperse from "intersperse";
import { compact, uniq } from "lodash";
import * as React from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../../lib/context/LanguageTagContext";
import { isWheelchairAccessible } from "../../../lib/model/accessibility/isWheelchairAccessible";
import type { AnyFeature } from "../../../lib/model/geo/AnyFeature";
import ChevronRight from "../../shared/ChevronRight";
import Icon from "../../shared/Icon";
import { PlaceNameH1, PlaceNameH2 } from "../../shared/PlaceName";
import { useFeatureLabel } from "../utils/useFeatureLabel";
import { Box, Button } from "@radix-ui/themes";
import {unknownCategory} from "~/domains/categories/functions/cache";

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -0.1rem;
  height: 0.9rem;
`;

const PlaceNameDetail = styled.div`
  &:not(:first-child) {
    margin-top: 0.5rem;
  }
`;

type Props = {
  feature: AnyFeature;
  onClickCurrentMarkerIcon?: (feature: AnyFeature) => void;
  onHeaderClicked?: () => void;
  children?: React.ReactNode;
  size?: "small" | "medium" | "big";
};

export default function FeatureNameHeader(props: Props) {
  const { feature, children, onClickCurrentMarkerIcon, onHeaderClicked } =
    props;

  const handleMarkerClick = React.useCallback(() => {
    if (feature && onClickCurrentMarkerIcon) {
      onClickCurrentMarkerIcon(feature);
    }
  }, [feature, onClickCurrentMarkerIcon]);

  const languageTags = useCurrentLanguageTagStrings();

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
    languageTags,
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
      size={props.size || "medium"}
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

  const HeaderElement = props.size === "small" ? PlaceNameH2 : PlaceNameH1;
  const detailFontSize =
    props.size === "small" || lastNameElement ? "0.9em" : "1em";
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
    <Box onClick={onHeaderClicked}>
      {placeNameElement}
      {children}
    </Box>
  );
}

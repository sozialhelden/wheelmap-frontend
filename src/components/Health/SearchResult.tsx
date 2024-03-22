import React from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useCategory from "../../lib/fetchers/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getLocalizableCategoryName } from "../../lib/model/ac/categories/Categories";
import { formatDistance } from "../../lib/model/formatDistance";
import { Phone, Place, World } from "../icons/actions";
import { MapPinIcon } from "../icons/ui-elements";
import AccessibilityFilterButtonOnClick from "./AccessibilityFilterButtonOnClick";
import { getWheelchairSettings } from "./helpers";
import { StyledH3, StyledH4, StyledLink } from "./styles";

const StyledCard = styled.a`
  text-decoration: none !important;
`;

function SearchResult({ data }: any) {
  const { centroid, properties, _id, distance } = data;
  const { name, healthcare, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair } = properties;
  const lat = centroid.coordinates[1];
  const lon = centroid.coordinates[0];

  const customAddress = {
    street: street ? street : "",
    housenumber: housenumber ? housenumber : "",
    postcode: postcode ? postcode : "",
    city: city ? city : "",
  };

  const customContact = {
    website: website ? website : "",
    phone: phone ? phone : "",
  };

  const { unit: distanceUnit, distance: distanceValue } = formatDistance(distance);


  const dataAsOSMFeature = React.useMemo(() => ({ ...data, "@type": 'osm:Feature' }), [data]);
  const { category } = useCategory(dataAsOSMFeature);
  const languageTags = useCurrentLanguageTagStrings();
  const categoryName = React.useMemo(() => {
    const localizableCategoryName =
      category && getLocalizableCategoryName(category);
    return localizableCategoryName &&
      getLocalizedStringTranslationWithMultipleLocales(
        localizableCategoryName,
        languageTags
      );
  }, [category, languageTags]);

  const optionalCategoryName = React.useMemo(() => {
    if (category?._id === 'unknown') {
      return healthcare;
    }
    if (name) {
      if (name.match(categoryName, 'i')) {
        return undefined;
      }
      const isDoctor = (category._id === 'doctor' || category._id === 'doctors');
      if (name.match(/Dr\./) && isDoctor) {
        return undefined;
      }
      if (name.match(/MD/) && isDoctor) {
        return undefined;
      }
      if (name.match(/M\.D\./) && isDoctor) {
        return undefined;
      }
    }
    return categoryName;
  }, [category, categoryName])

  return (
    <StyledCard href={`https://wheelmap.org/${_id}`} target="_blank">
      <div style={{ lineHeight: "2.2rem" }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <StyledH3 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
            <AccessibilityFilterButtonOnClick accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} caption={name ? name : healthcare} category={healthcare} />
          </StyledH3>

          {distance && (
            <span style={{ float: "right" }}>
              <StyledH4 $fontBold>
              {optionalCategoryName} <MapPinIcon />
              {distanceValue} {distanceUnit}
              </StyledH4>
            </span>
          )}
        </div>

        {customAddress.street && (
          <>
            <StyledLink href={"https://www.google.com/maps/search/?api=1&query=" + lat + "," + lon} target="_blank">
              <Place />
              &nbsp;
              {[customAddress.street, customAddress.housenumber, customAddress.postcode, customAddress.city].join(" ")}
            </StyledLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </>
        )}
        {customContact.phone && (
          <>
            <StyledLink href={"tel:" + customContact.phone} target="_blank">
              <Phone />
              &nbsp;{customContact.phone}
            </StyledLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </>
        )}
        {customContact.website && (
          <StyledLink href={customContact.website} target="_blank">
            <World />
            &nbsp;
            {customContact.website.split("/")[2]}
          </StyledLink>
        )}
      </div>
    </StyledCard>
  );
}

export default SearchResult;

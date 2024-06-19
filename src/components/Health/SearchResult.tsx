import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useCategory from "../../lib/fetchers/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getLocalizableCategoryName } from "../../lib/model/ac/categories/Categories";
import { formatDistance } from "../../lib/model/formatDistance";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import { Phone, Place, World } from "../icons/actions";
import { ExternalLinkIcon, MapPinIcon } from "../icons/ui-elements";
import { getWheelchairSettings } from "./helpers";
import { StyledButtonAsLink, StyledH3, StyledH4, StyledHDivider, StyledLink, containerSpacing } from "./styles";

function SearchResult({ data }: any) {
  const { centroid, properties, _id, distance } = data;
  const route = useRouter();
  const { name, healthcare, amenity, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair, ["toilets:wheelchair"]: toiletsWheelchair } = properties;
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

  const dataAsOSMFeature = React.useMemo(() => ({ ...data, "@type": "osm:Feature" }), [data]);
  const { category } = useCategory(dataAsOSMFeature);
  const languageTags = useCurrentLanguageTagStrings();
  const categoryName = React.useMemo(() => {
    const localizableCategoryName = category && getLocalizableCategoryName(category);
    return localizableCategoryName && getLocalizedStringTranslationWithMultipleLocales(localizableCategoryName, languageTags);
  }, [category, languageTags]);

  const optionalCategoryName = React.useMemo(() => {
    if (category?._id === "unknown") {
      return healthcare;
    }
    if (name) {
      if (name.match(categoryName, "i")) {
        return undefined;
      }
      const isDoctor = category?._id === "doctor" || category?._id === "doctors";
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
  }, [category, categoryName]);

  const isMainCategory = true;
  const toiletFilter = toiletsWheelchair ? [toiletsWheelchair] : [];
  const accessibilityFilter = wheelchair ? [wheelchair] : [];

  return (
    <>
      <StyledH4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <AccessibilityFilterButton isDisabled accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} caption="" category={healthcare} toiletFilter={toiletsWheelchair ? [toiletsWheelchair] : []} onFocus={null} isActive={null} isNotHoverAble={true} showCloseButton={false} />
          </div>
          <div style={{ paddingInline: containerSpacing }}>
            {optionalCategoryName} <MapPinIcon /> {distanceValue} {distanceUnit} {route.query.srot === "distance" ? <T _str="from your location" /> : <T _str={`from the center of ${route.query.city}`} />}
          </div>
        </div>
      </StyledH4>
      <StyledLink>
        <>
          <StyledH3 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
            <Link href={`https://wheelmap.org/${_id}`} target="_blank">
              {name ? name : healthcare} <ExternalLinkIcon />
            </Link>
          </StyledH3>
        </>

        {customAddress.street && (
          <>
            <StyledButtonAsLink href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank">
              <Place />
              &nbsp;
              {[customAddress.street, customAddress.housenumber, customAddress.postcode, customAddress.city].join(" ")}
            </StyledButtonAsLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </>
        )}
        <StyledHDivider $space={0} />
        {customContact.phone && (
          <>
            <StyledButtonAsLink href={`tel:${customContact.phone}`} target="_blank">
              <Phone />
              &nbsp;{customContact.phone}
            </StyledButtonAsLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </>
        )}
        {customContact.website && (
          <StyledButtonAsLink href={`${customContact.website}`} target="_blank">
            <World />
            &nbsp;
            {customContact.website.split("/")[2]}
          </StyledButtonAsLink>
        )}
      </StyledLink>
    </>
  );
}

export default SearchResult;

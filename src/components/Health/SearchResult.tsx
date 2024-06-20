import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useUserAgent from "../../lib/context/UserAgentContext";
import useCategory from "../../lib/fetchers/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getLocalizableCategoryName } from "../../lib/model/ac/categories/Categories";
import { formatDistance } from "../../lib/model/formatDistance";
import { generateMapsUrl } from "../../lib/model/generateMapsUrls";
import CombinedIcon from "../SearchPanel/CombinedIcon";
import ToiletStatuAccessibleIcon from "../icons/accessibility/ToiletStatusAccessible";
import { ExternalLinkIcon } from "../icons/ui-elements";
import { getWheelchairSettings } from "./helpers";
import { StyledButtonAsLink, StyledH3, StyledHDivider, shadowCSS } from "./styles";

const StyledListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  background-color: white;
  ${shadowCSS}
`;

const StyledAccessibleToiletIcon = styled(ToiletStatuAccessibleIcon)`
  margin-left: 0.25rem;
  margin-top: 0rem;
  width: 2rem;
`;

function SearchResult({ data }: any) {
  const { centroid, properties, _id, distance } = data;
  const route = useRouter();
  const { name, healthcare, amenity, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair, ["toilets:wheelchair"]: toiletsWheelchair, ["wheelchair:description"]: wheelchairDescription } = properties;
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

  const userAgent = useUserAgent();
  const openInMaps = React.useMemo(() => generateMapsUrl(userAgent, dataAsOSMFeature, name ? name : healthcare), [userAgent, dataAsOSMFeature, name]);

  return (
    <StyledListItem>
      <div>
        <CombinedIcon accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} category={healthcare} style={{ marginTop: ".35rem" }} />
        {toiletsWheelchair === "yes" ? <StyledAccessibleToiletIcon /> : null}
      </div>

      <div style={{ flex: 1 }}>
        <StyledH3 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
          <Link href={`https://wheelmap.org/${_id}`} target="_blank" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
            {name ? name : healthcare}
            &nbsp;
            <ExternalLinkIcon />
          </Link>
        </StyledH3>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 600 }}>{optionalCategoryName}</div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {customAddress.street && (
            <StyledButtonAsLink href={openInMaps.url} target="_blank">
              {[[customAddress.street, customAddress.housenumber].filter(Boolean).join(" "), customAddress.postcode, customAddress.city].filter(Boolean).join(", ")}
            </StyledButtonAsLink>
          )}

          {customContact.phone && <StyledButtonAsLink href={`tel:${customContact.phone}`} target="_blank"></StyledButtonAsLink>}

          {customContact.website && (
            <StyledButtonAsLink href={`${customContact.website}`} target="_blank" rel="noreferrer noopener">
              {customContact.website.split("/")?.[2]?.replace("www.", "")}
            </StyledButtonAsLink>
          )}

          <StyledHDivider $space={5} />
          <div style={{ color: getWheelchairSettings(wheelchair).color, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 500 }}>
            <T _str={getWheelchairSettings(wheelchair).label} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 300 }}>{wheelchairDescription && `${wheelchairDescription}`}</div>
        </div>
      </div>
      {["distance", "distanceFromCity"].includes(String(route.query.sort)) ? (
        <div>
          &nbsp;{distanceValue} {distanceUnit}
        </div>
      ) : null}
    </StyledListItem>
  );
}

export default SearchResult;

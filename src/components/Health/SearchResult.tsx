import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useUserAgent from "../../lib/context/UserAgentContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import useCategory from "../../lib/fetchers/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import { formatDistance } from "../../lib/model/formatDistance";
import { generateMapsUrl } from "../../lib/model/generateMapsUrls";
import CombinedIcon from "../SearchPanel/CombinedIcon";
import ToiletStatuAccessibleIcon from "../icons/accessibility/ToiletStatusAccessible";
import { ExternalLinkIcon } from "../icons/ui-elements";
import { getWheelchairSettings } from "./helpers";
import { StyledButtonAsLink, StyledH3, StyledHDivider, StyledUL, shadowCSS } from "./styles";

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
  const { properties, _id, distance } = data;
  const route = useRouter();
  const { name, healthcare, ["healthcare:speciality"]: healthcareSpeciality, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair, ["toilets:wheelchair"]: toiletsWheelchair, ["wheelchair:description"]: wheelchairDescription, ["blind:description"]: blindDescription, ["blind:description:de"]: blindDescriptionDE, ["blind:description:en"]: blindDescriptionEN, ["deaf:description"]: deafDescription, ["deaf:description:de"]: deafDescriptionDE, ["deaf:description:en"]: deafDescriptionEN } = properties;
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
  const synonymCache = useCategorySynonymCache();

  const healthcareName = React.useMemo(() => {
    return getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${healthcare}`)?.translations?._id, languageTags);
  }, [synonymCache.data, healthcare, languageTags]);

  const healthcareSpecialityName = React.useMemo(() => {
    return getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare:specialty=${healthcareSpeciality}`)?.translations?._id, languageTags) || getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${healthcareSpeciality}`)?.translations?._id, languageTags);
  }, [synonymCache.data, healthcareSpeciality, languageTags]);

  const optionalHealthcare = React.useMemo(() => {
    if (category?._id === "unknown") {
      return healthcare;
    }
    if (name) {
      if (name.match(healthcareName, "i")) {
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
    return healthcareName;
  }, [category, healthcareName]);

  const optionalHealthcareSpeciality = React.useMemo(() => {
    if (category?._id === "unknown") {
      return healthcareSpeciality;
    }
    return healthcareSpecialityName;
  }, [category, healthcareSpecialityName]);

  const showBlindDescriptionByLanguage = React.useMemo(() => {
    if (languageTags.includes("de")) {
      return blindDescriptionDE;
    } else if (languageTags.includes("en")) {
      return blindDescriptionEN;
    }
    return blindDescriptionEN;
  }, [blindDescriptionDE, blindDescriptionEN, languageTags]);

  const showDeafDescriptionByLanguage = React.useMemo(() => {
    if (languageTags.includes("de")) {
      return deafDescriptionDE;
    } else if (languageTags.includes("en")) {
      return deafDescriptionEN;
    }
    return deafDescriptionEN;
  }, [deafDescriptionDE, deafDescriptionEN, languageTags]);

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 600 }}>
          {optionalHealthcare}
          {optionalHealthcare && optionalHealthcareSpeciality && `, `}
          {optionalHealthcareSpeciality && `${optionalHealthcareSpeciality}`}
        </div>

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
          {(route.query.wheelchair === "yes;limited" || route.query.wheelchair === undefined) && (
            <div style={{ color: getWheelchairSettings(wheelchair).color, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 500 }}>
              <T _str={getWheelchairSettings(wheelchair).label} />
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 300 }}>
            <StyledUL $showBullets>
              {wheelchairDescription && <li>{wheelchairDescription}</li>}
              {blindDescription && <li>{blindDescription}</li>}
              {showBlindDescriptionByLanguage && <li>{showBlindDescriptionByLanguage}</li>}
              {deafDescription && <li>{deafDescription}</li>}
              {showDeafDescriptionByLanguage && <li>{showDeafDescriptionByLanguage}</li>}
            </StyledUL>
          </div>
        </div>
      </div>
      {["distance", "distanceFromCity"].includes(String(route.query.sort))
        ? distanceValue !== "3700" && (
            <div>
              &nbsp;{distanceValue} {distanceUnit}
            </div>
          )
        : null}
    </StyledListItem>
  );
}

export default SearchResult;

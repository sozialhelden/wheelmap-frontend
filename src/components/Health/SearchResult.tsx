import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useUserAgent from "../../lib/context/UserAgentContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import useCategory from "../../lib/fetchers/useCategory";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import { formatDistance } from "../../lib/model/formatDistance";
import { generateMapsUrl } from "../../lib/model/generateMapsUrls";
import { ExternalLinkIcon } from "../icons/ui-elements";
import CombinedIcon from "../shared/CombinedIcon";
import StyledMarkdown from "../shared/StyledMarkdown";
import { getWheelchairSettings } from "./helpers";
import { StyledAccessibleToiletIcon, StyledButtonAsLink, StyledH2, StyledHDivider, StyledListItem, StyledUL } from "./styles";

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
    return getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare:specialty=${healthcareSpeciality}`)?.translations?._id, languageTags);
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

  const displayedCategoryString = React.useMemo(() =>
    [optionalHealthcare, optionalHealthcareSpeciality].filter(Boolean).join(", "),
    [healthcare, healthcareSpeciality],
  );
  const getDescriptionByLanguage = (languageTags, descriptions) => {
    if (languageTags.includes("de")) {
      return descriptions.de;
    }
    return descriptions.en; // Return EN as default if "de" is not found
  };

  const showDescriptionByLanguage = React.useMemo(() => {
    return {
      blind: getDescriptionByLanguage(languageTags, {
        de: blindDescriptionDE,
        en: blindDescriptionEN,
      }),
      deaf: getDescriptionByLanguage(languageTags, {
        de: deafDescriptionDE,
        en: deafDescriptionEN,
      }),
    };
  }, [blindDescriptionDE, blindDescriptionEN, deafDescriptionDE, deafDescriptionEN, languageTags]);

  const userAgent = useUserAgent();
  const openInMaps = React.useMemo(() => generateMapsUrl(userAgent, dataAsOSMFeature, name ? name : healthcare), [userAgent, dataAsOSMFeature, name]);

  return (
    <StyledListItem>
      <div>
        <CombinedIcon accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} category={healthcare} style={{ marginTop: ".35rem" }} />
        {toiletsWheelchair === "yes" ? <StyledAccessibleToiletIcon /> : null}
      </div>

      <div style={{ flex: 1 }}>
        <StyledH2 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
          <Link aria-label={name || _.capitalize(healthcare.replace("_", " "))} href={`https://wheelmap.org/${_id}`} target="_blank" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
            {name || displayedCategoryString}
            &nbsp;
            <ExternalLinkIcon />
          </Link>
        </StyledH2>

        {name && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 600 }}>
          {displayedCategoryString}
        </div>}

        <div style={{ display: "flex", flexDirection: "column" }}>
          {customAddress.street && (
            <StyledButtonAsLink aria-label={[[customAddress.street, customAddress.housenumber].filter(Boolean).join(" "), customAddress.postcode, customAddress.city].filter(Boolean).join(", ")} href={openInMaps.url} target="_blank">
              {[[customAddress.street, customAddress.housenumber].filter(Boolean).join(" "), customAddress.postcode, customAddress.city].filter(Boolean).join(", ")}
            </StyledButtonAsLink>
          )}

          {customContact.phone && <StyledButtonAsLink aria-label={`tel:${customContact.phone}`} href={`tel:${customContact.phone}`} target="_blank"></StyledButtonAsLink>}

          {customContact.website && (
            <StyledButtonAsLink aria-label={customContact.website.split("/")?.[2]?.replace("www.", "")} href={`${customContact.website}`} target="_blank" rel="noreferrer noopener">
              {customContact.website.split("/")?.[2]?.replace("www.", "")}
            </StyledButtonAsLink>
          )}

          <StyledHDivider $space={5} />
          {(route.query.wheelchair === "yes;limited" || route.query.wheelchair === undefined) && (
            <div style={{ color: getWheelchairSettings(wheelchair).color, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 500 }}>
              {getWheelchairSettings(wheelchair).label}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.9, fontWeight: 400 }}>
            <StyledUL $showBullets>
              {wheelchairDescription && <li>
                <StyledMarkdown>{wheelchairDescription}</StyledMarkdown>
              </li>}
              {blindDescription && <li>
                <StyledMarkdown>{blindDescription}</StyledMarkdown>
              </li>}
              {showDescriptionByLanguage.blind && <li>
                <StyledMarkdown>{showDescriptionByLanguage.blind}</StyledMarkdown>
              </li>}
              {deafDescription && <li>
                <StyledMarkdown>{deafDescription}</StyledMarkdown>
              </li>}
              {showDescriptionByLanguage.deaf && <li>
                <StyledMarkdown>{showDescriptionByLanguage.deaf}</StyledMarkdown>
              </li>}
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

import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useUserAgent from "../../lib/context/UserAgentContext";
import { translatedStringFromObject } from "../../lib/i18n/translatedStringFromObject";
import { formatDistance } from "../../lib/model/formatDistance";
import { generateMapsUrl } from "../../lib/model/generateMapsUrls";
import CombinedIcon from "../SearchPanel/CombinedIcon";
import ToiletStatuAccessibleIcon from "../icons/accessibility/ToiletStatusAccessible";
import { ExternalLinkIcon } from "../icons/ui-elements";
import { getGoodName, getWheelchairSettings } from "./helpers";
import { StyledButtonAsLink, StyledChip, StyledH3, StyledHDivider, StyledUL, shadowCSS } from "./styles";

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

function SearchResult({ data, accessibilityAttributes }: any) {
  const { properties, _id, distance } = data;
  const [results, setResults] = useState([]);
  const route = useRouter();
  const { name, ["addr:street"]: street, ["addr:housenumber"]: housenumber, ["addr:postcode"]: postcode, ["addr:city"]: city, website, phone, wheelchair, unisex, ["wheelchair:description"]: wheelchairDescription, ["blind:description"]: blindDescription, ["blind:description:de"]: blindDescriptionDE, ["blind:description:en"]: blindDescriptionEN, ["deaf:description"]: deafDescription, ["deaf:description:de"]: deafDescriptionDE, ["deaf:description:en"]: deafDescriptionEN, amenity, ["toilets:wheelchair"]: toiletsWheelchair } = properties;
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
  const languageTags = useCurrentLanguageTagStrings();

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
  const openInMaps = React.useMemo(() => generateMapsUrl(userAgent, dataAsOSMFeature, name), [userAgent, dataAsOSMFeature, name]);
  const chippedAttributes = ["air_conditioning", "drive_through", "takeaway", "indoor_seating", "internet_access", "outdoor_seating", "payment:cards", "payment:credit_cards", "payment:visa", "payment:girocard", "payment:mastercard", "diet:vegan", "diet:vegetarian"];
  const filterAttributes = (attr) => {
    const stringFromObject = results.find((result) => result._id === `osm:${attr}=${properties[attr]}`)?.shortLabel;
    const translatedString = translatedStringFromObject(stringFromObject);
    if (!translatedString) {
      return null;
    }

    return translatedString;
  };

  React.useEffect(() => {
    if (accessibilityAttributes.data) {
      setResults(accessibilityAttributes.data.results);
    }
  }, [accessibilityAttributes.data]);

  return (
    <StyledListItem>
      <div>
        <CombinedIcon accessibilityFilter={[wheelchair ? wheelchair : "unknown"]} category={amenity} style={{ marginTop: ".35rem" }} />
        {toiletsWheelchair === "yes" ? <StyledAccessibleToiletIcon /> : null}
      </div>

      <div style={{ flex: 1 }}>
        <StyledH3 $fontBold style={{ color: getWheelchairSettings(wheelchair).color }}>
          <Link href={`https://wheelmap.org/${_id}`} target="_blank" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
            {getGoodName(properties)}
            &nbsp;
            <ExternalLinkIcon />
          </Link>
        </StyledH3>

        {chippedAttributes
          .sort((a, b) => (properties[a] === undefined ? 1 : -1) - (properties[b] === undefined ? 1 : -1))
          .map((attr) => {
            if (filterAttributes(attr)) {
              return <StyledChip style={{}}>{filterAttributes(attr)}</StyledChip>;
            }
          })}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {customAddress.street ? (
            <StyledButtonAsLink href={openInMaps.url} target="_blank">
              <T _str="Navigate to" />
              &nbsp;
              {[[customAddress.street, customAddress.housenumber].filter(Boolean).join(" "), customAddress.postcode, customAddress.city].filter(Boolean).join(", ")}
            </StyledButtonAsLink>
          ) : (
            <StyledButtonAsLink href={openInMaps.url} target="_blank">
              <T _str="Navigate Here" />
              {/* {getGoodAddress(properties)} */}
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
              {unisex === "yes" && (
                <li>
                  <T _str="Unisex toilet" />
                </li>
              )}
              {wheelchairDescription && <li>{wheelchairDescription}</li>}
              {blindDescription && <li>{blindDescription}</li>}
              {showDescriptionByLanguage.blind && <li>{showDescriptionByLanguage.blind}</li>}
              {deafDescription && <li>{deafDescription}</li>}
              {showDescriptionByLanguage.deaf && <li>{showDescriptionByLanguage.deaf}</li>}
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

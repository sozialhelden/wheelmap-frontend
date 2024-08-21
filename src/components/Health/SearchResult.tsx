import { T } from "@transifex/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import useUserAgent from "../../lib/context/UserAgentContext";
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

function SearchResult({ data }: any) {
  const { properties, _id, distance } = data;
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
  const openInMaps = React.useMemo(() => generateMapsUrl(userAgent, dataAsOSMFeature, name), [userAgent, dataAsOSMFeature, name]);
  const chippedAttributes = ["air_conditioning", "drive_through", "takeaway", "indoor_seating", "internet_access", "outdoor_seating", "payment:cards", "payment:credit_cards", "payment:visa", "payment:girocard", "payment:mastercard", "diet:vegan", "diet:vegetarian"];
  const filterAttributesAsObject = {
    air_conditioning: {
      yes: "Air conditioning",
      no: "No air conditioning",
    },
    drive_through: {
      yes: "Drive-through",
      no: "No drive-through",
    },
    takeaway: {
      yes: "Takeaway",
      no: "No takeaway",
      only: "Only takeaway",
    },
    indoor_seating: {
      yes: "Indoor seating",
      no: "No indoor seating",
    },
    internet_access: {
      yes: "Internet access",
      wlan: "WLAN",
      no: "No internet access",
    },
    outdoor_seating: {
      yes: "Outdoor seating",
      no: "No outdoor seating",
      sidewalk: "Sidewalk seating",
    },
    "payment:credit_cards": {
      yes: "Credit Cards",
      no: "No Credit Cards",
    },
    "payment:debit_cards": {
      yes: "Debit Cards",
      no: "No Debit Cards",
    },
    "payment:cards": {
      yes: "Cards",
      no: "No Cards",
    },
    "payment:visa": {
      yes: "Visa",
      no: "No Visa",
    },
    "payment:girocard": {
      yes: "Girocard",
      no: "No Girocard",
    },
    "payment:mastercard": {
      yes: "Mastercard",
      no: "No Mastercard",
    },
    "diet:vegetarian": {
      yes: "Vegetarian",
      no: "No vegetarian",
      only: "Only vegetarian",
    },
    "diet:vegan": {
      yes: "Vegan",
      no: "No vegan",
      only: "Only vegan",
    },
  };
  const filterAttributes = (attr) => {
    const propertyValue = properties[attr];
    if (!propertyValue) {
      return null;
    }

    const attributeMapping = filterAttributesAsObject[attr];

    if (attributeMapping) {
      const splitValues = propertyValue.split(";");
      const mappedValues = splitValues.map((value) => attributeMapping[value] || value).sort((a, b) => a.localeCompare(b));
      return mappedValues.join(", ");
    }

    return `${attr} : ${propertyValue}`;
  };

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
              {wheelchairDescription && <li>{wheelchairDescription}</li>}
              {blindDescription && <li>{blindDescription}</li>}
              {unisex === "yes" && (
                <li>
                  <T _str="Unisex toilet" />
                </li>
              )}
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

// @ts-ignore
import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { getServerSideTranslations } from "../../lib/i18n";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { SearchBoxAutocomplete } from "./SearchBoxAutocomplete";
import { fetchJSON } from "./fetchJSON";
import { AmenityStatsResponse, QueryParameters, generateAccessibilityAttributesURL, generateAmenityStatsURL } from "./helpers";
import { DialogContainer, StyledBigTextInput, StyledCheckbox, StyledHDivider, StyledLabel, StyledRadioBox, StyledSelect, StyledSubLabel, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const cityName = route.query.city;
  const env = useContext(EnvContext);
  const baseurl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const accessibilityAttributesBaseURL = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  const accessibilityAttributesappToken = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_APP_TOKEN;
  const accessibilityAttributesURL = generateAccessibilityAttributesURL(accessibilityAttributesBaseURL, accessibilityAttributesappToken);
  const languageTags = useCurrentLanguageTagStrings();
  const wheelchairStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.cuisine && { cuisine: route.query.cuisine }),
        ...(route.query.hasToiletInfo && { hasToiletInfo: route.query.hasToiletInfo }),
        ...(route.query.outdoor_seating && { outdoor_seating: route.query.outdoor_seating }),
        ...(route.query.vegan && { vegan: route.query.vegan }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "wheelchair",
      } as QueryParameters),
    [route.query.bbox, route.query.name]
  );

  const [hasToiletInfoFilter, setHasToiletInfoFilter] = useState(route.query.hasToiletInfo === "true" ? true : false);
  const [hasOutdoorSeatingFilter, setHasOutdoorSeatingFilter] = useState(route.query.outdoor_seating === "*" ? true : false);
  const [hasVeganFilter, setHasVeganFilter] = useState(route.query.vegan === "*" ? true : false);
  const [hasBlindFilter, setHasBlindFilter] = useState(route.query["blind:description"] === "*" ? true : false);
  const [hasDeafFilter, setHasDeafFilter] = useState(route.query["deaf:description"] === "*" ? true : false);
  const cuisineTagStats = useSWR<any>(route.query.bbox ? () => accessibilityAttributesURL : null, fetchJSON);
  const wheelchairTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(wheelchairStatsAPIParams, baseurl) : null, fetchJSON);

  // Wheelchair filter
  const useRouteReplace = useCallback(
    (query: any) => {
      route.replace(
        {
          pathname: route.pathname,
          query: query,
        },
        undefined,
        { shallow: true }
      );
    },
    [route]
  );

  const cuisineOptions = useMemo(() => {
    const results = cuisineTagStats.data?.results
      ?.filter((item: any) => {
        return item?._id?.toString().substring(0, 11) == "osm:cuisine";
      })
      .map((item: any) => {
        const currentLanguage = languageTags[0];
        item.newName = item.shortLabel[currentLanguage].split("[")[1]?.split("]")[0];
        if (!item.newName) {
          item.newName = item.shortLabel["en"];
        }
        return item;
      });
    return results;
  }, [cuisineTagStats]);

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      console.log(name, value);
      const updatedQuery = { ...route.query, [name]: value };
      useRouteReplace(updatedQuery);
    },
    [route]
  );

  const handleFilterType = useCallback(
    (event) => {
      const { value } = event.target;
      const updatedQuery = { ...route.query };

      const filters = {
        toilets: [hasToiletInfoFilter, setHasToiletInfoFilter, "hasToiletInfo", true],
        outdoorSeating: [hasOutdoorSeatingFilter, setHasOutdoorSeatingFilter, "outdoor_seating", "*"],
        vegan: [hasVeganFilter, setHasVeganFilter, "vegan", "*"],
        blind: [hasBlindFilter, setHasBlindFilter, "blind:description", "*"],
        deaf: [hasDeafFilter, setHasDeafFilter, "deaf:description", "*"],
      };

      if (filters[value]) {
        const [hasFilter, setHasFilter, queryKey, queryValue] = filters[value];
        setHasFilter(!hasFilter);
        if (hasFilter) {
          delete updatedQuery[queryKey];
        } else {
          updatedQuery[queryKey] = queryValue;
        }
      }

      useRouteReplace(updatedQuery);
    },
    [route]
  );

  const getWheelchairCountByStats = useCallback((wheelchair, stats) => {
    return stats.find((item) => item.wheelchair === wheelchair)?.count || 0;
  }, []);

  const getWheelchairCount = useCallback(
    (wheelchair) => {
      const stats = wheelchairTagStats.data;
      if (!stats) {
        return undefined;
      }
      switch (wheelchair) {
        case "yes":
        case "limited":
        case "no":
          return getWheelchairCountByStats(wheelchair, stats);
        case "limitedyes":
          const countYes = getWheelchairCountByStats("yes", stats);
          const countLimited = getWheelchairCountByStats("limited", stats);
          return countYes + countLimited;
        case "unknown":
          return getWheelchairCountByStats("", stats);
        default:
          return stats.reduce((acc, item) => acc + item.count, 0);
      }
    },
    [route, wheelchairTagStats]
  );

  return (
    <DialogContainer role="group" aria-labelledby="survey-form-title">
      <SearchBoxAutocomplete />
      {route.query.bbox && (
        <>
          <fieldset>
            <StyledLabel htmlFor="name-search" $fontBold="bold">
              <T _str="Name" />
            </StyledLabel>
            <StyledBigTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={handleInputChange} />
            <StyledSubLabel>
              <T _str="Search for a specific name." />
            </StyledSubLabel>
          </fieldset>

          <fieldset>
            <StyledLabel htmlFor="cuisine-select" $fontBold="bold">
              <T _str="Type" />
            </StyledLabel>
            {cuisineTagStats.error && (
              <Callout intent="danger" icon="error">
                <T _str="Could not load place cuisine types." />
              </Callout>
            )}
            {!cuisineTagStats.error && (
              <>
                <StyledSelect value={route.query.cuisine} name="cuisine" id="cuisine-select" onChange={handleInputChange}>
                  <option value="">
                    <T _str="All" />
                  </option>
                  {cuisineOptions?.map((item, index) => (
                    <option key={index} value={item._id.substring(11)}>
                      {item.newName}
                    </option>
                  ))}
                </StyledSelect>
              </>
            )}
            <StyledSubLabel>
              <T _str="Select one of the items in the list." />
            </StyledSubLabel>
          </fieldset>

          <fieldset>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">
              <T _str="Wheelchair accessibility" />
            </StyledLabel>
            <StyledWheelchairFilter>
              {wheelchairTagStats.error && (
                <Callout intent="warning" icon="warning-sign">
                  <T _str={`Could not load statistics by accessibility.`} />
                </Callout>
              )}
              {route.query.wheelchair === undefined ? <AccessibilityFilterButton accessibilityFilter={[]} showUnfilteredAccessibilityAsAllIcons={true} count={getWheelchairCount("")} caption={<T _str="Show all places" />} category="toilets" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "yes" ? <AccessibilityFilterButton accessibilityFilter={["yes"]} count={getWheelchairCount("yes")} caption={<T _str={"Only fully wheelchair-accessible"} />} category="toilets" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={route.query.wheelchair === "yes"} /> : null}
              {route.query.wheelchair === undefined || (route.query.wheelchair && route.query.wheelchair.includes("limited")) ? <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} count={getWheelchairCount("limitedyes")} caption={<T _str={`Partially wheelchair-accessible`} />} category="toilets" toiletFilter={[]} isActive={route.query.wheelchair && route.query.wheelchair.includes("limited")} showCloseButton={route.query.wheelchair && route.query.wheelchair.includes("limited")} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "no" ? <AccessibilityFilterButton accessibilityFilter={["no"]} count={getWheelchairCount("no")} caption={<T _str={`Only places that are not accessible`} />} category="toilets" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={route.query.wheelchair === "no"} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "unknown" ? <AccessibilityFilterButton accessibilityFilter={["unknown"]} count={getWheelchairCount("unknown")} caption={<T _str={`Places that I can contribute information to`} />} category="toilets" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={route.query.wheelchair === "unknown"} /> : null}
            </StyledWheelchairFilter>
            <StyledHDivider $space={10} />
            <StyledRadioBox style={{ flexDirection: "column", alignItems: "start" }}>
              <StyledLabel $fontBold="bold" htmlFor="filter-unisex">
                <T _str="Show only places with…" />
              </StyledLabel>
              <label htmlFor="filter-toilets">
                <StyledCheckbox type="checkbox" name="filter" id="filter-toilets" checked={hasToiletInfoFilter} value="toilets" onChange={handleFilterType} />
                <T _str="Show only with toilets" />
              </label>
              <label htmlFor="filter-outdoor-seating">
                <StyledCheckbox type="checkbox" name="filter" id="filter-outdoor-seating" checked={hasOutdoorSeatingFilter} value="outdoorSeating" onChange={handleFilterType} />
                <T _str="Show only places with outdoor seating" />
              </label>
              <label htmlFor="filter-vegan">
                <StyledCheckbox type="checkbox" name="filter" id="filter-vegan" checked={hasVeganFilter} value="vegan" onChange={handleFilterType} />
                <T _str="Show only vegan places" />
              </label>
              <label htmlFor="filter-blind">
                <StyledCheckbox type="checkbox" name="filter" id="filter-blind" checked={hasBlindFilter} value="blind" onChange={handleFilterType} />
                <T _str="infos for blind people" />
              </label>
              <label htmlFor="filter-deaf">
                <StyledCheckbox type="checkbox" name="filter" id="filter-deaf" checked={hasDeafFilter} value="deaf" onChange={handleFilterType} />
                <T _str="infos for hearing impaired people" />
              </label>
            </StyledRadioBox>
          </fieldset>

          <fieldset>
            <StyledLabel htmlFor="sort-select" $fontBold="bold">
              <T _str="Sort results" />
            </StyledLabel>
            <StyledSelect defaultValue={route.query.sort} name="sort" id="sort-select" onChange={handleInputChange}>
              <option value="alphabetically">
                <T _str="Alphabetically" />
              </option>
              <option value="distance">
                <T _str="By distance from me" />
              </option>
              <option value="distanceFromCity">
                <T _str="By distance from {cityName} center" cityName={cityName} />
              </option>
            </StyledSelect>
          </fieldset>
        </>
      )}
    </DialogContainer>
  );
}

export async function getServerSideProps(context) {
  const data = await getServerSideTranslations(context);
  return {
    props: {
      ...data,
    },
  };
}

export default FilterInputs;

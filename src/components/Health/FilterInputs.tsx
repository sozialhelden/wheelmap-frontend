// @ts-ignore
import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { getServerSideTranslations } from "../../lib/i18n";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { SearchBoxAutocomplete } from "./SearchBoxAutocomplete";
import { fetchJSON } from "./fetchJSON";
import { AmenityStatsResponse, QueryParameters, generateAmenityStatsURL } from "./helpers";
import { DialogContainer, StyledBigTextInput, StyledCheckbox, StyledHDivider, StyledLabel, StyledRadioBox, StyledSelect, StyledSubLabel, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const cityName = route.query.city;
  const env = useContext(EnvContext);
  const baseurl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const wheelchairStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.unisex && { unisex: route.query.unisex }),
        ...(route.query.centralkey && { centralkey: route.query.centralkey }),
        ...(route.query.fee && { fee: route.query.fee }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "wheelchair",
      } as QueryParameters),
    [route.query.bbox, route.query.name]
  );

  const [hasUnisexFilter, setHasUnisexFilter] = useState(route.query["unisex"] === "true" ? true : false);
  const [hasCentralKeyFilter, setHasCentralKeyFilter] = useState(route.query["centralkey"] === "true" ? true : false);
  const [hasFeeFilter, setHasFeeFilter] = useState(route.query["fee"] === "no" ? true : false);
  const [hasBlindFilter, setHasBlindFilter] = useState(route.query["blind:description"] === "*" ? true : false);
  const [hasDeafFilter, setHasDeafFilter] = useState(route.query["deaf:description"] === "*" ? true : false);
  const [hasToiletInPlace, setHasToiletInPlace] = useState(route.query.toiletinplace === "*" ? true : false);
  const wheelchairTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(wheelchairStatsAPIParams, baseurl, route.query.toiletinplace === "*" ? "amenities.json" : "toilets.json") : null, fetchJSON);

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

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const updatedQuery = { ...route.query, [name]: value };
      useRouteReplace(updatedQuery);
    },
    [route]
  );

  const handleFilterType = useCallback(
    (event) => {
      const { value } = event.target;
      const updatedQuery = { ...route.query };

      if (value === "unisex") {
        setHasUnisexFilter(!hasUnisexFilter);
        if (hasUnisexFilter) delete updatedQuery["unisex"];
        else {
          updatedQuery["unisex"] = "true";
        }
      }
      if (value === "centralkey") {
        setHasCentralKeyFilter(!hasCentralKeyFilter);
        if (hasCentralKeyFilter) delete updatedQuery["centralkey"];
        else {
          updatedQuery["centralkey"] = "true";
        }
      }
      if (value === "fee") {
        setHasFeeFilter(!hasFeeFilter);
        if (hasFeeFilter) delete updatedQuery["fee"];
        else {
          updatedQuery["fee"] = "no";
        }
      }
      if (value === "blind") {
        setHasBlindFilter(!hasBlindFilter);
        if (hasBlindFilter) delete updatedQuery["blind:description"];
        else {
          updatedQuery["blind:description"] = "*";
        }
      }
      if (value === "deaf") {
        setHasDeafFilter(!hasDeafFilter);
        if (hasDeafFilter) delete updatedQuery["deaf:description"];
        else {
          updatedQuery["deaf:description"] = "*";
        }
      }
      if (value === "toiletinplace") {
        setHasToiletInPlace(!hasToiletInPlace);
        if (hasToiletInPlace) delete updatedQuery["toiletinplace"];
        else {
          updatedQuery["toiletinplace"] = "*";
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
              <label htmlFor="filter-unisex">
                <StyledCheckbox type="checkbox" name="filter" id="filter-unisex" checked={hasUnisexFilter} value="unisex" onChange={handleFilterType} />
                <T _str="Unisex toilets" />
              </label>
              <label htmlFor="filter-centralkey">
                <StyledCheckbox type="checkbox" name="filter" id="filter-centralkey" checked={hasCentralKeyFilter} value="centralkey" onChange={handleFilterType} />
                <T _str="Toilets with Central-Key" />
              </label>
              <label htmlFor="filter-fee">
                <StyledCheckbox type="checkbox" name="filter" id="filter-fee" checked={hasFeeFilter} value="fee" onChange={handleFilterType} />
                <T _str="No fee required" />
              </label>
              <label htmlFor="filter-blind">
                <StyledCheckbox type="checkbox" name="filter" id="filter-blind" checked={hasBlindFilter} value="blind" onChange={handleFilterType} />
                <T _str="infos for blind people" />
              </label>
              <label htmlFor="filter-deaf">
                <StyledCheckbox type="checkbox" name="filter" id="filter-deaf" checked={hasDeafFilter} value="deaf" onChange={handleFilterType} />
                <T _str="infos for hearing impaired people" />
              </label>
              <label htmlFor="filter-toiletinplace">
                <StyledCheckbox type="checkbox" name="filter" id="filter-toiletinplace" checked={hasToiletInPlace} value="toiletinplace" onChange={handleFilterType} />
                <T _str="Toilet in place" />
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

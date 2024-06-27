// @ts-ignore
import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getServerSideTranslations } from "../../lib/i18n";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { SearchBoxAutocomplete } from "./SearchBoxAutocomplete";
import { fetchJSON } from "./fetchJSON";
import { AmenityStatsResponse, QueryParameters, generateAmenityStatsURL } from "./helpers";
import { StyledBigTextInput, StyledCheckbox, StyledHDivider, StyledLabel, StyledRadio, StyledRadioBox, StyledSelect, StyledSubLabel, StyledWheelchairFilter, shadowCSS } from "./styles";

const DialogContainer = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  line-height: 2rem;
  background-color: rgb(255, 255, 255, 1);
  border-radius: 0.25rem;
  ${shadowCSS}
  gap: .5rem;

  fieldset {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    max-width: 100%;
  }

  fieldset + fieldset {
    margin-top: 1rem;
  }
`;

function FilterInputs() {
  const route = useRouter();
  const cityName = route.query.city;
  const env = useContext(EnvContext);
  const baseurl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const healthcareStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "healthcare",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.wheelchair]
  );

  const healthcareSpecialityStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
        ...(route.query.healthcare && { healthcare: route.query.healthcare }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "healthcare:speciality",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.wheelchair]
  );

  const wheelchairStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.healthcare && { healthcare: route.query.healthcare }),
        ...(route.query["healthcare:speciality"] && { "healthcare:speciality": route.query["healthcare:speciality"] }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "wheelchair",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.healthcare, route.query["healthcare:speciality"]]
  );

  const [hasNameFilter, setIsNameFilter] = useState(false);
  const [hasBlindFilter, setHasBlindFilter] = useState(route.query["blind:description"] === "*" ? true : false);
  const [hasDeafFilter, setHasDeafFilter] = useState(route.query["deaf:description"] === "*" ? true : false);
  const healthcareTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(healthcareStatsAPIParams, baseurl) : null, fetchJSON);
  const healthcareSpecialityTagStats = useSWR<AmenityStatsResponse>(route.query.bbox && route.query.healthcare ? () => generateAmenityStatsURL(healthcareSpecialityStatsAPIParams, baseurl) : null, fetchJSON);
  const wheelchairTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(wheelchairStatsAPIParams, baseurl) : null, fetchJSON);

  // Wheelchair filter
  const synonymCache = useCategorySynonymCache();
  const languageTags = useCurrentLanguageTagStrings();

  const translatedHealthcareOptions: any = useMemo(() => {
    if (!synonymCache.data) {
      return healthcareTagStats.data;
    }
    return healthcareTagStats.data
      ?.map((item) => {
        const translatedCategoryName = getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${item.healthcare}`)?.translations?._id, languageTags);
        return {
          ...item,
          healthcareTranslated: translatedCategoryName,
          healthcareTranslatedLowercase: (translatedCategoryName || item.healthcare)?.toLocaleLowerCase(),
        };
      })
      .sort((i1, i2) => {
        const a = i1.healthcareTranslatedLowercase;
        const b = i2.healthcareTranslatedLowercase;
        return a.localeCompare(b);
      });
  }, [healthcareTagStats, synonymCache, languageTags]);

  const translatedSpecialityOptions: any = useMemo(() => {
    if (!synonymCache.data) {
      return healthcareSpecialityTagStats.data;
    }
    return healthcareSpecialityTagStats.data
      ?.map((item) => {
        const translatedCategoryName = getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare:specialty=${item["healthcare:speciality"]}`)?.translations?._id, languageTags) || getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${item["healthcare:speciality"]}`)?.translations?._id, languageTags);
        return {
          ...item,
          healthcareTranslated: translatedCategoryName,
          healthcareTranslatedLowercase: (translatedCategoryName || item["healthcare:speciality"])?.toLocaleLowerCase(),
        };
      })
      .sort((i1, i2) => {
        const a = i1.healthcareTranslatedLowercase;
        const b = i2.healthcareTranslatedLowercase;
        return a.localeCompare(b);
      });
  }, [healthcareSpecialityTagStats, synonymCache, languageTags]);

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      const newQuery = { ...route.query, [name]: value };
      if (name === "healthcare") {
        delete newQuery["healthcare:speciality"];
      }
      route.replace(
        {
          pathname: route.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    },
    [route]
  );

  const handleFilterType = useCallback(
    (event) => {
      const { value } = event.target;
      const updatedQuery = { ...route.query };

      if (value === "healthcare") {
        delete updatedQuery.name;
        setIsNameFilter(false);
      } else if (value === "name") {
        delete updatedQuery.healthcare;
        delete updatedQuery["healthcare:speciality"];
        setIsNameFilter(true);
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

      route.replace(
        {
          pathname: route.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    },
    [route, setIsNameFilter]
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
          <StyledRadioBox style={{ flexDirection: "row", alignItems: "center" }}>
            <StyledLabel $fontBold="bold" htmlFor="search-name">
              <T _str="Search by" />
            </StyledLabel>
            <label htmlFor="search-name">
              <StyledRadio type="radio" name="search" id="search-name" value="name" checked={hasNameFilter} onChange={handleFilterType} />
              <T _str="Name" />
            </label>
            <label htmlFor="search-healthcare">
              <StyledRadio type="radio" name="search" id="search-healthcare" value="healthcare" checked={!hasNameFilter} onChange={handleFilterType} />
              <T _str="Type" />
            </label>
          </StyledRadioBox>

          {hasNameFilter && (
            <fieldset>
              <StyledLabel htmlFor="name-search" $fontBold="bold">
                <T _str="Name" />
              </StyledLabel>
              <StyledBigTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={handleInputChange} />
              <StyledSubLabel>
                <T _str="Search for a specific name." />
              </StyledSubLabel>
            </fieldset>
          )}

          {!hasNameFilter && (
            <fieldset>
              <StyledLabel htmlFor="healthcare-select" $fontBold="bold">
                <T _str="Type" />
              </StyledLabel>
              {healthcareTagStats.error && (
                <Callout intent="danger" icon="error">
                  <T _str="Could not load place categories." />
                </Callout>
              )}
              {!healthcareTagStats.error && (
                <StyledSelect value={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleInputChange}>
                  <option value="">
                    <T _str="All" />
                  </option>
                  {translatedHealthcareOptions?.map((item, index) => {
                    return (
                      <option key={item.healthcare + index} value={item.healthcare}>
                        {`${item.healthcareTranslated || item.healthcare}`} {item.count ? ` (${item.count})` : ""}
                      </option>
                    );
                  })}
                </StyledSelect>
              )}
              <StyledSubLabel>
                <T _str="Select one of the items in the list." />
              </StyledSubLabel>
            </fieldset>
          )}

          {route.query.healthcare && translatedSpecialityOptions?.length && translatedSpecialityOptions.length > 1 ? (
            <fieldset>
              <StyledLabel htmlFor="healthcare:speciality-select" $fontBold="bold">
                <T _str="Speciality" />
              </StyledLabel>
              {healthcareSpecialityTagStats.error && (
                <Callout intent="danger" icon="error">
                  <T _str={`Could not load healthcare specialities.`} />
                </Callout>
              )}
              {!healthcareSpecialityTagStats.error && (
                <StyledSelect value={route.query["healthcare:speciality"]} name="healthcare:speciality" id="healthcare:speciality-select" onChange={handleInputChange}>
                  <option value="">
                    <T _str="All categories" />
                  </option>
                  {translatedSpecialityOptions?.map(
                    (item, index) =>
                      (route.query.show_untranslated_tags === "1" || item.healthcareTranslated !== undefined) && (
                        <option key={item["healthcare:speciality"] + index} value={item["healthcare:speciality"]}>
                          {`${item.healthcareTranslated || item["healthcare:speciality"]}`} {item.count ? `(${item.count})` : ""}
                        </option>
                      )
                  )}
                </StyledSelect>
              )}
              <StyledSubLabel>
                <T _str="Select one of the items in the list." />
              </StyledSubLabel>
            </fieldset>
          ) : null}

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
              {route.query.wheelchair === undefined ? <AccessibilityFilterButton accessibilityFilter={[]} showUnfilteredAccessibilityAsAllIcons={true} count={getWheelchairCount("")} caption={<T _str="Show all places" />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "yes" ? <AccessibilityFilterButton accessibilityFilter={["yes"]} count={getWheelchairCount("yes")} caption={<T _str={"Only fully wheelchair-accessible"} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={route.query.wheelchair === "yes"} /> : null}
              {route.query.wheelchair === undefined || (route.query.wheelchair && route.query.wheelchair.includes("limited")) ? <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} count={getWheelchairCount("limitedyes")} caption={<T _str={`Partially wheelchair-accessible`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair && route.query.wheelchair.includes("limited")} showCloseButton={route.query.wheelchair && route.query.wheelchair.includes("limited")} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "no" ? <AccessibilityFilterButton accessibilityFilter={["no"]} count={getWheelchairCount("no")} caption={<T _str={`Only places that are not accessible`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={route.query.wheelchair === "no"} /> : null}
              {route.query.wheelchair === undefined || route.query.wheelchair === "unknown" ? <AccessibilityFilterButton accessibilityFilter={["unknown"]} count={getWheelchairCount("unknown")} caption={<T _str={`Places that I can contribute information to`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={route.query.wheelchair === "unknown"} /> : null}
            </StyledWheelchairFilter>
            <StyledHDivider $space={10} />
            <StyledRadioBox style={{ flexDirection: "column", alignItems: "start" }}>
              <StyledLabel $fontBold="bold" htmlFor="filter-blind">
                <T _str="Show only places with…" />
              </StyledLabel>
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
  console.log("data", data);
  return {
    props: {
      ...data,
    },
  };
}

export default FilterInputs;

// @ts-ignore
import { Callout } from "@blueprintjs/core";
import { T } from "@transifex/react";
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
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
import { StyledHDivider, StyledLabel, StyledLoadingLabel, StyledRadio, StyledRadioBox, StyledSectionsContainer, StyledSelect, StyledSubLabel, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const env = useContext(EnvContext);
  const baseurl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const healthcareStatsAPIParams = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
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
        tags: "wheelchair",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.healthcare, route.query["healthcare:speciality"]]
  );

  const [isNameFilter, setIsNameFilter] = useState(false);
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
      route.replace(
        {
          pathname: route.pathname,
          query: { ...route.query, [name]: value },
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
          return stats.find((item) => item.wheelchair === wheelchair)?.count || 0;
        case "limitedyes":
          const countYes = stats.find((item) => item.wheelchair === "yes")?.count || 0;
          const countLimited = stats.find((item) => item.wheelchair === "limited")?.count || 0;
          return countYes + countLimited;
        case "unknown":
          return stats.find((item) => item.wheelchair === "")?.count || 0;
        default:
          return stats.reduce((acc, item) => acc + item.count, 0);
      }
    },
    [route, wheelchairTagStats]
  );

  return (
    <StyledSectionsContainer role="group" aria-labelledby="survey-form-title">
      <SearchBoxAutocomplete />
      {route.query.bbox && (
        <>
          <StyledRadioBox>
            <StyledLabel $fontBold="bold">Search by</StyledLabel>
            <label htmlFor="search-name">
              <StyledRadio type="radio" name="search" id="search-name" value="name" checked={isNameFilter} onChange={handleFilterType} />
              <T _str="Name" />
            </label>
            <label htmlFor="search-healthcare">
              <StyledRadio type="radio" name="search" id="search-healthcare" value="healthcare" checked={!isNameFilter} onChange={handleFilterType} />
              <T _str="Speciality" />
            </label>
          </StyledRadioBox>
          {isNameFilter && (
            <>
              <StyledLabel htmlFor="name-search" $fontBold="bold">
                <T _str="Name" />
              </StyledLabel>
              <StyledTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={handleInputChange} />
              <StyledSubLabel>
                <T _str="Search for a specific name." />
              </StyledSubLabel>
            </>
          )}
          {!isNameFilter && (
            <>
              {healthcareTagStats.isValidating || healthcareSpecialityTagStats.isValidating ? (
                <StyledLoadingLabel>
                  <T _str="Loading" />
                </StyledLoadingLabel>
              ) : (
                <>
                  <StyledLabel htmlFor="healthcare-select" $fontBold="bold">
                    <T _str="Speciality" />
                  </StyledLabel>
                  {healthcareTagStats.error && (
                    <Callout intent="danger" icon="error">
                      <T _str="Could not load healthcare categories." />
                    </Callout>
                  )}
                  {!healthcareTagStats.error && (
                    <StyledSelect value={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleInputChange}>
                      <option value="">
                        <T _str="All" />
                      </option>
                      {translatedHealthcareOptions?.map((item, index) => (
                        <option key={item.healthcare + index} value={item.healthcare}>
                          {item.count ? `(${item.count})` : ""} {`${item.healthcareTranslated || item.healthcare}`}
                        </option>
                      ))}
                    </StyledSelect>
                  )}
                  <StyledSubLabel>
                    <T _str="Select one of the items in the list." />
                  </StyledSubLabel>

                  {route.query.healthcare && (
                    <>
                      <StyledLabel htmlFor="healthcare:speciality-select" $fontBold="bold">
                        <T _str="Healthcare Speciality?" />
                      </StyledLabel>
                      {healthcareSpecialityTagStats.error && (
                        <Callout intent="danger" icon="error">
                          <T _str={`Could not load healthcare specialities.`} />
                        </Callout>
                      )}
                      {!healthcareSpecialityTagStats.error && (
                        <StyledSelect value={route.query["healthcare:speciality"]} name="healthcare:speciality" id="healthcare:speciality-select" onChange={handleInputChange}>
                          <option value="">
                            <T _str="Alle" />
                          </option>
                          {translatedSpecialityOptions?.map(
                            (item, index) =>
                              item["healthcare:speciality"] !== "" && (
                                <option key={item["healthcare:speciality"] + index} value={item["healthcare:speciality"]}>
                                  {item.count ? `(${item.count})` : ""} {`${item.healthcareTranslated || item["healthcare:speciality"]}`}
                                </option>
                              )
                          )}
                        </StyledSelect>
                      )}
                      <StyledSubLabel>
                        <T _str="Select one of the items in the list." />
                      </StyledSubLabel>
                    </>
                  )}
                </>
              )}
            </>
          )}

          <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">
            <T _str="Wheelchair accessible?" />
          </StyledLabel>
          <StyledWheelchairFilter>
            {wheelchairTagStats.error && (
              <Callout intent="warning" icon="warning-sign">
                <T _str={`Could not load statistics by accessibility.`} />
              </Callout>
            )}
            <StyledHDivider $space={5} />
            <AccessibilityFilterButton accessibilityFilter={[]} count={getWheelchairCount("")} caption={<T _str="All places" />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes"]} count={getWheelchairCount("yes")} caption={<T _str={"Yes"} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} count={getWheelchairCount("limitedyes")} caption={<T _str={`Yes & Partially`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limitedyes"} showCloseButton={false} isHealthcare />
            <AccessibilityFilterButton accessibilityFilter={["limited"]} count={getWheelchairCount("limited")} caption={<T _str={`Partially`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limit"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["no"]} count={getWheelchairCount("no")} caption={<T _str={`No`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["unknown"]} count={getWheelchairCount("unknown")} caption={<T _str={`Unknown`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={false} />
          </StyledWheelchairFilter>

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
              <T _str="By distance from the center of" />
              {` ${route.query.city}`}
            </option>
          </StyledSelect>
        </>
      )}
    </StyledSectionsContainer>
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

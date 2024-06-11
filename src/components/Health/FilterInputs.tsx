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
  const options = useMemo(
    () =>
      ({
        ...(route.query.bbox && { bbox: route.query.bbox }),
        ...(route.query.name && { name: route.query.name }),
        ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
        tags: "healthcare",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.wheelchair]
  );

  const optionsSpeciality = useMemo(
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

  const optionsWheelchair = useMemo(
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

  const [isNameFilter, setIsNameFilter] = useState(true);
  const { data: dataHealthcareOptions, error: errorHealthcareOptions, isValidating: isLoadingHealthcareOptions } = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(options, baseurl) : null, fetchJSON);
  const { data: dataSpecialityOptions, error: errorSpecialityOptions, isValidating: isLoadingSpecialityOptions } = useSWR<AmenityStatsResponse>(route.query.bbox && route.query.healthcare ? () => generateAmenityStatsURL(optionsSpeciality, baseurl) : null, fetchJSON);
  const { data: dataWheelchairOptions, error: errorWheelchairOptions, isValidating: isLoadingWheelchairOptions } = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(optionsWheelchair, baseurl) : null, fetchJSON);

  // Wheelchair filter
  const synonymCache = useCategorySynonymCache();
  const languageTags = useCurrentLanguageTagStrings();

  const translatedHealthcareOptions: any = useMemo(() => {
    if (!synonymCache.data) {
      return dataHealthcareOptions;
    }
    return dataHealthcareOptions
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
  }, [dataHealthcareOptions, synonymCache, languageTags]);

  const translatedSpecialityOptions: any = useMemo(() => {
    if (!synonymCache.data) {
      return dataSpecialityOptions;
    }
    return dataSpecialityOptions
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
  }, [dataSpecialityOptions, synonymCache, languageTags]);

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
      if (!dataWheelchairOptions) {
        return 0;
      }
      let count = 0;
      switch (wheelchair) {
        case "yes":
        case "limited":
        case "no":
          return `(${dataWheelchairOptions.find((item) => item.wheelchair === wheelchair)?.count || 0})`;
        case "limitedyes":
          const countYes = dataWheelchairOptions.find((item) => item.wheelchair === "yes")?.count || 0;
          const countLimited = dataWheelchairOptions.find((item) => item.wheelchair === "limited")?.count || 0;
          return `(${countYes + countLimited})`;
        case "unknown":
          return `(${dataWheelchairOptions.find((item) => item.wheelchair === "")?.count || 0})`;
        default:
          return `(${dataWheelchairOptions.reduce((acc, item) => acc + item.count, 0)})`;
      }
    },
    [route, dataWheelchairOptions]
  );

  return (
    <StyledSectionsContainer role="group" aria-labelledby="survey-form-title">
      <SearchBoxAutocomplete />
      {route.query.bbox && (
        <>
          <StyledRadioBox>
            <div>
              <StyledRadio type="radio" name="search" id="search-name" value="name" checked={isNameFilter} onChange={handleFilterType} />
              <label htmlFor="search-name">
                <T _str="Search by Name?" />
              </label>
            </div>
            <div>
              <StyledRadio type="radio" name="search" id="search-healthcare" value="healthcare" checked={!isNameFilter} onChange={handleFilterType} />
              <label htmlFor="search-healthcare">
                <T _str={`Search by Healthcare?`} />
              </label>
            </div>
          </StyledRadioBox>
          {isNameFilter && (
            <>
              <StyledLabel htmlFor="name-search" $fontBold="bold">
                <T _str="Name?" />
                <StyledSubLabel>
                  <T _str="Search for a specific name" />
                </StyledSubLabel>
              </StyledLabel>
              <StyledTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={handleInputChange} />
            </>
          )}
          {!isNameFilter && (
            <>
              {isLoadingHealthcareOptions || isLoadingSpecialityOptions ? (
                <StyledLoadingLabel>
                  <T _str="Loading" />
                </StyledLoadingLabel>
              ) : (
                <>
                  <StyledLabel htmlFor="healthcare-select" $fontBold="bold">
                    <T _str="Healthcare?" />
                    <StyledSubLabel>{<T _str={`Select one of the items in the list`} />}</StyledSubLabel>
                  </StyledLabel>
                  {errorHealthcareOptions && (
                    <Callout intent="danger" icon="error">
                      <T _str={`Could not healthcare categories.`} />
                    </Callout>
                  )}
                  {!errorHealthcareOptions && (
                    <StyledSelect value={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleInputChange}>
                      <option value="">
                        <T _str="Alle" />
                      </option>
                      {translatedHealthcareOptions?.map((item, index) => (
                        <option key={item.healthcare + index} value={item.healthcare}>
                          {item.count ? `(${item.count})` : ""} {`${item.healthcareTranslated || item.healthcare}`}
                        </option>
                      ))}
                    </StyledSelect>
                  )}
                  {route.query.healthcare && (
                    <>
                      <StyledLabel htmlFor="healthcare:speciality-select" $fontBold="bold">
                        <T _str="Healthcare Speciality?" />
                        <StyledSubLabel>
                          <T _str="Select one of the items in the list" />
                        </StyledSubLabel>
                      </StyledLabel>
                      {errorSpecialityOptions && (
                        <Callout intent="danger" icon="error">
                          <T _str={`Could not load healthcare specialities.`} />
                        </Callout>
                      )}
                      {!errorSpecialityOptions && (
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
                    </>
                  )}
                </>
              )}
            </>
          )}
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
          <StyledWheelchairFilter>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">
              <T _str="Wheelchair accessible?" />
            </StyledLabel>
            {errorWheelchairOptions && (
              <Callout intent="warning" icon="warning-sign">
                <T _str={`Could not load statistics by accessibility.`} />
              </Callout>
            )}
            <StyledHDivider $space={5} />
            <AccessibilityFilterButton accessibilityFilter={[]} caption={<T _str={`${getWheelchairCount("")} All places`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes"]} caption={<T _str={`${getWheelchairCount("yes")} Yes`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} caption={<T _str={`${getWheelchairCount("limitedyes")} Yes & Partially`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limitedyes"} showCloseButton={false} isHealthcare />
            <AccessibilityFilterButton accessibilityFilter={["limited"]} caption={<T _str={`${getWheelchairCount("limited")} Partially`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limit"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["no"]} caption={<T _str={`${getWheelchairCount("no")} No`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["unknown"]} caption={<T _str={`${getWheelchairCount("unknown")} Unknown`} />} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={false} />
          </StyledWheelchairFilter>
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

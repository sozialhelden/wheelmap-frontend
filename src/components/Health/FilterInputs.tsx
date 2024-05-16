// @ts-ignore
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { SearchBoxAutocomplete } from "./SearchBoxAutocomplete";
import { AmenityStatsResponse, QueryParameters, fetchJSON, generateAmenityStatsURL } from "./helpers";
import { StyledHDivider, StyledLabel, StyledLoadingLabel, StyledRadio, StyledRadioBox, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

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

  const [isNameFilter, setIsNameFilter] = useState(true);
  const { data: dataHealthcareOptions, error: errorHealthcareOptions, isValidating: isLoadingHealthcareOptions } = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(options, baseurl) : null, fetchJSON);
  const { data: dataSpecialityOptions, error: errorSpecialityOptions, isValidating: isLoadingSpecialityOptions } = useSWR<AmenityStatsResponse>(route.query.bbox && route.query.healthcare ? () => generateAmenityStatsURL(optionsSpeciality, baseurl) : null, fetchJSON);
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
        const translatedCategoryName = getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${item["healthcare:speciality"]}`)?.translations?._id, languageTags);
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

  return (
    <StyledSectionsContainer role="group" aria-labelledby="survey-form-title">
      <SearchBoxAutocomplete />
      {route.query.bbox && (
        <>
          <StyledRadioBox>
            <div>
              <StyledRadio type="radio" name="search" id="search-name" value="name" checked={isNameFilter} onChange={handleFilterType} />
              <label htmlFor="search-name">{t`Suche nach Name?`}</label>
            </div>
            <div>
              <StyledRadio type="radio" name="search" id="search-healthcare" value="healthcare" checked={!isNameFilter} onChange={handleFilterType} />
              <label htmlFor="search-healthcare">{t`Suche nach Category?`}</label>
            </div>
          </StyledRadioBox>
          {isNameFilter && (
            <>
              <StyledLabel htmlFor="name-search" $fontBold="bold">{t`Name?`}</StyledLabel>
              <StyledTextInput type="text" value={route.query.name} name="name" id="name-search" onChange={handleInputChange} />
            </>
          )}
          {!isNameFilter && (
            <>
              {isLoadingHealthcareOptions || isLoadingSpecialityOptions ? (
                <StyledLoadingLabel>{t`Loading ...`}</StyledLoadingLabel>
              ) : (
                <>
                  <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Healthcare?`}</StyledLabel>
                  <StyledSelect value={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleInputChange}>
                    <option value="">{t`Alle`}</option>
                    {translatedHealthcareOptions?.map((item, index) => (
                      <option key={item.healthcare + index} value={item.healthcare}>
                        {`${item.healthcareTranslated || item.healthcare}`}
                      </option>
                    ))}
                  </StyledSelect>
                  {route.query.healthcare && (
                    <>
                      <StyledLabel htmlFor="healthcare:speciality-select" $fontBold="bold">{t`Healthcare Speciality?`}</StyledLabel>
                      <StyledSelect value={route.query["healthcare:speciality"]} name="healthcare:speciality" id="healthcare:speciality-select" onChange={handleInputChange}>
                        <option value="">{t`Alle`}</option>
                        {translatedSpecialityOptions?.map(
                          (item, index) =>
                            item["healthcare:speciality"] !== "" && (
                              <option key={item["healthcare:speciality"] + index} value={item["healthcare:speciality"]}>
                                {`${item.healthcareTranslated || item["healthcare:speciality"]}`}
                              </option>
                            )
                        )}
                      </StyledSelect>
                    </>
                  )}
                </>
              )}
            </>
          )}
          <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
          <StyledSelect defaultValue={route.query.sort} name="sort" id="sort-select" onChange={handleInputChange}>
            <option value="alphabetically">{t`Alphabetically`}</option>
            <option value="distance">{t`By distance from me`}</option>
            <option value="distanceFromCity">{t`By distance from the center of ${route.query.city}`}</option>
          </StyledSelect>
          <StyledWheelchairFilter>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
            <StyledHDivider $space={0.25} />
            <AccessibilityFilterButton accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes"]} caption={t`Yes`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes", "limited"]} caption={t`Yes & Partially`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limitedyes"} showCloseButton={false} isHealthcare />
            <AccessibilityFilterButton accessibilityFilter={["limited"]} caption={t`Partially`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limit"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["no"]} caption={t`No`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["unknown"]} caption={t`Unknown`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={false} />
          </StyledWheelchairFilter>
        </>
      )}
    </StyledSectionsContainer>
  );
}

export default FilterInputs;

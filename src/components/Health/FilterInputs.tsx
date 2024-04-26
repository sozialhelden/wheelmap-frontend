import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { SearchBoxAutocomplete } from "./SearchBoxAutocomplete";
import { fetcher, useOsmAPI } from "./helpers";
import { StyledHDivider, StyledLabel, StyledLoadingLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const env = useContext(EnvContext);
  const baseurl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const options = useMemo(
    () => ({
      ...(route.query.bbox && { bbox: route.query.bbox }),
      ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
      tags: "healthcare",
    }),
    [route.query.bbox, route.query.wheelchair]
  );

  const { data: dataHealthcareOptions, error: errorHealthcareOptions, isValidating: isLoadingHealthcareOptions } = useSWR(route.query.bbox ? () => useOsmAPI(options, baseurl, true) : null, fetcher);
  const synonymCache = useCategorySynonymCache();
  const languageTags = useCurrentLanguageTagStrings();
  const [name, setName] = useState("");

  useEffect(() => {
    route.query.name ? setName(route.query.name.toString()) : setName("");
  }, [route.query.city]);

  const translatedHealthcareOptions = useMemo(() => {
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

  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      if (name === "name") setName(value);
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

  return (
    <StyledSectionsContainer role="group" aria-labelledby="survey-form-title">
      <SearchBoxAutocomplete />
      {route.query.bbox && (
        <>
          <StyledLabel htmlFor="name" $fontBold="bold">{t`Name?`}</StyledLabel>
          <StyledTextInput type="text" value={name} name="name" id="name" onChange={handleInputChange} />

          <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
          {isLoadingHealthcareOptions ? (
            <StyledLoadingLabel>{t`Loading ...`}</StyledLoadingLabel>
          ) : (
            <StyledSelect value={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleInputChange}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions?.map((item, index) => (
                <option key={item.healthcare + index} value={item.healthcare}>
                  {`${item.healthcareTranslated || item.healthcare}`}
                </option>
              ))}
            </StyledSelect>
          )}

          <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
          <StyledSelect defaultValue={route.query.sort} name="sort" id="sort-select" onChange={handleInputChange}>
            <option value="alphabetically">{t`Alphabetically`}</option>
            <option value="distance">{t`By distance`}</option>
          </StyledSelect>

          <StyledWheelchairFilter>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
            <StyledHDivider $space={0.25} />
            <AccessibilityFilterButton accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["yes"]} caption={t`Yes`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["no"]} caption={t`No`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["limited"]} caption={t`Partially`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limited"} showCloseButton={false} />
            <AccessibilityFilterButton accessibilityFilter={["unknown"]} caption={t`Unknown`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={false} />
          </StyledWheelchairFilter>
        </>
      )}
    </StyledSectionsContainer>
  );
}

export default FilterInputs;

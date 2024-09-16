// @ts-ignore
import { useRouter } from "next/router";
import { useCallback, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { useCurrentLanguageTagStrings } from "../../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../../lib/model/ac/categories/Categories";
import EnvContext from "../../shared/EnvContext";
import { SearchBoxAutocomplete } from "../SearchBoxAutocomplete";
import { fetchJSON } from "../fetchJSON";
import { AmenityStatsResponse, QueryParameters, generateAmenityStatsURL } from "../helpers";
import { DialogContainer } from "../styles";
import { AccessibilityFilterFieldset } from "./AccessibilityFilterFieldset";
import { ByNameOrTypeChoiceFieldset } from "./ByNameOrTypeChoiceFieldset";
import { HealthcareSpecialityFieldset } from "./HealthcareSpecialityFieldset";
import { HealthcareTypeFilterFieldset } from "./HealthcareTypeFilterFieldset";
import { NameFilterFieldset } from "./NameFilterFieldset";
import { SortingFieldset } from "./SortingFieldset";

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
        ...(route.query.hasToiletInfo && { hasToiletInfo: route.query.hasToiletInfo }),
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
        ...(route.query.hasToiletInfo && { hasToiletInfo: route.query.hasToiletInfo }),
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
        ...(route.query.hasToiletInfo && { hasToiletInfo: route.query.hasToiletInfo }),
        ...(route.query["blind:description"] && { "blind:description": route.query["blind:description"] }),
        ...(route.query["deaf:description"] && { "deaf:description": route.query["deaf:description"] }),
        tags: "wheelchair",
      } as QueryParameters),
    [route.query.bbox, route.query.name, route.query.healthcare, route.query["healthcare:speciality"]]
  );

  const [hasNameFilter, setIsNameFilter] = useState(false);
  const [hasToiletInfoFilter, setHasToiletInfoFilter] = useState(route.query.hasToiletInfo === "true" ? true : false);
  const [hasBlindFilter, setHasBlindFilter] = useState(route.query["blind:description"] === "*" ? true : false);
  const [hasDeafFilter, setHasDeafFilter] = useState(route.query["deaf:description"] === "*" ? true : false);
  const healthcareTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(healthcareStatsAPIParams, baseurl) : null, fetchJSON);
  const healthcareSpecialityTagStats = useSWR<AmenityStatsResponse>(route.query.bbox && route.query.healthcare ? () => generateAmenityStatsURL(healthcareSpecialityStatsAPIParams, baseurl) : null, fetchJSON);
  const wheelchairTagStats = useSWR<AmenityStatsResponse>(route.query.bbox ? () => generateAmenityStatsURL(wheelchairStatsAPIParams, baseurl) : null, fetchJSON);

  // Wheelchair filter
  const synonymCache = useCategorySynonymCache();
  const languageTags = useCurrentLanguageTagStrings();

  const translatedHealthcareOptions = useMemo(() => {
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

  const translatedSpecialityOptions = useMemo(() => {
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

  const onChangeFilterType = useCallback(
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
      if (value === "toilets") {
        setHasToiletInfoFilter(!hasToiletInfoFilter);
        if (hasToiletInfoFilter) delete updatedQuery.hasToiletInfo;
        else {
          updatedQuery.hasToiletInfo = "true";
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
          <ByNameOrTypeChoiceFieldset {...{ hasNameFilter, onChangeFilterType }} />

          {hasNameFilter && (
            <NameFilterFieldset {...{ route, onChange: handleInputChange }} />
          )}

          {!hasNameFilter && (
            <HealthcareTypeFilterFieldset {...{ healthcareTagStats, route, handleInputChange, translatedHealthcareOptions }} />
          )}

          {route.query.healthcare && translatedSpecialityOptions?.length && translatedSpecialityOptions.length > 1 ? (
            <HealthcareSpecialityFieldset {...{ healthcareSpecialityTagStats, route, handleInputChange, translatedSpecialityOptions }} />
          ) : null}

          <AccessibilityFilterFieldset {...{ wheelchairTagStats, route, getWheelchairCount, hasToiletInfoFilter, onChangeFilterType, hasBlindFilter, hasDeafFilter }} />

          <SortingFieldset {...{ route, handleInputChange, cityName }} />
        </>
      )}
    </DialogContainer>
  );
}

export default FilterInputs;


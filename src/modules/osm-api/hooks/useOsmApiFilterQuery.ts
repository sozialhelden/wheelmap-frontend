import { useMemo } from "react";
import { useAppStateAwareRouter } from "~/lib/util/useAppStateAwareRouter";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";

function getCategoryFilterParams(): Record<string, string> {
  const { category, categoryProperties } = useCategoryFilter();
  return categoryProperties?.queryParams || { category: String(category) };
}
function getWheelchairFilterParams(): Record<string, string> {
  const router = useAppStateAwareRouter();

  const wheelchair = Array.isArray(router.query.wheelchair)
    ? router.query.wheelchair
    : [router.query.wheelchair].filter(Boolean);

  if (!wheelchair.length) {
    return {};
  }

  if (wheelchair.includes("no")) {
    return {
      wheelchair: "no",
    };
  }
  if (wheelchair.includes("unknown")) {
    return {
      wheelchair: "unknown",
    };
  }
  if (wheelchair.includes("limited") && wheelchair.includes("yes")) {
    return {
      wheelchair: "yes;limited",
    };
  }
  if (wheelchair.includes("limited")) {
    return {
      wheelchair: "limited",
    };
  }
  if (wheelchair.includes("yes")) {
    return {
      wheelchair: "yes",
    };
  }
  return {
    wheelchair: "all",
  };
}
function getToiletFilterParams(): Record<string, string> {
  const router = useAppStateAwareRouter();
  const toilet = Array.isArray(router.query.toilet)
    ? router.query.toilet
    : [router.query.toilet].filter(Boolean);

  if (toilet.includes("yes")) {
    return {
      hasAccessibleToilet: "yes",
    };
  }

  return {};
}

export function useOsmApiFilterQuery(): Record<string, string> {
  const category = getCategoryFilterParams();
  const wheelchair = getWheelchairFilterParams();
  const toilet = getToiletFilterParams();

  return useMemo(() => {
    return {
      ...category,
      ...wheelchair,
      ...toilet,
    };
  }, [category, wheelchair, toilet]);
}

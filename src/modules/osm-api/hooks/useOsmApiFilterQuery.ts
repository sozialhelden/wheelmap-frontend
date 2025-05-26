import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { useNeeds } from "~/modules/needs/contexts/NeedsContext";

function useCategoryFilterParams(): Record<string, string> {
  const { category } = useCategoryFilter();
  if (category === "toilets") {
    return { hasToiletInfo: "true" };
  }
  return { category: String(category) };
}

function useWheelchairFilterParams(): Record<string, string> {
  const {
    selection: { mobility },
  } = useNeeds();

  if (!mobility) {
    return {};
  }

  return {
    "no-need": {},
    "fully-wheelchair-accessible": {
      wheelchair: "yes",
    },
    "partially-wheelchair-accessible": {
      wheelchair: "yes;limited",
    },
    "not-wheelchair-accessible": {
      wheelchair: "no",
    },
    "no-data": {
      wheelchair: "unknown",
    },
  }[mobility];
}

function useToiletFilterParams(): Record<string, string> {
  const {
    selection: { toilet },
  } = useNeeds();

  if (!toilet) {
    return {};
  }

  return {
    "no-need": {},
    "fully-wheelchair-accessible": {
      hasAccessibleToilet: "yes",
    },
    "toilet-present": {
      hasToiletInfo: true,
    },
  }[toilet];
}

export function useOsmApiFilterQuery(): Record<string, string> {
  const category = useCategoryFilterParams();
  const wheelchair = useWheelchairFilterParams();
  const toilet = useToiletFilterParams();

  return {
    ...category,
    ...wheelchair,
    ...toilet,
  };
}

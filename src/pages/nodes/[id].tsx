import { useEffect } from "react";
import { getLayout } from "~/layouts/DefaultLayout";
import { useAppStateAwareRouter } from "~/needs-refactoring/lib/util/useAppStateAwareRouter";

// @legacy-route
export default function LegacyNodeFeaturesPage() {
  const {
    replace,
    query: { id },
  } = useAppStateAwareRouter();

  useEffect(() => {
    const isOSMFeatureId =
      typeof id === "string" && id.length > 0 && /^-?\d+$/.test(id);

    if (isOSMFeatureId) {
      if (id.startsWith("-")) {
        replace(`/way/${id}`);
      } else {
        replace(`/node/${id}`);
      }
    }

    replace(`/ac:PlaceInfo/${id}`);
  }, [replace, id]);

  return null;
}

LegacyNodeFeaturesPage.getLayout = getLayout;

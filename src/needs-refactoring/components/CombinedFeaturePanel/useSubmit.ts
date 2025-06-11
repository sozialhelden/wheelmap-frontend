import useUpdateTagValueWithLogInCallback, {
  type OSMAPIElement,
} from "~/needs-refactoring/lib/fetchers/osm-api/useUpdateTagValueWithLogIn";
import { log } from "~/needs-refactoring/lib/util/logger";
import { updateTagValueNoLogIn } from "~/needs-refactoring/lib/fetchers/updateTagValueNoLogIn";
import { useSession } from "next-auth/react";
import { useEnvironment } from "~/hooks/useEnvironment";
import useOsmApi from "~/hooks/useOsmApi";
import { isOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import useSWR from "swr";
import { fetchFeaturePrefixedId } from "~/needs-refactoring/lib/fetchers/osm-api/fetchFeaturePrefixedId";
import getOsmParametersFromFeature from "~/needs-refactoring/lib/fetchers/osm-api/getOsmParametersFromFeature";
import { toast } from "react-toastify";
import { t } from "@transifex/native";
import { useContext } from "react";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";

export default function useSubmit(
  tagKey: string,
  newTagValue: string | number | undefined,
) {
  const { features } = useContext(FeaturePanelContext);
  const feature = features[0].feature?.requestedFeature;

  const accessToken = useSession().data?.accessToken;
  const env = useEnvironment();
  const remoteOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_BASE_URL;
  if (!remoteOSMAPIBaseUrl) {
    throw new Error(
      "Missing OSM API Base URL. Please set the NEXT_PUBLIC_OSM_API_BASE_URL environment variable.",
    );
  }
  const { baseUrl: inhouseOSMAPIBaseURL } = useOsmApi({ cached: false });

  const osmFeature = isOSMFeature(feature) ? feature : undefined;
  const currentOSMObjectOnServer = useSWR<OSMAPIElement>(
    osmFeature?._id,
    fetchFeaturePrefixedId,
  );
  const { osmType, osmId } = getOsmParametersFromFeature(osmFeature, tagKey);

  function postSuccessMessage() {
    toast.success(
      t("Thank you for contributing. Your edit will be visible soon."),
    );
  }

  function postErrorMessage() {
    toast.error(
      t("Something went wrong. Please let us know if the error persists."),
    );
  }

  const updateTagValueWithLogIn = useUpdateTagValueWithLogInCallback({
    accessToken,
    baseUrl: remoteOSMAPIBaseUrl,
    osmType,
    osmId,
    tagName: tagKey,
    newTagValue,
    currentOSMObjectOnServer: currentOSMObjectOnServer.data,
    postSuccessMessage: postSuccessMessage,
    postErrorMessage: postErrorMessage,
  });

  const submit = async () => {
    if (accessToken) {
      try {
        await updateTagValueWithLogIn();
      } catch (error) {
        log.error(error);
      }
      return;
    }

    try {
      await updateTagValueNoLogIn({
        baseUrl: inhouseOSMAPIBaseURL,
        osmType: osmType,
        osmId: osmId,
        tagName: tagKey,
        newTagValue: newTagValue,
        postSuccessMessage: postSuccessMessage,
        postErrorMessage: postErrorMessage,
      });
    } catch (error) {
      log.error(error);
    }
  };

  return submit;
}

import { Button } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { t } from "ttag";
import { normalizeAndExtractLanguageTagsIfPresent } from "~/components/CombinedFeaturePanel/utils/TagKeyUtils";
import { useEnvContext } from "~/lib/context/EnvContext";
import { makeChangeRequestToInhouseApi } from "~/lib/fetchers/makeChangeRequestToInhouseApi";
import { fetchFeaturePrefixedId } from "~/lib/fetchers/osm-api/fetchFeaturePrefixedId";
import { isOSMFeature } from "~/lib/model/geo/AnyFeature";
import getOsmParametersFromFeature from "../../../lib/fetchers/osm-api/getOsmParametersFromFeature";
import useSubmitNewValueCallback, {
  type OSMAPIElement,
} from "../../../lib/fetchers/osm-api/makeChangeRequestToOsmApi";
import useInhouseOSMAPI from "../../../lib/fetchers/osm-api/useInhouseOSMAPI";
import { AppStateLink } from "../../App/AppStateLink";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";
import { StringFieldEditor } from "./StringFieldEditor";
import { ToiletsWheelchairEditor } from "./ToiletsWheelchairEditor";
import { WheelchairEditor } from "./WheelchairEditor";

function getEditorForKey(key: string): React.FC<BaseEditorProps> | undefined {
  switch (true) {
    case key.startsWith("wheelchair:description"):
      return StringFieldEditor;

    case key === "wheelchair":
      return WheelchairEditor;

    case key === "toilets:wheelchair":
      return ToiletsWheelchairEditor;

    default:
      return undefined;
  }
}
export const AutoEditor = ({
  feature,
  tagKey,
  addNewLanguage,
  onClose,
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const accessToken = useSession().data?.accessToken;
  const env = useEnvContext();
  const remoteOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_BASE_URL;
  if (!remoteOSMAPIBaseUrl) {
    throw new Error(
      "Missing OSM API Base URL. Please set the NEXT_PUBLIC_OSM_API_BASE_URL environment variable.",
    );
  }
  const { baseUrl: inhouseOSMAPIBaseURL } = useInhouseOSMAPI({ cached: false });

  const osmFeature = isOSMFeature(feature) ? feature : undefined;
  const currentOSMObjectOnServer = useSWR<OSMAPIElement>(
    osmFeature?._id,
    fetchFeaturePrefixedId,
  );
  const { tagName, osmType, osmId } = getOsmParametersFromFeature(
    osmFeature,
    tagKey,
  );

  const [finalTagName, setFinalTagName] = useState(tagName);
  const [newTagValue, setEditedTagValue] = useState<string>("");

  function handleSuccess() {
    toast.success(
      t`Thank you for contributing. Your edit will be visible soon.`,
    );
  }

  function handleError() {
    toast.error(
      t`Something went wrong. Please let us know if the error persists.`,
    );
  }

  const submitNewValue = useSubmitNewValueCallback({
    accessToken,
    baseUrl: remoteOSMAPIBaseUrl,
    osmType,
    osmId,
    tagName: finalTagName,
    newTagValue,
    currentOSMObjectOnServer: currentOSMObjectOnServer.data,
    handleSuccess,
    handleError,
  });

  const onSubmit = async () => {
    if (accessToken) {
      await submitNewValue();
      return;
    }

    try {
      await makeChangeRequestToInhouseApi({
        baseUrl: inhouseOSMAPIBaseURL,
        osmType: osmType,
        osmId: osmId,
        tagName: finalTagName,
        newTagValue: newTagValue,
        postSuccessMessage: handleSuccess,
        postErrorMessage: handleError,
      });
    } catch (error) {
      // TODO: handle error somehow
    }
  };

  const handleTagKeyChange = React.useCallback(
    (newPickerValue: string) => {
      const { normalizedOSMTagKey: baseTag } =
        normalizeAndExtractLanguageTagsIfPresent(tagName);
      const updatedTagName = [baseTag, newPickerValue].join(":");

      if (updatedTagName !== finalTagName) {
        setFinalTagName(updatedTagName);
      }
    },
    [tagName, finalTagName],
  );

  const Editor = getEditorForKey(tagKey);
  if (Editor) {
    return (
      <Editor
        feature={feature}
        tagKey={finalTagName}
        onChange={setEditedTagValue}
        onSubmit={onSubmit}
        addNewLanguage={addNewLanguage}
        onLanguageChange={handleTagKeyChange}
        onClose={onClose}
      />
    );
  }

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">{t`No editor available for ${tagKey}`}</h2>
      <footer className="_footer">
        <Button asChild>
          <AppStateLink href={baseFeatureUrl}>Back</AppStateLink>
        </Button>
      </footer>
    </StyledReportView>
  );
};

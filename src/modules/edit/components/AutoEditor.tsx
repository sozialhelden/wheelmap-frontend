import { Button } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchFeaturePrefixedId } from "~/needs-refactoring/lib/fetchers/osm-api/fetchFeaturePrefixedId";
import { updateTagValueNoLogIn } from "~/needs-refactoring/lib/fetchers/updateTagValueNoLogIn";
import { isOSMFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { log } from "~/needs-refactoring/lib/util/logger";
import useOsmApi from "~/modules/osm-api/hooks/useOsmApi";
import getOsmParametersFromFeature from "~/needs-refactoring/lib/fetchers/osm-api/getOsmParametersFromFeature";
import { useEnvironmentContext } from "~/modules/app/context/EnvironmentContext";
import useUpdateTagValueWithLogInCallback, {
  type OSMAPIElement,
} from "~/needs-refactoring/lib/fetchers/osm-api/useUpdateTagValueWithLogIn";
import { AppStateLink } from "~/needs-refactoring/components/App/AppStateLink";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import type { BaseEditorProps } from "./BaseEditor";
import { StringFieldEditor } from "./StringFieldEditor";
import { ToiletsWheelchairEditor } from "./ToiletsWheelchairEditor";
import { WheelchairEditor } from "./WheelchairEditor";
import { normalizeAndExtractLanguageTagsIfPresent } from "~/needs-refactoring/lib/util/TagKeyUtils";

function getEditorForKey(key: string): React.FC<BaseEditorProps> | undefined {
  switch (true) {
    case key.includes("description"):
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
  const env = useEnvironmentContext();
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
  const { tagName, osmType, osmId } = getOsmParametersFromFeature(
    osmFeature,
    tagKey,
  );

  const [finalTagName, setFinalTagName] = useState(tagName);
  const [newTagValue, setEditedTagValue] = useState<string>("");

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

  const onLanguageChange = React.useCallback(
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

  const updateTagValueWithLogIn = useUpdateTagValueWithLogInCallback({
    accessToken,
    baseUrl: remoteOSMAPIBaseUrl,
    osmType,
    osmId,
    tagName: finalTagName,
    newTagValue,
    currentOSMObjectOnServer: currentOSMObjectOnServer.data,
    postSuccessMessage: postSuccessMessage,
    postErrorMessage: postErrorMessage,
  });

  const onSubmit = async () => {
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
        tagName: finalTagName,
        newTagValue: newTagValue,
        postSuccessMessage: postSuccessMessage,
        postErrorMessage: postErrorMessage,
      });
    } catch (error) {
      log.error(error);
    }
  };

  const Editor = getEditorForKey(tagKey);
  if (Editor) {
    return (
      <Editor
        feature={feature}
        tagKey={finalTagName}
        onChange={setEditedTagValue}
        onSubmit={() => {
          onSubmit();
          onClose?.();
        }}
        addNewLanguage={addNewLanguage}
        onLanguageChange={onLanguageChange}
        onClose={onClose}
      />
    );
  }

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature} />
      <h2 className="_title">
        {t("No editor available for {tagKey}", { tagKey })}
      </h2>
      <footer className="_footer">
        <Button asChild>
          <AppStateLink href={baseFeatureUrl}>Back</AppStateLink>
        </Button>
      </footer>
    </StyledReportView>
  );
};

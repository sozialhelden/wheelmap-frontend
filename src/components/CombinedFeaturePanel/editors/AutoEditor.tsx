import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import { t } from "ttag";
import { useEnvContext } from "../../../lib/context/EnvContext";
import { makeChangeRequestToInhouseApi } from "../../../lib/fetchers/makeChangeRequestToInhouseApi";
import { fetchFeaturePrefixedId } from "../../../lib/fetchers/osm-api/fetchFeaturePrefixedId";
import useSubmitNewValueCallback from "../../../lib/fetchers/osm-api/makeChangeRequestToOsmApi";
import useInhouseOSMAPI from "../../../lib/fetchers/osm-api/useOSMAPI";
import useRetrieveOsmParametersFromFeature from "../../../lib/fetchers/osm-api/useRetrieveOsmParametersFromFeature";
import { isOSMFeature } from "../../../lib/model/geo/AnyFeature";
import { AppStateLink } from "../../App/AppStateLink";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";
import type { EditorTagValue } from "./EditorTagValue";
import { StringFieldEditor } from "./StringFieldEditor";
import { ToiletsWheelchairEditor } from "./ToiletsWheelchairEditor";
import { WheelchairEditor } from "./WheelchairEditor";

type AutoEditorProps = Omit<
  BaseEditorProps,
  "onUrlMutationSuccess" | "onChange" | "handleSubmitButtonClick"
>;

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
export const AutoEditor = ({ feature, tagKey }: AutoEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  // TODO: add typing to session data
  const accessToken = (useSession().data as any)?.accessToken;
  const router = useRouter();
  const env = useEnvContext();
  const remoteOSMAPIBaseUrl = env.NEXT_PUBLIC_OSM_API_BASE_URL;
  const { baseUrl: inhouseOSMAPIBaseURL } = useInhouseOSMAPI({ cached: false });
  const osmFeature = isOSMFeature(feature) ? feature : undefined;
  const currentOSMObjectOnServer = useSWR(
    osmFeature?._id,
    fetchFeaturePrefixedId,
  );
  const { tagName, osmType, osmId } =
    useRetrieveOsmParametersFromFeature(osmFeature);

  const [newTagValue, setEditedTagValue] = useState<EditorTagValue>("");
  const handleSuccess = React.useCallback(() => {
    toast.success(
      t`Thank you for contributing. Your edit will be visible soon.`,
    );
    const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), "");
    router.push(newPath);
  }, [router, tagName]);

  const handleOSMSuccessDBError = React.useCallback(() => {
    const message = [
      t`Thank you for contributing.`,
      t` There was an error while trying to save your changes to our database.`,
      t` Your changes will still be visible on Open Street Map.`,
    ];
    // debugger
    toast.warning(message);
    // const newPath = router.asPath.replace(new RegExp(`/edit/${tagName}`), '')
    // router.push(newPath)
  }, [router, tagName]);

  const handleError = React.useCallback((error: Error, message?: string) => {
    const defaultMessage = [
      t`Your contribution could not be saved completely.`,
      t`Please try again later or let us know if the error persists. Error: ${error}`,
    ].join(" ");

    toast.error(message || defaultMessage);
  }, []);

  const submitNewValue = useSubmitNewValueCallback({
    handleSuccess,
    handleOSMSuccessDBError,
    handleError,
    accessToken,
    baseUrl: remoteOSMAPIBaseUrl,
    osmType,
    osmId,
    tagName,
    newTagValue,
    currentOSMObjectOnServer,
  });

  const handleSubmitButtonClick = async () => {
    if (accessToken) {
      await submitNewValue();
      return;
    }
    if (!newTagValue || !osmId) {
      handleError(
        new Error('Missing Information'),
        t`Some information was missing while saving to OpenStreetMap. Please let us know if the error persists.`,
      );
    }
    try {
      await makeChangeRequestToInhouseApi({
        baseUrl: inhouseOSMAPIBaseURL,
        osmId,
        tagName,
        newTagValue,
      });
      handleSuccess();
    } catch (error) {
      handleError(
        error,
        t`Something went wrong. Please let us know if the error persists.`,
      );
    }
  };

  const onUrlMutationSuccess = React.useCallback((urls: string[]) => {
    mutate((key: string) => urls.includes(key), undefined, {
      revalidate: true,
    });
  }, []);

  const Editor = getEditorForKey(tagKey);
  if (Editor) {
    return (
      <Editor
        feature={feature}
        tagKey={tagKey}
        onChange={setEditedTagValue}
        onUrlMutationSuccess={onUrlMutationSuccess}
        handleSubmitButtonClick={handleSubmitButtonClick}
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
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">
            Back
          </div>
        </AppStateLink>
      </footer>
    </StyledReportView>
  );
};
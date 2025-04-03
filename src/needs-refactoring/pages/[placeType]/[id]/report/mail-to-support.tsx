import { Button } from "@radix-ui/themes";
import type { LocalizedString } from "@sozialhelden/a11yjson";
import { t } from "@transifex/native";
import React, { type FC, useContext } from "react";
import { AppStateLink } from "~/needs-refactoring/components/App/AppStateLink";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import FeatureImage from "~/needs-refactoring/components/CombinedFeaturePanel/components/image/FeatureImage";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import { useUserAgent } from "~/modules/app/context/UserAgentContext";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { getLayout } from "~/components/layouts/DefaultLayout";

const reportSubject = (
  placeName: LocalizedString | string | undefined,
  categoryName: string | undefined,
) => {
  if (placeName) {
    // translator: Report email subject if place name is known
    return t("[Wheelmap] Problem with {placeName} on Wheelmap", { placeName });
  }
  if (categoryName) {
    // translator: Report email subject if place name is unknown, but place category name (for example ‘toilet’)
    // is known (don't use an indefinite article if it would need to be inflected in the target language)
    return t("[Wheelmap] Problem with a {categoryName} on Wheelmap", {
      categoryName,
    });
  }
  // translator: Report email subject if neither place name nor category name is known
  return t("[Wheelmap] Problem with a place on Wheelmap");
};

// translator: Report email body with place URL
const reportBody = (
  url: string,
  userAgent: string,
) => t`(Please only write in English or German.)

Dear Sozialhelden,
something about this place is wrong: ${url}

The problem is:

My browser:\n\n${userAgent}`;

const makeEmailUri = (
  mailAddress: `${string}@${string}`,
  subject: string,
  body: string,
) =>
  `mailto:${mailAddress}` +
  `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const EmailView: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const userAgent = useUserAgent();

  const { placeName, categoryName } = useFeatureLabel({ feature });
  const subject = reportSubject(placeName, categoryName);
  const body = reportBody(
    global?.window?.location.href,
    userAgent?.ua ?? navigator?.userAgent,
  );

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h1>{t(`We're sorry about the inconvenience!`)}</h1>
      <p>
        {t(
          "To help you best, we kindly ask you to send us an email and our support will personally help you.",
        )}
      </p>
      <footer className="_footer">
        <Button asChild>
          <AppStateLink href="../report">{t("Back")}</AppStateLink>
        </Button>
        <Button asChild>
          <a
            className="_option _primary"
            href={makeEmailUri("bugs@wheelmap.org", subject, body)}
          >
            {t("Send us an email")}
          </a>
        </Button>
      </footer>
    </StyledReportView>
  );
};

function ReportSupportMail() {
  const { features } = useContext(FeaturePanelContext);

  const feature = features[0];

  return <EmailView feature={feature} />;
}

ReportSupportMail.getLayout = getLayout;

export default ReportSupportMail;

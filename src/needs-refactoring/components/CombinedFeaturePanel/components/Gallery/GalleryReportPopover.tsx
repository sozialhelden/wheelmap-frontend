import {
  Box,
  Button,
  Flex,
  Popover,
  RadioCards,
  Strong,
  Text,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GalleryContext } from "~/needs-refactoring/components/CombinedFeaturePanel/components/Gallery/Gallery";
import { ErrorScreen } from "~/needs-refactoring/components/shared/ErrorScreen";
import { SuccessScreen } from "~/needs-refactoring/components/shared/SuccessScreen";
import postImageReport from "~/needs-refactoring/lib/fetchers/ac/refactor-this/postImageReport";
import type { AccessibilityCloudImage } from "~/needs-refactoring/lib/model/ac/Feature";
import useAccessibilityCloud from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";

type ReportType = "wrong-place" | "outdated" | "offensive" | "other";

const reportReasons: Record<
  ReportType,
  { title: string; description: string }
> = {
  "wrong-place": {
    title: t("Image shows another place."),
    description: t("This image does not depict this place."),
  },
  outdated: {
    title: t("Outdated"),
    description: t("This image does not show the current state of this place."),
  },
  offensive: {
    title: t("Offensive or inappropriate"),
    description: t(
      "This image shows sexually explicit content, depicts violence or is inappropriate in another way.",
    ),
  },
  other: {
    title: t("Other problems"),
    description: t(
      "This image infringes on my copyright or has other problems.",
    ),
  },
};

export default function GalleryReportPopover({
  image,
}: {
  image: AccessibilityCloudImage;
}) {
  const api = useContext(GalleryContext);
  const { baseUrl, appToken } = useAccessibilityCloud({ cached: true });

  const defaultValue = Object.keys(reportReasons)[0];
  const [isSending, setIsSending] = useState(false);
  const [hasBeenSent, setHasBeenSent] = useState(false);
  const [sendingError, setSendingError] = useState<Error>();
  const [selectedReason, setSelectedReason] = useState(defaultValue);

  const reset = () => {
    setSendingError(undefined);
    setHasBeenSent(false);
  };

  const resetForm = () => {
    setSelectedReason(defaultValue);
  };

  const close = () => {
    api.setIsReportPopoverOpen(false);
  };

  const navigateToPreviousNonReportedImage = () => {
    if (api.size === 1) api.close();
    if (api.activeIndex === api.size - 1) api.previous();
    api.reload();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const sendReport = useCallback(async () => {
    setIsSending(true);
    try {
      await postImageReport(image._id, selectedReason, baseUrl, appToken);
      resetForm();
    } catch (error) {
      setSendingError(error);
    } finally {
      setIsSending(false);
      setHasBeenSent(true);
    }
  }, [image, selectedReason, baseUrl, appToken]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!api.isReportPopoverOpen && hasBeenSent) {
      reset();
      navigateToPreviousNonReportedImage();
    }
  }, [api.isReportPopoverOpen, hasBeenSent]);

  return (
    <Popover.Root
      open={api.isReportPopoverOpen}
      onOpenChange={api.setIsReportPopoverOpen}
    >
      <Popover.Trigger>
        <Button color="gray" variant="surface">
          {t("Report Image")}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        size={{ initial: "1", md: "2" }}
        width={{ initial: "360px", md: "480px" }}
      >
        {!hasBeenSent && (
          <>
            <Box>
              <Text>
                {t("Please select the problem you would like to report:")}
              </Text>
              <RadioCards.Root
                value={selectedReason}
                onValueChange={setSelectedReason}
                columns={{ initial: "1" }}
                mt="5"
              >
                {Object.entries(reportReasons).map(
                  ([type, { title, description }]) => (
                    <RadioCards.Item
                      value={type}
                      key={type}
                      disabled={isSending}
                    >
                      <Flex direction="column" width="100%">
                        <Text size="3">
                          <Strong>{title}</Strong>
                        </Text>
                        <Text>{description}</Text>
                      </Flex>
                    </RadioCards.Item>
                  ),
                )}
              </RadioCards.Root>
            </Box>
            <Flex justify="between" mt="5">
              <Popover.Close>
                <Button color="gray" variant="soft" size="3">
                  {t("Cancel")}
                </Button>
              </Popover.Close>
              <Button onClick={sendReport} loading={isSending} size="3">
                {t("Send report")}
              </Button>
            </Flex>
          </>
        )}
        {hasBeenSent && !sendingError && (
          <>
            <SuccessScreen
              heading={t("Report sent successfully!")}
              text={t(
                "Thank you for your report. The image will not be visible anymore until it has been checked by our staff. This can take a while, please be patient.",
              )}
            />
            <Flex justify="end">
              <Button variant="soft" size="3" onClick={close}>
                {t("Continue")}
              </Button>
            </Flex>
          </>
        )}
        {hasBeenSent && sendingError && (
          <>
            <ErrorScreen
              heading={t("Sending report failed!")}
              text={t("Please try again later.")}
              error={sendingError.toString()}
            />
            <Flex justify="start">
              <Button variant="soft" color="gray" size="3" onClick={reset}>
                {t("Back")}
              </Button>
            </Flex>
          </>
        )}
      </Popover.Content>
    </Popover.Root>
  );
}

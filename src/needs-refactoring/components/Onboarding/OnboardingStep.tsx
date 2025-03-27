import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import * as React from "react";
import { useEffect } from "react";
import { AppContext } from "~/needs-refactoring/lib/context/AppContext";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import {
  accessibilityColor as accessibilityColorName,
  accessibilityName,
  useAccessibilityDescription,
} from "~/needs-refactoring/lib/model/accessibility/accessibilityStrings";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import Icon from "../shared/Icon";
import StyledMarkdown from "../shared/StyledMarkdown";
import VectorImage from "../shared/VectorImage";
import { useProductName } from "./useProductName";

export const OnboardingStep: React.FC<{
  onClose?: () => unknown;
}> = ({ onClose = () => {} }) => {
  const { clientSideConfiguration } = React.useContext(AppContext) ?? {};
  const headerMarkdown = useTranslations(
    clientSideConfiguration?.textContent?.onboarding?.headerMarkdown,
  );

  const callToActionButton = React.createRef<HTMLButtonElement>();
  const handleClose = () => {
    // Prevent that touch up opens a link underneath the primary button after closing
    // the onboarding dialog
    setTimeout(() => onClose(), 10);
  };

  useEffect(() => {
    setTimeout(() => {
      callToActionButton.current?.focus();
    }, 100);
  }, [callToActionButton]);

  // translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
  const startButtonCaption = t("Okay, let’s go!");
  const productName = useProductName(clientSideConfiguration);

  return (
    <>
      <VectorImage
        svg={clientSideConfiguration?.branding?.vectorLogoSVG}
        svgHTMLAttributes={{ "aria-label": `${productName} logo` }}
        maxHeight="50px"
        maxWidth="200px"
        hasShadow={false}
      />

      {/* Hidden because from a purely visual perspective, it's clear what an onboarding dialog is. */}
      <VisuallyHidden>
        <Dialog.Title>
          {t("Welcome to {productName}!", { productName })}
        </Dialog.Title>
      </VisuallyHidden>

      <Dialog.Description>
        <Text as="div" my="2">
          <StyledMarkdown inline>{headerMarkdown || ""}</StyledMarkdown>
        </Text>

        <Grid gap="2" columns={{ initial: "1", md: "2" }} width="auto" asChild>
          <ul>
            <AccessibilityCard value="yes" />
            <AccessibilityCard value="limited" />
            <AccessibilityCard value="no" />
            <AccessibilityCard value="unknown" />
          </ul>
        </Grid>
      </Dialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button
            className="button-continue"
            onClick={handleClose}
            ref={callToActionButton}
            size="4"
            highContrast
          >
            {startButtonCaption}
          </Button>
        </Dialog.Close>
      </Flex>
    </>
  );
};
function AccessibilityCard(props: { value: YesNoLimitedUnknown }) {
  const { value } = props;
  const name = accessibilityName(value);
  const colorName = accessibilityColorName(value);
  // translator: Shown on the onboarding screen. To find it, click the logo at the top.
  const unknownAccessibilityIncentiveText = t("Help out by marking places!");

  return (
    <Card asChild>
      <li>
        <Flex gap="3" align="start" direction="row" asChild>
          <figure>
            <Box>
              <Icon
                containerHTMLAttributes={{
                  "aria-label": t(`${colorName} map marker`),
                  role: "img",
                }}
                markerHTMLAttributes={{ "aria-hidden": "true" }}
                iconHTMLAttributes={{ "aria-hidden": "true" }}
                accessibility={value}
                category={undefined}
                isMainCategory
                size="big"
                withArrow
                shadowed
              />
            </Box>
            <Box asChild>
              <figcaption>
                {/* biome-ignore lint/a11y/useSemanticElements: Using 'correct' semantic HTML here
                    would create an invalid DOM tree. The ARIA tree stays sensible here. */}
                <Text as="p" weight="bold" role="term">
                  {name}
                </Text>
                {/* biome-ignore lint/a11y/useSemanticElements: See above */}
                <Text as="p" color="gray" role="definition">
                  {useAccessibilityDescription(value) ||
                    unknownAccessibilityIncentiveText}
                </Text>
              </figcaption>
            </Box>
          </figure>
        </Flex>
      </li>
    </Card>
  );
}

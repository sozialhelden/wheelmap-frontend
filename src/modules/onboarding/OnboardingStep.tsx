import {
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
import { WhitelabelContext } from "~/hooks/useWhitelabel";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import {
  accessibilityColor as accessibilityColorName,
  accessibilityName,
} from "~/needs-refactoring/lib/model/accessibility/accessibilityStrings";
import StyledMarkdown from "../../needs-refactoring/components/shared/StyledMarkdown";
import VectorImage from "../../needs-refactoring/components/shared/VectorImage";
import { useProductName } from "./hooks/useProductName";
import { useOnboardingCopy } from "~/modules/onboarding/hooks/useOnboardingCopy";
import { getAccessibilityIcon } from "~/components/icons/getAccessibilityIcon";
import { useNavigation } from "~/needs-refactoring/lib/useNavigation";

export const OnboardingStep: React.FC<{
  onClose?: () => unknown;
}> = ({ onClose = () => {} }) => {
  const { clientSideConfiguration } = React.useContext(WhitelabelContext) ?? {};
  const headerMarkdown = useTranslations(
    clientSideConfiguration?.textContent?.onboarding?.headerMarkdown,
  );
  const { onboardingHeading, startButtonText } = useOnboardingCopy();
  const { linksInDropdownMenu } = useNavigation();
  const faqLink = linksInDropdownMenu.find((link) => link.label === "FAQ");

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
        <Dialog.Title>{onboardingHeading}</Dialog.Title>
      </VisuallyHidden>

      <Dialog.Description>
        <Text as="div" my="3">
          <StyledMarkdown inline>{headerMarkdown || ""}</StyledMarkdown>
        </Text>

        <Grid
          gap="2"
          columns={{ initial: "1", md: "2" }}
          width="auto"
          asChild
          mb="4"
          mt="4"
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <AccessibilityCard value="yes" />
            <AccessibilityCard value="limited" />
            <AccessibilityCard value="no" />
            <AccessibilityCard value="unknown" />
          </ul>
        </Grid>
      </Dialog.Description>

      <Flex gap="3" mt="5" justify="end" direction="column">
        <Dialog.Close>
          <Button
            className="button-continue"
            onClick={handleClose}
            ref={callToActionButton}
            size="3"
            highContrast
          >
            {startButtonText}
          </Button>
        </Dialog.Close>

        <Button size="3" variant="soft" asChild>
          <a href={faqLink?.url} target="_blank" rel="noopener noreferrer">
            {t("Learn more")}
          </a>
        </Button>
      </Flex>
    </>
  );
};
function AccessibilityCard(props: { value: YesNoLimitedUnknown }) {
  const { value } = props;
  const name = accessibilityName(value);
  const colorName = accessibilityColorName(value);
  const Icon = getAccessibilityIcon(value);
  const unknownAccessibilityIncentiveText = t("Help out by marking places!");

  return (
    <Card asChild>
      <li>
        <Flex
          gap="2"
          align="center"
          justify="center"
          direction="column"
          width="100%"
          height="100%"
        >
          {Icon ? (
            <Icon
              aria-label={t(`${colorName} map marker`)}
              style={{ transform: "scale(2)", margin: "2rem 0" }}
            />
          ) : null}
          <Text as="p" weight="bold" align="center">
            {name}
          </Text>
        </Flex>
      </li>
    </Card>
  );
}

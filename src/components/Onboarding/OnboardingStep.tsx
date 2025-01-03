import * as React from "react";
import { useEffect } from "react";
import { AppContext } from "../../lib/context/AppContext";
import {
  accessibilityDescription,
  accessibilityName,
} from "../../lib/model/accessibility/accessibilityStrings";
import Icon from "../shared/Icon";
import VectorImage from "../shared/VectorImage";
import { selectHeaderMarkdownHTML, selectProductName } from "./language";
import { Box, Button, Card, Dialog, Flex, Grid, Text } from "@radix-ui/themes";
import { YesNoLimitedUnknown } from "../../lib/model/ac/Feature";
import { t } from "ttag";

export const OnboardingStep: React.FC<{
  onClose?: () => unknown;
}> = ({ onClose = () => {} }) => {
  const { clientSideConfiguration } = React.useContext(AppContext) ?? {};
  const headerMarkdownHTML = selectHeaderMarkdownHTML(clientSideConfiguration);

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
  const startButtonCaption = t`Okay, let’s go!`;

  return (
    <>
      <VectorImage
        className="logo"
        svg={clientSideConfiguration?.branding?.vectorLogoSVG}
        role="banner"
        aria-label={selectProductName(clientSideConfiguration)}
        maxHeight="50px"
        maxWidth="200px"
        hasShadow={false}
      />

      {headerMarkdownHTML && (
        <Text
          as="p"
          id="wheelmap-claim-onboarding"
          className="claim"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: The SVG content is managed by the team.
          dangerouslySetInnerHTML={{ __html: headerMarkdownHTML }}
        />
      )}
      <Grid gap="2" columns={{ initial: "1", md: "2" }} width="auto">
        <AccessibilityCard value="yes" />
        <AccessibilityCard value="limited" />
        <AccessibilityCard value="no" />
        <AccessibilityCard value="unknown" />
      </Grid>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button
            className="button-continue"
            onClick={handleClose}
            ref={callToActionButton}
            size="4"
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

  // translator: Shown on the onboarding screen. To find it, click the logo at the top.
  const unknownAccessibilityIncentiveText = t`Help out by marking places!`;

  return (
    <Card>
      <Flex gap="3" align="start" direction="row">
        <Box>
          <Icon
            accessibility={value}
            category={null}
            isMainCategory
            size="big"
            withArrow
            shadowed
            centered
          />
        </Box>
        <Box>
          <Text as="div" weight="bold">
            {accessibilityName(value)}
          </Text>
          <Text as="div" color="gray">
            {accessibilityDescription(value) ||
              unknownAccessibilityIncentiveText}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}

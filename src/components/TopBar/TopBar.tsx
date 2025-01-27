import { Box, Button, Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import { t } from "ttag";
import NeedsIcon from "~/components/icons/actions/Needs";
import { translatedStringFromObject } from "~/lib/i18n/translatedStringFromObject";
import type { ClientSideConfiguration } from "~/lib/model/ac/ClientSideConfiguration";
import Logo from "./Logo";
import Navigation from "./Navigation";

const StyledTopBar = styled.header`
    position: fixed;
    top: -1px;
    left: -1px;
    right: -1px;
    height: auto;
    z-index: 1;
    padding: var(--space-2);
    border-bottom: 2px solid var(--gray-5);
    background: var(--gray-1);
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    
    @media (max-width: 768px) {
        grid-template-columns: 65px 1fr 65px;
    }
`;

const NeedPickerButton = styled(Button)`
    max-width: 100%;
    line-height: 1.1;
`;

const NeedPickerIcon = styled.span`
    background: var(--accent-9);
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    // --space-4 is the spacing used by the parent NeedPickerButton in size 3
    margin-right: calc(-1 * calc(var(--space-4) - .4rem));
    flex-shrink: 0;
`;

export default function TopBar(props: {
  clientSideConfiguration: ClientSideConfiguration;
}) {
  const { clientSideConfiguration } = props;
  const { textContent, branding } = clientSideConfiguration;
  const { product } = textContent || {};
  const { name, claim } = product || {};

  // The product name is configurable in the app's whitelabel settings.
  const productName = translatedStringFromObject(name) || "A11yMap";
  const claimString = translatedStringFromObject(claim);

  return (
    <StyledTopBar role="banner">
      <Flex justify="start" align="center" overflow="hidden" gap="4">
        <Logo {...{ branding, productName }} />
        <Box asChild display={{ initial: "none", lg: "block" }}>
          <Text as="div" size={{ initial: "2", sm: "2", md: "3", xl: "3" }}>
            {claimString}
          </Text>
        </Box>
      </Flex>
      <Flex justify="center" align="center">
        <NeedPickerButton variant="soft" size="3">
          {t`What do you need?`}
          <NeedPickerIcon>
            <NeedsIcon />
          </NeedPickerIcon>
        </NeedPickerButton>
      </Flex>
      <Flex justify="end" align="center">
        <Navigation />
      </Flex>
    </StyledTopBar>
  );
}

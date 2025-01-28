import { Box, Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import NeedsPicker from "~/components/TopBar/NeedsPicker";
import { translatedStringFromObject } from "~/lib/i18n/translatedStringFromObject";
import type { ClientSideConfiguration } from "~/lib/model/ac/ClientSideConfiguration";
import Logo from "./TopBar/Logo";
import Navigation from "./TopBar/Navigation";

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
        <NeedsPicker />
      </Flex>
      <Flex justify="end" align="center">
        <Navigation />
      </Flex>
    </StyledTopBar>
  );
}

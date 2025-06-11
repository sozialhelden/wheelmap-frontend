import { Box, Flex, Text } from "@radix-ui/themes";
import styled from "styled-components";
import Logo from "~/components/layout/Logo";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import NeedsPicker from "~/modules/needs/components/NeedsPicker";
import Navigation from "~/needs-refactoring/components/navigation/Navigation";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";

const StyledTopBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--topbar-height);
    box-sizing: border-box;
    padding: var(--space-2) var(--space-3);;
    border-bottom: 2px solid var(--gray-5);
    background: var(--color-panel);
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    z-index: 20;
    
    @media (max-width: 768px) {
        grid-template-columns: 65px 1fr 65px;
    }
`;

export default function TopBar() {
  const { clientSideConfiguration } = useAppContext();
  const { textContent, branding } = clientSideConfiguration;

  const claim = useTranslations(textContent?.product?.claim);

  return (
    clientSideConfiguration && (
      <StyledTopBar role="banner">
        <Flex justify="start" gap="4" align="center">
          <Logo branding={branding} />
          <Box asChild display={{ initial: "none", lg: "block" }}>
            <Text as="div" size={{ initial: "2", sm: "2", md: "3", xl: "3" }}>
              {claim}
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
    )
  );
}

import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import type { ClientSideConfiguration } from "../../../lib/model/ac/ClientSideConfiguration";
import VectorImage from "../../shared/VectorImage";
import AppLinks from "./AppLinks";
import { Box, Button, Card, DropdownMenu, Flex, Inset, Popover, Text, Theme, useThemeContext } from "@radix-ui/themes";
import { AppStateLink } from "../AppStateLink";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";

type Props = {
  clientSideConfiguration: ClientSideConfiguration;
  className?: string;
};

const StyledCard = styled(Card)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  z-index: 1;
`;

export default function MainMenu(props: Props) {
  const { clientSideConfiguration } = props;
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = React.useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: when pathname changes, the effect must be triggered.
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // The product name is configurable in the app's whitelabel settings.
  const productName =
    translatedStringFromObject(
      props.clientSideConfiguration.textContent?.product?.name,
    ) || "A11yMap";
  const claimString = translatedStringFromObject(
    clientSideConfiguration?.textContent?.product?.claim,
  );

  const logoHomeLink = (
    <AppStateLink href="/">
      <Button
        aria-label={t`Home`}
        variant="ghost"
        radius="none"
      >
        <VectorImage
          className="logo"
          svg={props.clientSideConfiguration.branding?.vectorLogoSVG}
          aria-label={productName}
          maxHeight="30px"
          maxWidth="150px"
          hasShadow={false}
        />
      </Button>
    </AppStateLink>
  );

  const menuButton = (
    <Button variant="soft" size="3">
      {isOpen ? (
        <Cross2Icon width="24" height="24" />
      ) : (
        <HamburgerMenuIcon width="24" height="24" />
      )}
    </Button>
  );

  const appLinksPopover = (<Theme radius="small">
    <DropdownMenu.Root onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>{menuButton}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <AppLinks />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    </Theme>);

  const radius = useThemeContext().radius;

  return (
    <Theme radius="none">
      <StyledCard variant="surface">
        <Inset>
          <Theme radius={radius}>
            <Flex justify={"between"} align="center" p="2">
              <Flex align="center" gap="4">
                {logoHomeLink}
                <Text as="div">{claimString}</Text>
              </Flex>

                <div id="main-menu" role="menu">
                  {appLinksPopover}
                </div>
            </Flex>
          </Theme>
        </Inset>
      </StyledCard>
    </Theme>
  );
}

import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import type { ClientSideConfiguration } from "../../../lib/model/ac/ClientSideConfiguration";
import VectorImage from "../../shared/VectorImage";
import {
  Button,
  Card,
  Flex,
  Inset,
  Text,
  Theme,
  useThemeContext,
} from "@radix-ui/themes";
import { AppStateLink } from "../AppStateLink";
import MainMenuLinks from "./MainMenuLinks";

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

  @media (max-width: 768px) {
    .claim {
      display: none;
    }
  }
`;

export default function MainToolbar(props: Props) {
  const { clientSideConfiguration } = props;

  // The product name is configurable in the app's whitelabel settings.
  const productName =
    translatedStringFromObject(
      props.clientSideConfiguration.textContent?.product?.name,
    ) || "A11yMap";
  const claimString = translatedStringFromObject(
    clientSideConfiguration?.textContent?.product?.claim,
  );

  const logoHomeLink = (
    <Button aria-label={t`Home`} variant="ghost" radius="none" asChild>
      <AppStateLink href="/onboarding">
        <VectorImage
          className="logo"
          svg={props.clientSideConfiguration.branding?.vectorLogoSVG}
          aria-label={productName}
          maxHeight="30px"
          maxWidth="150px"
          hasShadow={false}
        />
      </AppStateLink>
    </Button>
  );

  const radius = useThemeContext().radius;

  return (
    <Theme radius="none">
      <StyledCard variant="surface">
        <Inset>
          <Theme radius={radius}>
            <Flex justify={"between"} align="center" p="2">
              <Flex align="center" gap="4">
                {logoHomeLink}
                <Text
                  className="claim"
                  as="div"
                  size={{ initial: "2", sm: "2", md: "3", xl: "3" }}
                >
                  {claimString}
                </Text>
              </Flex>

              <MainMenuLinks />
            </Flex>
          </Theme>
        </Inset>
      </StyledCard>
    </Theme>
  );
}

import {
  Card,
  Flex,
  Inset,
  Text,
  Theme,
  useThemeContext,
} from "@radix-ui/themes";
import styled from "styled-components";
import { translatedStringFromObject } from "../../../lib/i18n/translatedStringFromObject";
import type { ClientSideConfiguration } from "../../../lib/model/ac/ClientSideConfiguration";
import MainMenuLinks from "./MainMenuLinks";
import LogoHomeLink from "./LogoHomeLink";

type Props = {
  clientSideConfiguration: ClientSideConfiguration;
  className?: string;
};

const StyledBar = styled(Card)`
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
  const { textContent, branding } = clientSideConfiguration;
  const { product } = textContent || {};
  const { name, claim } = product || {};

  // The product name is configurable in the app's whitelabel settings.
  const productName = translatedStringFromObject(name) || "A11yMap";
  const claimString = translatedStringFromObject(claim);

  const radius = useThemeContext().radius;

  return (
    <Theme radius="none">
      <StyledBar variant="surface">
        <Inset>
          <Theme radius={radius}>
            <Flex justify={"between"} align="center" p="2">
              <Flex align="center" gap="4">
                <LogoHomeLink {...{ branding, productName }} />
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
      </StyledBar>
    </Theme>
  );
}

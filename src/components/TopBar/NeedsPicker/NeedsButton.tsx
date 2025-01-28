import { Button } from "@radix-ui/themes";
import styled from "styled-components";
import { t } from "ttag";
import NeedsIcon from "~/components/icons/actions/Needs";

const StyledButton = styled(Button)`
  max-width: 100%;
  line-height: 1.1;
`;
const IconWrapper = styled.span`
  background: var(--accent-9);
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  // --space-4 is the spacing used by the parent Button in size 3
  margin-right: calc((var(--space-4) - .4rem) * -1);
  flex-shrink: 0;
`;

export function NeedsButton(props) {
  return (
    <StyledButton {...props} variant="soft" size="3">
      {t`What do you need?`}
      <IconWrapper>
        <NeedsIcon />
      </IconWrapper>
    </StyledButton>
  );
}

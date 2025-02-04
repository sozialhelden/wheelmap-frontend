import { Button, Flex, Text, Theme, Tooltip } from "@radix-ui/themes";
import { type RefObject, forwardRef } from "react";
import styled from "styled-components";
import { t } from "ttag";
import NeedsIcon from "~/icons/NeedsIcon";
import { useNeeds } from "~/lib/useNeeds";

const StyledButton = styled(Button)`
  max-width: 100%;
  line-height: 1.1;
  position: relative;
  padding-left: .4rem;
  padding-right: .4rem;
`;
const IconWrapper = styled.span`
  background: var(--accent-9);
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  // --space-4 is the spacing used by the parent radix button Button in size 3
  flex-shrink: 0;
`;
const NumberBadge = styled.span`
  position: absolute;
  top: -.25rem;
  right: -.3rem;
  font-weight: bold;
  color: var(--gray-12);
  background: var(--gray-7);
  padding: .06rem .18rem;
  min-width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-3);
  font-size: .85rem;
`;

export const NeedsButton = forwardRef(function NeedsButton(props, ref) {
  const { needs: needsMap } = useNeeds();

  const needs = Object.values(needsMap);
  const needsWithIcon = needs.filter(({ icon }) => Boolean(icon));

  return (
    <Theme radius="full" asChild>
      <StyledButton
        {...props}
        variant="soft"
        size="3"
        ref={ref as RefObject<HTMLButtonElement>}
      >
        {needs.length === 0 && <Text ml="3">{t`What do you need?`}</Text>}
        {needsWithIcon.length > 0 && (
          <Flex gap="2" ml="3" aria-hidden>
            {needsWithIcon.map(({ label, icon: Icon }) => (
              <Tooltip content={`${label()}`} key={label()}>
                <Icon />
              </Tooltip>
            ))}
          </Flex>
        )}
        <IconWrapper>
          <NeedsIcon />
        </IconWrapper>
        {needs.length > 0 && (
          <NumberBadge aria-label={t`You have ${needs.length} needs selected`}>
            {needs.length}
          </NumberBadge>
        )}
      </StyledButton>
    </Theme>
  );
});

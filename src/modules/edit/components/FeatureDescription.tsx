import React, { type ReactNode } from "react";
import { Text } from "@radix-ui/themes";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

const DescriptionContainer = styled.div`
    display: flex;
    padding: var(--space-4);
`;

const FeatureDescription = ({ children }: Props) => {
  return (
    <DescriptionContainer>
      <Text>{children}</Text>
    </DescriptionContainer>
  );
};
export default FeatureDescription;

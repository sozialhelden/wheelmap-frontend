import type { ReactNode } from "react";
import { forwardRef } from "react";
import styled from "styled-components";

const ImageList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
`;

export const GalleryGrid = forwardRef<HTMLElement, { children: ReactNode }>(
  ({ children }) => {
    return <ImageList>{children}</ImageList>;
  },
);

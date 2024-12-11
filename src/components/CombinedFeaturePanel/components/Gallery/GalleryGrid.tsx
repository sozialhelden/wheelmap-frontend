import type { FC, ReactNode } from "react";
import styled from "styled-components";

const ImageList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
`;

export const GalleryGrid: FC<{ children: ReactNode }> = ({ children }) => {
  return <ImageList>{children}</ImageList>;
};

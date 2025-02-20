import type { FC, ReactNode } from "react";
import styled from "styled-components";

const ImageList = styled.ul`
  // this keeps the implicit list role in voice-over on macos 
  // changing it to none will remove its list semantics
  list-style-type: "";
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
`;

export const GalleryGrid: FC<{ children: ReactNode }> = ({ children }) => (
  <ImageList>{children}</ImageList>
);

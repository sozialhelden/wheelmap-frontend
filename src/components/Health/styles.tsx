import styled from "styled-components";
import IncluscienceLogo from "../MapLegacy/IncluscienceLogo";
import SozialheldenInnenLogo from "../MapLegacy/SozialheldInnenLogo";

export const containerSpacing = "1rem";
export const borderRadius = "2rem";
export const responsiveValue = 800;
export const maxContentWidth = 1280;

export const StyledColors = {
  green: "#77AD2B",
  grey: "grey",
  silver: "#f2f2f0",
  red: "#d51030",
  orange: "#f39e3b",
};
export const HStyles = `
  height: auto;
  margin: 0;
  padding: 0;
`;
export const inputStyles = `
  background-color: transparent;
  border: 1px solid ${StyledColors.silver};
  padding-inline: 0.3rem;
  padding-block: 0.5rem;
  margin-bottom: 0.5rem;
`;
export const linkStyles = `
color: ${StyledColors.grey};
cursor: pointer;
text-decoration: none !important;
:hover {
  color: ${StyledColors.green};
}
svg {
  vertical-align: middle;
  margin-bottom: 0.2rem;
}
`;

export const chips = `
  background-color: white;
  border: 1px solid ${StyledColors.green};
  color: ${StyledColors.green};
  font-size: 0.8rem;
  border-radius:${borderRadius};
  margin-inline: 0.1rem;
  font-weight: 6500;
  padding: 0.75rem;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
  @media screen and (max-width: ${responsiveValue}px) {
    display:block;
    margin-bottom: 0.5rem;
  }
`;

export const StyledMainContainer = styled.div`
  background-color: rgb(255, 255, 255, 0.95);
  > div {
    overflow-y: auto;
    margin-top: 3rem;
    margin-inline: auto;
    display: grid;
    grid-gap: ${containerSpacing};
    grid-template-columns: 1fr 2fr;
    max-width: ${maxContentWidth}px;
    width: 100%;
    height: 100vh;
    @media screen and (max-width: ${responsiveValue}px) {
      grid-template-columns: 1fr;
    }
  }
`;

export const StyledMainContainerColumn = styled.div`
  background-color: rgb(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: ${containerSpacing};
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  height: calc(100vh - 3rem);
  overflow-y: auto;
`;

export const StyledH2 = styled.h2<{ $fontBold?: boolean }>`
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  ${HStyles}
`;

export const StyledH3 = styled.h3<{ $fontBold?: boolean }>`
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  ${HStyles}
`;

export const StyledH4 = styled.h4<{ $fontBold?: boolean }>`
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  ${HStyles}
`;

export const StyledH5 = styled.h5<{ $fontBold?: boolean }>`
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  ${HStyles}
`;

export const StyledHDivider = styled.hr<{ $colored?: any; $space?: number }>`
  width: 100%;
  border: none;
  background-color: ${({ $colored }) => ($colored ? $colored : "transparent")};
  margin-bottom: ${({ $space }) => ($space ? $space + "px" : "1px")};
  margin-top: ${({ $space }) => ($space ? $space + "px" : "1px")};
`;

export const FullSizeFlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 2rem;
`;
export const StyledTextInput = styled.input`
  ${inputStyles}
`;
export const StyledSelect = styled.select`
  ${inputStyles}
`;

export const StyledLink = styled.a`
  ${linkStyles}
`;

export const StyledButtonAsLink = styled.button`
  background-color: transparent;
  border: none;
  ${linkStyles}
  @media screen and (max-width: ${responsiveValue}px) {
    text-align: left;
  }
`;

export const StyledSearchResultHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  @media screen and (max-width: ${responsiveValue}px) {
    flex-direction: column;
    h4 {
      text-align: right;
    }
    button {
      padding: 0;
    }
  }
`;

export const StyledLabel = styled.label<{ $fontBold?: string }>`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
`;

export const StyledLoadingLabel = styled.label`
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
  background-color: ${StyledColors.green};
  font-weight: "bold";
`;

export const StyledUL = styled.ul`
  padding-inline-start: 0;
  list-style-type: none;
  li {
    &:hover {
      background-color: ${StyledColors.silver};
    }
    margin-bottom: ${containerSpacing};
    padding: 1rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  }
`;
export const StyledLoadingSpinner = styled.div`
  border: 0.5rem solid #f3f3f3;
  border-radius: 50%;
  border-top: 0.5rem solid ${StyledColors.green};
  width: 5rem;
  height: 5rem;
  animation: spin 2s linear infinite;
  margin-block: 2rem;
  margin-inline: ${containerSpacing};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;
export const StyledChip = styled.span`
  ${chips}
`;
export const StyledButton = styled.button`
  cursor: pointer;
  ${chips} :hover {
    background-color: ${StyledColors.green};
    color: white;
  }
`;
export const StyledType = styled.span`
  ${chips};
`;

export const StyledWheelchairFilter = styled.div`
  margin-block: 1rem;
  padding: 1rem;
  border: ${StyledColors.silver} 1px solid;
  border-radius: 5px;
`;

export const StyledIncluscienceLogo = styled(IncluscienceLogo)`
  height: 1.2em;
`;
export const StyledSozialheldInnenLogo = styled(SozialheldenInnenLogo)`
  height: 2em;
`;

export const StyledFooter = styled.footer`
  svg {
    vertical-align: middle;
  }
`;

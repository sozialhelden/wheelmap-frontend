import styled from "styled-components";
import colors from "../../lib/colors";
import IncluscienceLogo from "../MapLegacy/IncluscienceLogo";
import SozialheldenInnenLogo from "../MapLegacy/SozialheldInnenLogo";

export const containerSpacing = "1rem";
export const borderRadius = "2rem";
export const responsiveValue = 800;
export const maxContentWidth = 1280;

export const StyledColors = {
  green: "#77AD2B",
  grey: "grey",
  silver: "#575757",
  red: "#d51030",
  orange: "#f39e3b",
};
export const HStyles = `
  height: auto;
  margin: 0;
  padding: 0;
`;

export const inputStyles = `
  background-color: ${colors.neutralBackgroundColor};
  border:unset;
  border-bottom: 2px solid ${colors.darkLinkColor};
  color: ${colors.darkLinkColor};
  padding-block: 0.5rem;
`;

export const linkStyles = `
color: ${StyledColors.grey};
text-decoration: none !important;
:hover {
  color: unset;
}
svg {
  vertical-align: middle;
  margin-bottom: 0.2rem;
}
`;

export const StyledMainContainer = styled.div`
  background-color: rgb(255, 255, 255, 0.95);
  * {
    transition: all 0.2s ease-in-out;
  }
  > div {
    overflow-y: auto;
    margin-inline: auto;
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 1fr 2fr;
    max-width: ${maxContentWidth}px;
    width: 100%;
    height: 100vh;
    @media screen and (max-width: ${responsiveValue}px) {
      display: block;
    }
  }
`;

export const StyledMainContainerColumn = styled.div<{ $whiteBackground?: boolean }>`
  background-color: ${({ $whiteBackground }) => ($whiteBackground ? "white" : "transparent")};
  display: flex;
  flex-direction: column;
  max-width: 100%;
  padding: ${({ $whiteBackground }) => ($whiteBackground ? containerSpacing : "0")};
  box-shadow: ${({ $whiteBackground }) => ($whiteBackground ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none")};

  height: calc(100vh - 3rem);
  overflow-y: auto;

  @media screen and (max-width: ${responsiveValue}px) {
    height: unset;
  }
`;

export const StyledH1 = styled.h1<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  font-size: 1.2rem;
  margin-bottom: 3rem;
`;

export const StyledH2 = styled.h2<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  font-size: 1rem;
  ${HStyles}
`;

export const StyledH3 = styled.h3<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  ${HStyles}
`;

export const StyledH4 = styled.h4<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
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
`;
export const StyledTextInput = styled.input`
  ${inputStyles}
`;
export const StyledSelect = styled.select`
  ${inputStyles}
`;

export const StyledRadioBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledRadio = styled.input`
  margin-top: 0.5rem;
  margin-inline: 0.5rem;
`;

export const StyledLink = styled.div`
  display: block;
  padding: ${containerSpacing};
  ${linkStyles}
`;

export const StyledLinkFooter = styled.a`
  ${linkStyles}
`;

export const StyledButtonAsLink = styled.a`
  background-color: transparent;
  border: none;
  ${linkStyles}
  :hover {
    color: ${colors.linkColor};
  }
  @media screen and (max-width: ${responsiveValue}px) {
    text-align: left;
  }
`;

export const StyledDropDownListItem = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background: white;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border-radius: 4px;
  box-sizing: border-box;

  li {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover,
    &:focus {
      background-color: #f0f0f0;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
`;

export const StyledLabel = styled.label<{ $fontBold?: string }>`
  font-size: 1rem;
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  margin-bottom: 0.25rem;
`;

export const StyledSubLabel = styled.span`
  font-size: 0.8rem;
  display: block;
  margin-top: 0.5rem;
  color: ${StyledColors.grey};
`;

export const StyledLoadingLabel = styled.label`
  height: 2.25rem;
  padding-inline: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  color: white;
  background-color: ${StyledColors.green};
  font-weight: "bold";
  margin-bottom: 0.5rem;
`;

export const StyledUL = styled.ul`
  padding-inline-start: 0;
  list-style-type: none;
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
    background-color: white;
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

export const StyledBadge = styled.span`
  background-color: ${StyledColors.grey};
  color: white;
  text-align: center;
  padding: 0.2rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
`;

export const StyledClaim = styled.div`
  font-size: 0.8em;
  opacity: 0.6;
`;

export const StyledWheelchairFilter = styled.div`
  padding: 0.5rem;
  border: ${StyledColors.silver} 1px solid;
`;

export const StyledIncluscienceLogo = styled(IncluscienceLogo)`
  height: 1.2em;
`;
export const StyledSozialheldInnenLogo = styled(SozialheldenInnenLogo)`
  height: 2em;
`;

export const StyledFooter = styled.footer<{ $flexDirection?: string }>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => ($flexDirection ? $flexDirection : "column")};
  svg {
    vertical-align: middle;
  }
`;

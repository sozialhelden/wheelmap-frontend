import styled, { css } from "styled-components";
import colors from "../../lib/colors";
import IncluscienceLogo from "../MapLegacy/IncluscienceLogo";
import SozialheldenInnenLogo from "../MapLegacy/SozialheldInnenLogo";
import ToiletStatuAccessibleIcon from "../icons/accessibility/ToiletStatusAccessible";

export const containerSpacing = "1rem";
export const borderRadius = "2rem";
export const responsiveValue = 800;
export const maxContentWidth = 1280;

export const StyledColors = {
  green: "#77AD2B",
  grey: "#7b99a0",
  darkgrey: "#394e51",
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
color: inherit;
text-decoration: none !important;
:hover {
  color: unset;
}
svg {
  vertical-align: middle;
  margin-bottom: 0.2rem;
}
`;

export const shadowCSS = css`
  box-shadow: rgba(60, 64, 67, 0.1) 0px 1px 20px, rgba(60, 64, 67, 0.2) 0px 1px 3px;
`;

export const HugeText = styled.p`
  font-size: 1.25rem;
  opacity: 0.92;
`;

export const StyledListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;
  margin-bottom: 1rem;
  line-height: 1.5;
  background-color: white;
  ${shadowCSS}
`;

export const StyledAccessibleToiletIcon = styled(ToiletStatuAccessibleIcon)`
  margin-left: 0.25rem;
  margin-top: 0rem;
  width: 2rem;
`;

export const DialogContainer = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  line-height: 2rem;
  background-color: rgb(255, 255, 255, 1);
  border-radius: 0.25rem;
  ${shadowCSS}
  gap: .5rem;

  fieldset {
    border: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    max-width: 100%;
  }

  fieldset + fieldset {
    margin-top: 1rem;
  }
`;

export const StyledMainContainer = styled.div`
  * {
    outline-color: ${colors.linkColor};
  }
  background-color: ${colors.neutralBackgroundColor};
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
  display: flex;
  flex-direction: column;
  height: calc(100vh);
  max-width: 100%;
  padding: 1rem;
  overflow-y: auto;

  @media screen and (max-width: ${responsiveValue}px) {
    height: unset;
  }
`;

export const StyledH1 = styled.h1<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: normal;
`;

export const StyledH2 = styled.h2<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "normal")};
  font-size: 1rem;
  ${HStyles}
`;

export const StyledH3 = styled.h3<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "500" : "300")};
  ${HStyles}
`;

export const StyledH4 = styled.h4<{ $fontBold?: boolean; $textAlign?: string }>`
  text-align: ${({ $textAlign }) => ($textAlign ? $textAlign : "left")};
  font-weight: ${({ $fontBold }) => ($fontBold ? "bold" : "500")};
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

export const StyledBigTextInput = styled.input`
  ${inputStyles}
  font-size: 1.2rem;
`;

export const StyledSelect = styled.select`
  ${inputStyles}
  width: 100%;
`;

export const StyledRadioBox = styled.fieldset`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledRadio = styled.input`
  margin-top: 0.5rem;
  margin-inline: 0.5rem;
`;

export const StyledCheckbox = styled.input`
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
  font-size: 0.9rem;
  display: block;
  margin-top: 0.5rem;
  color: ${StyledColors.darkgrey};
  line-height: 1;
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

export const StyledUL = styled.ul<{ $showBullets?: boolean }>`
  padding-inline-start: 0;
  list-style-type: ${({ $showBullets }) => ($showBullets ? "circle" : "none")};
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
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  line-height: 1.25rem;
  margin-inline-end: 0.5rem;
`;

export const StyledClaim = styled.div`
  font-size: 0.8em;
  opacity: 0.6;
`;

export const StyledWheelchairFilter = styled.div`
  padding: 0rem;
  background: ${colors.neutralBackgroundColor};
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const StyledIncluscienceLogo = styled(IncluscienceLogo)`
  height: 1.1em;
`;
export const StyledSozialheldInnenLogo = styled(SozialheldenInnenLogo)`
  height: 2.1em;
`;

export const StyledFooter = styled.footer<{ $flexDirection?: string }>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => ($flexDirection ? $flexDirection : "column")};
  svg {
    vertical-align: middle;
  }
`;

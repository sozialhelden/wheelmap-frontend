import styled from "styled-components";

export const containerSpacing = "1rem";
export const borderRadius = "2rem";
export const responsiveValue = 640;

export const StyledColors = {
  green: "#77AD2B",
  grey: "silver",
  red: "#d51030",
  orange: "#f39e3b",
};

export const StyledCircle = styled.span<{ color?: boolean }>`
  border-radius: 50%;
  background-color: ${(props) => props.color};
  color: white;
  padding: 0.5rem;
`;

export const StyledLegend = styled.legend`
  font-size: 1rem !important;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const StyledLink = styled.a`
  text-decoration: none;
  :hover {
    color: ${StyledColors.green};
    text-decoration: none;
  }
`;

// Inputs - Start
export const inputStyles = `
  background-color: transparent;
  border: 1px solid ${StyledColors.grey};
  padding-inline: 0.3rem !important;
  padding-block: 0.5rem !important;
  margin-bottom: 0.5rem !important;
`;

export const StyledTextInput = styled.input`
  ${inputStyles}
`;

export const StyledSelect = styled.select`
  ${inputStyles}
`;
// Inputs - End

export const StyledLabel = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem !important;
`;

export const StyledSection = styled.section`
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  margin: 1rem !important;
  background-color: rgb(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const StyledUL = styled.ul`
  padding-inline-start: 0;
  list-style-type: none;
  li {
    margin-inline: ${containerSpacing} !important;
    margin-bottom: ${containerSpacing} !important;
    padding: 1rem;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  }
`;

export const StyledH2 = styled.h2`
  margin-top: 1rem !important;
  margin-inline: ${containerSpacing} !important;
`;

export const StyledLoadingSpinner = styled.div`
  border: 0.5rem solid #f3f3f3;
  border-radius: 50%;
  border-top: 0.5rem solid ${StyledColors.green};
  width: 5rem;
  height: 5rem;
  animation: spin 2s linear infinite;
  margin-top: 2rem !important;
  margin-inline: ${containerSpacing} !important;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

export const chips = `
  background-color: white;
  border: 1px solid ${StyledColors.green};
  color: ${StyledColors.green};
  border-radius: ${borderRadius};
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.5rem 0.5rem !important;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
`;

export const StyledButton = styled.button`
  ${chips} :hover {
    background-color: ${StyledColors.green};
    color: white;
  }
`;

export const StyledDescription = styled.span`
  ${chips}
`;

export const StyledType = styled.span`
  float: right;
  ${chips};
`;

export const StyledSearchFilterSection = styled.section`
  background-color: rgb(255, 255, 255, 1);
  margin: 1rem !important;
  padding-bottom: 1rem;
  height: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem !important;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
`;

export const StyledSearchFilterInputs = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
`;

export const StyledSearchFilterContainer = styled.div`
  width: min(100% - 2rem, max(800px, 100%));
  height: fit-content;
  margin-inline: ${containerSpacing} !important;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
  div {
    width: 100%;
  }

  @media screen and (max-width: ${responsiveValue}px) {
    flex-direction: column;
  }
`;

export const StyledSearchFilterDetails = styled.details`
  summary {
    cursor: pointer;
    margin-inline: ${containerSpacing} !important;
    width: 90%;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
`;

export const StyledHealthSiteContent = styled.div`
  margin-top: 3rem !important;
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: rgb(255, 255, 255, 0.95);
  width: 100vw;
  height: 100vh;
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledActiveFilterBar = styled.ul`
  margin-inline: ${containerSpacing} !important;
  min-height: 2.5rem;
  margin-block: 0.5rem !important;
  max-height: fit-content;
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

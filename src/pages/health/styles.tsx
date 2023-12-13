import styled from "styled-components";

const containerSpacing = "1rem";

export const StyledColors = {
  green: "#76b82a",
  grey: "silver",
};

export const StyledLegend = styled.legend`
  font-size: 1rem !important;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const StyledTextInput = styled.input`
  background-color: transparent;
  border: 1px solid ${StyledColors.grey};
  font-size: 1rem;
  padding: 0.5rem !important;
  margin-bottom: 1rem !important;
`;

export const StyledLabel = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem !important;
`;

export const StlyedSecion = styled.section`
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.05) 0px 1px 3px 1px;
  margin: 1rem !important;
  background-color: rgb(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const StyledH1 = styled.h1`
  margin-top: calc(50px + 1rem) !important;
  margin-inline: ${containerSpacing} !important;
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
  border-radius: 2rem;
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

export const StyledCheckbox = styled.input`
  opacity: 1;
  height: var(--switch-height);
  width: calc(3rem + 2px);
  appearance: inherit;
  background-color: transparent;
  border-radius: 2rem;
  box-shadow: inset 0 0.5px 1px rgba(0, 0, 0, 0.2), inset 0 0.5px 1px rgba(0, 0, 0, 0.2), inset 0 -0.5px 1px rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  position: relative;
  outline: none;
  cursor: pointer;
  ::before {
    height: var(--switch-height);
    width: var(--switch-height);
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background: ${StyledColors.grey};
    border-radius: 2rem;
    transform: scale(0.75);
    transition: 0.2s;
    box-shadow: 0 0.5px 0.5px rgba(0, 0, 0, 0.5), inset 0.5px 0.5px rgba(255, 255, 255, 0.2), inset -0.5px 0.5px rgba(255, 255, 255, 0.2);
  }

  :not(focus):focus-visible {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
    transition: 0s;
  }

  :checked {
    background-color: #fff;
    box-shadow: inset 0 0.2px 1px rgba(0, 0, 0, 0.2), inset 0 0.2px 1px rgba(0, 0, 0, 0.2), inset 0 -0.2px 1px rgba(0, 0, 0, 0.2);
  }

  :checked::before {
    left: calc(2rem - 6px);
    background: ${StyledColors.green};
  }
`;

export const StyledSelect = styled.select`
  background-color: transparent;
  border: 1px solid ${StyledColors.grey};
  font-size: 1rem;
  padding: 0.5rem !important;
  margin-bottom: 1rem !important;
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

  @media screen and (max-width: 600px) {
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
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255, 0.95);
  width: 100vw;
  height: 100vh;
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

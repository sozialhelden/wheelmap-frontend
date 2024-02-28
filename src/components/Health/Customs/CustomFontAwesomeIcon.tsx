import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyledCircle } from "../styles";

function CustomFontAwesomeIcon(props: any) {
  const { color, icon } = props;
  return (
    <StyledCircle color={color as never}>
      <FontAwesomeIcon icon={icon} color="white" size="lg" />
    </StyledCircle>
  );
}

export default CustomFontAwesomeIcon;

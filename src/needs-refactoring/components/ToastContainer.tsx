import { ToastContainer as ToastifyContainer } from "react-toastify";
import styled from "styled-components";

import "react-toastify/dist/ReactToastify.css";

const StyledToastContainer = styled(ToastifyContainer)`
width: min(400px, 80vw);
  > .Toastify__toast > .Toastify__toast-body {
    > .Toastify__toast-icon {
      visibility: hidden;
      width: 0;
    }
  }
`;

export default function ToastContainer() {
  return <StyledToastContainer position="bottom-center" stacked />;
}

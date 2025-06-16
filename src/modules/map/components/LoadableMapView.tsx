import { Spinner } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import styled from "styled-components";

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoadableMapView = dynamic(import("./MapView"), {
  ssr: false,
  loading: () => (
    <Container>
      <Spinner size="3" />
    </Container>
  ),
});

export default LoadableMapView;

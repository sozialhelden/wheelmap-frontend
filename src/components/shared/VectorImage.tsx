import styled, { css } from "styled-components";
import { omit } from "lodash";
import ISVGOResult from "../../lib/model/ac/ISVGOResult";
import { useEffect, useRef } from "react";

type ContainerProps = {
  maxWidth?: string;
  maxHeight?: string;
  hasShadow?: boolean;
};

export const shadowCSS = css`
  filter: drop-shadow(0 2px 0px rgba(0, 0, 0, 0.06)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.06));
`;

const Container = styled.div<ContainerProps>`
  /* Centers the contained image verticallly */
  line-height: 0;
  display: inline-block;
  vertical-align: middle;
  svg {
    ${(p) => (p.hasShadow === false ? null : shadowCSS)}
    max-height: ${(p) => p.maxHeight || "1.5em"};
    max-width: ${(p) => p.maxWidth || "1.5em"};
  }
`;

type Props = ContainerProps &
  React.HTMLAttributes<HTMLSpanElement> & {
    svg: ISVGOResult | undefined;
  };

export default function VectorImage(props: Props) {
  const svgSource = props.svg?.data;
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const svgElement = containerRef.current?.querySelector("svg");
    if (svgElement) {
      svgElement.setAttribute("role", "none");
    }
  }, []);

  if (!svgSource) {
    return null;
  }
  return (
    <Container
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgSource || "" }}
      {...omit(props, "svg", "hasShadow")}
    />
  );
}

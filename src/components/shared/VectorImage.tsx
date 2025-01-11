import styled, { css } from "styled-components";
import { omit } from "lodash";
import type ISVGOResult from "../../lib/model/ac/ISVGOResult";
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

type Props = ContainerProps & {
  svg: ISVGOResult | undefined;
  svgHTMLAttributes?: React.HTMLAttributes<SVGElement>;
  containerHTMLAttributes?: React.HTMLAttributes<HTMLDivElement>;
};

export default function VectorImage(props: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    svgHTMLAttributes,
    containerHTMLAttributes,
    svg,
    maxWidth,
    maxHeight,
    hasShadow,
  } = props;
  const svgSource = svg?.data;

  useEffect(() => {
    const svgElement = containerRef.current?.querySelector("svg");
    if (svgElement) {
      for (const key in svgHTMLAttributes) {
        svgElement.setAttribute(key, svgHTMLAttributes[key]);
      }
    }
  }, [svgHTMLAttributes]);

  if (!svgSource) {
    return null;
  }
  return (
    <Container
      ref={containerRef}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG code is only set by ourselves.
      dangerouslySetInnerHTML={{ __html: svgSource || "" }}
      {...containerHTMLAttributes}
      {...{ maxWidth, maxHeight, hasShadow }}
    />
  );
}

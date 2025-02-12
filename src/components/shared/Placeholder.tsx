import styled from "styled-components";

export const PlaceholderDiv = styled.div<{ color?: string }>`
  line-height: 1.25em;
  background-color: ${(p) => p.color || "rgba(0, 0, 0, 0.1)"};
  box-sizing: border-box;
  border-top: solid 0.2em transparent;
  border-bottom: solid 0.2em transparent;
`;

export const PlaceholderSquare = styled(PlaceholderDiv)<{
  size: string;
  color?: string;
}>`
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  min-width: ${(p) => p.size};
  min-height: ${(p) => p.size};
  max-width: ${(p) => p.size};
  max-height: ${(p) => p.size};
  background-color: ${(p) => p.color || "rgba(0, 0, 0, 0.1)"};
`;

export const PlaceholderCircle = styled(PlaceholderDiv)<{
  size: string;
  color?: string;
}>`
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  border-radius: ${(p) => p.size};
  background-color: ${(p) => p.color || "rgba(0, 0, 0, 0.1)"};
`;

export const PlaceholderSpan = styled.span<{ delay?: number; color?: string }>`
  color: transparent !important;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  display: inline-flex;
  vertical-align: baseline;
  background-color: hsla(from ${(p) => p.color || "black"} h s l / 0.1);
  border-radius: 4px;
  @keyframes fadeIn {
    0% {
      background-color: hsla(from ${(p) => p.color || "black"} h s l / 0.1);
    }
    50% {
      background-color: hsla(from ${(p) => p.color || "black"} h s l / 0.2);
    }
    100% {
      background-color: hsla(from ${(p) => p.color || "black"} h s l / 0.1);
    }
  }

  animation: fadeIn 2s ${(p) => (p.delay || 2) + 0.1}s ease-in infinite;
  filter: blur(1px);
`;

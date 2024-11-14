import { createContext, FC, HTMLAttributes, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { cx } from "../../lib/util/cx";
import { useInterval } from "../shared/useInterval";


export const LoadingIndicator: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const inflight = window.fetchInflight;
  const [loading, setLoading] = useState(0);
  useInterval(() => {
    if(inflight != window.fetchInflight) {
      setLoading(window.fetchInflight ?? 0);
    }
  }, 500)
  if(!loading) {
    return null;
  }
  return <div {...props} className={cx(props.className, "bp5-button bp5-large")}> <div className="loader"/> </div>
}

export const StyledLoadingIndicator = styled(LoadingIndicator)`
  position: fixed;
  left: calc(1rem + 40px + 10px);
  bottom: 1rem;

  min-height: 40px;
  min-width: 40px;
  font-size: 16px;
  padding: 10px 10px !important;

  animation: 0.5s reveal ease;
  @keyframes reveal {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

 .bp5-dark .loader {
  border-color: #f6f7f9;
 } 
 .bp5-light .loader {
  border-color: #1c2127;
 }
 .loader {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border: 2px solid;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  } 
`
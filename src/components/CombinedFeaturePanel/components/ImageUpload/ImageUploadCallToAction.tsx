import { Text } from "@radix-ui/themes";
import type { FC } from "react";
import styled from "styled-components";
import { t } from "ttag";

const CallToActionWrapper = styled.div`
    position: relative;
    height: 1rem;
    width: 100%;
`;

const CallToAction = styled.div`
    &::before {
        content: "";
        display: block;
        position: absolute;
        left: -16px;
        top: 50%;
        margin-top: -8px;
        width: 16px;
        height: 16px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent var(--accent-5) transparent transparent;
        border-image: none;
        box-sizing: border-box;
    }

    position: absolute;
    top: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 10rem;
    margin-left: 1rem;
    border: medium;
    padding: 0.4rem 0.6rem;
    border-radius: var(--radius-3);
    text-align: center;
    font-size: 90%;
    font-weight: 500;
    opacity: 0;
    color: var(--accent-11);
    background: var(--accent-5);
    animation: 1.5s ease-out 1s forwards slideIn;

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translate3d(-2px, -50%, 0px);
        }
        100% {
            opacity: 1;
            transform: translate3d(5px, -50%, 0px);
        }
    }
`;

export const ImageUploadCallToAction: FC = () => (
  <CallToActionWrapper>
    <CallToAction>
      <Text>{t`Your good deed of the day!`}</Text>
    </CallToAction>
  </CallToActionWrapper>
);

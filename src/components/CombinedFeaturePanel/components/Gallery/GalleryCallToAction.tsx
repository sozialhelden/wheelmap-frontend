import { FC } from 'react'
import styled from 'styled-components'

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
    border-color: transparent rgb(86, 105, 140) transparent transparent;
    border-image: none;
    box-sizing: border-box;
  }

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 10rem;
  margin-left: 1rem;
  padding: 0.4rem 0.6rem;
  border: medium;
  border-radius: 0.5em;
  text-align: center;
  font-size: 90%;
  font-weight: 500;
  color: white;
  opacity: 0;
  background: rgb(86, 105, 140);
  animation: 1.5s ease-out 1s forwards slideIn;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate3d(-2px, 0px, 0px);
    }
    100% {
        opacity: 1;
        transform: translate3d(5px, 0px, 0px);
    }
  }
`

export const GalleryCallToAction: FC = () => (
  <CallToAction>
    Your good deed of the day!
  </CallToAction>
)

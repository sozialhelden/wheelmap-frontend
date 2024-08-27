/*
  Based on the react-activity npm module.
  https://github.com/lukevella/react-activity

  The MIT License (MIT)

  Copyright (c) 2016 Luke Vella

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import * as React from 'react'
import styled from 'styled-components'
import ActivityIndicator, { IExternalProps } from './ActivityIndicator'

interface IProps {
  style: React.CSSProperties;
  className?: string;
  getBorderStyle: () => React.CSSProperties;
  margin?: string;
  size?: string;
  color?: string;
}

function UnstyledSpinner(props: IProps) {
  return <div style={props.style} className={props.className} />
}

const StyledSpinner = styled(UnstyledSpinner)`
  display: inline-block;
  &:after {
    content: ' ';
    line-height: 0;
    margin: ${(p) => p.margin || 0};
    padding: 0;
    display: block;
    width: ${(p) => p.size || '1em'};
    height: ${(p) => p.size || '1em'};
    border-radius: 50%;
    border: 6px solid ${(p) => p.color || 'rgba(0, 0, 0, 0.1)'};
    border-color: ${(p) => p.color || 'rgba(0, 0, 0, 0.1)'} transparent
      ${(p) => p.color || 'rgba(0, 0, 0, 0.1)'} transparent;
    animation: rotation 1.2s linear infinite;
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

export default function Spinner(props: Partial<IExternalProps>) {
  return <ActivityIndicator ComposedComponent={StyledSpinner} animationDuration={0.6} {...props} />
}

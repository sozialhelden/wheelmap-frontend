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

interface IComposedProps {
  style: React.CSSProperties;
  className?: string;
  getBorderStyle: (delay: number) => React.CSSProperties;
  getFillStyle: (delay: number) => React.CSSProperties;
  color?: string;
}

export interface IExternalProps {
  animationDuration: number;
  speed: number;
  animating: boolean;
  color?: string;
  size?: number;
  className?: string;
  margin?: string;
}

interface IProps extends IExternalProps {
  ComposedComponent: React.FunctionComponent<IComposedProps>;
}

export default class ActivityIndicator extends React.Component<IProps> {
  static defaultProps = {
    animationDuration: 3,
    speed: 1,
    animating: true,
  }

  constructor(props: IProps) {
    super(props)
    this.getDelayStyle = this.getDelayStyle.bind(this)
    this.getFillStyle = this.getFillStyle.bind(this)
    this.getBorderStyle = this.getBorderStyle.bind(this)
  }

  getDelayStyle(delay) {
    const style: React.CSSProperties = {}
    if (delay) {
      style.animationDelay = `-${delay * (1 / this.props.speed)}s`
    }
    return style
  }

  getFillStyle(delay) {
    const style = this.getDelayStyle(delay)
    if (this.props.color) {
      style.backgroundColor = this.props.color
    }
    return style
  }

  getBorderStyle(delay) {
    const style = this.getDelayStyle(delay)
    if (this.props.color) {
      style.borderColor = this.props.color
    }
    return style
  }

  render() {
    if (!this.props.animating) {
      return null
    }
    const containerStyle = {
      display: 'inline-block',
      fontSize: '16px',
      lineHeight: '0',
    }
    const indicatorStyle = {
      animationDuration: `${this.props.animationDuration * (1 / this.props.speed)}s`,
      fontSize: this.props.size || undefined,
    }
    const { ComposedComponent } = this.props
    return (
      <div style={containerStyle} className={`rai-activity-indicator ${this.props.className}`}>
        <ComposedComponent
          getFillStyle={this.getFillStyle}
          getBorderStyle={this.getBorderStyle}
          style={indicatorStyle}
          color={this.props.color}
        />
      </div>
    )
  }
}

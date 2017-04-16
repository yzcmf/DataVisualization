// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';

import PropTypes from 'prop-types';

import Animation from 'animation';
import {ANIMATED_SERIES_PROPS} from 'utils/series-utils';
import {arc as arcBuilder} from 'd3-shape';

import AbstractSeries from './abstract-series';
import {
  getAttributeFunctor,
  getAttr0Functor,
  extractScalePropsFromProps,
  getMissingScaleProps,
  getScalePropTypesByAttribute
} from 'utils/scales-utils';

const predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--arc';
const ATTRIBUTES = ['radius', 'angle'];

class ArcSeries extends AbstractSeries {
  constructor(props) {
    super(props);
    const scaleProps = this._getAllScaleProps(props);
    this.state = {scaleProps};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({scaleProps: this._getAllScaleProps(nextProps)});
  }

  /**
   * Get the map of scales from the props.
   * @param {Object} props Props.
   * @param {Array} data Array of all data.
   * @returns {Object} Map of scales.
   * @private
   */
  _getAllScaleProps(props) {
    const defaultScaleProps = this._getDefaultScaleProps(props);
    const userScaleProps = extractScalePropsFromProps(props, ATTRIBUTES);
    const missingScaleProps = getMissingScaleProps({
      ...defaultScaleProps,
      ...userScaleProps
    }, props.data, ATTRIBUTES);

    return {
      ...defaultScaleProps,
      ...userScaleProps,
      ...missingScaleProps
    };
  }

  /**
   * Get the list of scale-related settings that should be applied by default.
   * @param {Object} props Object of props.
   * @returns {Object} Defaults.
   * @private
   */
  _getDefaultScaleProps(props) {
    const {innerWidth, innerHeight} = props;
    const radius = Math.min(innerWidth / 2, innerHeight / 2);
    return {
      radiusRange: [0, radius],
      _radiusValue: radius,
      angleType: 'literal'
    };
  }

  render() {
    const {
      arcClassName,
      animation,
      className,
      center,
      data,
      marginLeft,
      marginTop,
      style = {}
    } = this.props;

    if (!data) {
      return null;
    }

    if (animation) {
      return (
        <Animation {...this.props} animatedProps={ANIMATED_SERIES_PROPS}>
          <ArcSeries {...this.props} animation={null}/>
        </Animation>
      );
    }
    const {scaleProps} = this.state;
    const {radiusDomain} = scaleProps;
    // need to generate our own functors as abstract series doesnt have anythign for us
    const radius = getAttributeFunctor(scaleProps, 'radius');
    const radius0 = getAttr0Functor(scaleProps, 'radius');
    const angle = getAttributeFunctor(scaleProps, 'angle');
    const angle0 = getAttr0Functor(scaleProps, 'angle');
    // but it does have good color support!
    const fill = this._getAttributeFunctor('fill') ||
      this._getAttributeFunctor('color');
    const stroke = this._getAttributeFunctor('stroke') ||
      this._getAttributeFunctor('color');
    const opacity = this._getAttributeFunctor('opacity');
    const x = this._getAttributeFunctor('x');
    const y = this._getAttributeFunctor('y');

    return (
      <g className={`${predefinedClassName} ${className}`}
        onMouseOver={this._seriesMouseOverHandler}
        onMouseOut={this._seriesMouseOutHandler}
        onClick={this._seriesClickHandler}
        ref="container"
        transform={`translate(${marginLeft + x(center)},${marginTop + y(center)})`}>
        {data.map((row, i) => {
          const noRadius = radiusDomain[1] === radiusDomain[0];
          const arcArg = {
            innerRadius: noRadius ? 0 : radius0(row),
            outerRadius: radius(row),
            startAngle: angle0(row) || 0,
            endAngle: angle(row)
          };
          const arcedData = arcBuilder();
          const rowStyle = row.style || {};
          return (<path {...{
            style: {
              opacity: opacity && opacity(row),
              stroke: stroke && stroke(row),
              fill: fill && fill(row),
              ...style,
              ...rowStyle
            },
            onClick: e => this._valueClickHandler(row, e),
            onMouseOver: e => this._valueMouseOverHandler(row, e),
            onMouseOut: e => this._valueMouseOutHandler(row, e),
            key: i,
            className: arcClassName,
            d: arcedData(arcArg)
          }} />);
        })}
      </g>
    );
  }
}
ArcSeries.propTypes = {
  ...AbstractSeries.propTypes,
  ...getScalePropTypesByAttribute('radius'),
  ...getScalePropTypesByAttribute('angle'),
  center: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  arcClassName: PropTypes.string
};
ArcSeries.defaultProps = {
  arcClassName: '',
  center: {x: 0, y: 0},
  className: ''
};
ArcSeries.displayName = 'ArcSeries';

export default ArcSeries;

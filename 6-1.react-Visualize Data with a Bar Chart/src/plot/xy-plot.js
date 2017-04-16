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
import equal from 'deep-equal';

import {extractScalePropsFromProps, getMissingScaleProps} from 'utils/scales-utils';
import {getStackedData, getSeriesChildren, getSeriesPropsFromChildren} from 'utils/series-utils';
import {getInnerDimensions, MarginPropType} from 'utils/chart-utils';
import {AnimationPropType} from 'animation';
import {CONTINUOUS_COLOR_RANGE, SIZE_RANGE, OPACITY_TYPE} from 'theme';

import DeckGLWrapper from './series/deck-gl-wrapper';
import CanvasWrapper from './series/canvas-wrapper';

const ATTRIBUTES = [
  'x',
  'y',
  'radius',
  'angle',
  'color',
  'fill',
  'stroke',
  'opacity',
  'size'
];

const DEFAULT_MARGINS = {
  left: 40,
  right: 10,
  top: 10,
  bottom: 40
};

/**
 * Remove parents from tree formatted data. deep-equal doesnt play nice with data
 * that has circular structures, so we make every node single directional by pruning the parents.
 * @param {Array} data - the data object to have circular deps resolved in
 * @returns {Array} the sanitized data
 */
function cleanseData(data) {
  return data.map(series => {
    if (!Array.isArray(series)) {
      return series;
    }
    return series.map(row => ({...row, parent: null}));
  });
}

/**
 * Wrapper on the deep-equal method for checking equality of next props vs current props
 * @param {Object} scaleMixins - Scale object.
 * @param {Object} nextScaleMixins - Scale object.
 * @returns {Boolean} whether or not the two mixins objects are equal
 */
function checkIfMixinsAreEqual(nextScaleMixins, scaleMixins) {
  const newMixins = {
    ...nextScaleMixins,
    _allData: cleanseData(nextScaleMixins._allData)
  };
  const oldMixins = {
    ...scaleMixins,
    _allData: cleanseData(scaleMixins._allData)
  };
  // it's hard to say if this function is reasonable?
  return equal(newMixins, oldMixins);
}

class XYPlot extends React.Component {

  static get propTypes() {
    return {
      animation: AnimationPropType,
      className: PropTypes.string,
      height: PropTypes.number.isRequired,
      margin: MarginPropType,
      onMouseDown: PropTypes.func,
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
      onMouseMove: PropTypes.func,
      stackBy: PropTypes.oneOf(ATTRIBUTES),
      width: PropTypes.number.isRequired
    };
  }

  static get defaultProps() {
    return {
      className: ''
    };
  }

  constructor(props) {
    super(props);
    this._mouseDownHandler = this._mouseDownHandler.bind(this);
    this._mouseLeaveHandler = this._mouseLeaveHandler.bind(this);
    this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
    this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
    const {stackBy} = props;
    const children = getSeriesChildren(props.children);
    const data = getStackedData(children, stackBy);
    this.state = {
      scaleMixins: this._getScaleMixins(data, props),
      data
    };
  }

  componentWillReceiveProps(nextProps) {
    const children = getSeriesChildren(nextProps.children);
    const nextData = getStackedData(children, nextProps.stackBy);
    const {scaleMixins} = this.state;
    const nextScaleMixins = this._getScaleMixins(nextData, nextProps);
    if (!checkIfMixinsAreEqual(nextScaleMixins, scaleMixins)) {
      this.setState({
        scaleMixins: nextScaleMixins,
        data: nextData
      });
    }
  }

  /**
   * Trigger mouse-down related callbacks if they are available.
   * @param {React.SyntheticEvent} event Mouse down event.
   * @private
   */
  _mouseDownHandler(event) {
    const {onMouseDown, children} = this.props;
    if (onMouseDown) {
      onMouseDown(event);
    }
    const seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach((child, index) => {
      const component = this.refs[`series${index}`];
      if (component && component.onParentMouseDown) {
        component.onParentMouseDown(event);
      }
    });
  }

  /**
   * Trigger movement-related callbacks if they are available.
   * @param {React.SyntheticEvent} event Mouse move event.
   * @private
   */
  _mouseMoveHandler(event) {
    const {onMouseMove, children} = this.props;
    if (onMouseMove) {
      onMouseMove(event);
    }
    const seriesChildren = getSeriesChildren(children);
    seriesChildren.forEach((child, index) => {
      const component = this.refs[`series${index}`];
      if (component && component.onParentMouseMove) {
        component.onParentMouseMove(event);
      }
    });
  }

  /**
   * Trigger onMouseLeave handler if it was passed in props.
   * @param {Event} event Native event.
   * @private
   */
  _mouseLeaveHandler(event) {
    const {onMouseLeave} = this.props;
    if (onMouseLeave) {
      onMouseLeave({event});
    }
  }

  /**
   * Trigger onMouseEnter handler if it was passed in props.
   * @param {Event} event Native event.
   * @private
   */
  _mouseEnterHandler(event) {
    const {onMouseEnter} = this.props;
    if (onMouseEnter) {
      onMouseEnter({event});
    }
  }

  /**
   * Get the list of scale-related settings that should be applied by default.
   * @param {Object} props Object of props.
   * @returns {Object} Defaults.
   * @private
   */
  _getDefaultScaleProps(props) {
    const {innerWidth, innerHeight} = getInnerDimensions(
      props,
      DEFAULT_MARGINS
    );
    return {
      xRange: [0, innerWidth],
      yRange: [innerHeight, 0],
      colorRange: CONTINUOUS_COLOR_RANGE,
      opacityType: OPACITY_TYPE,
      sizeRange: SIZE_RANGE
    };
  }

  /**
   * Get the map of scales from the props, apply defaults to them and then pass
   * them further.
   * @param {Object} data Array of all data.
   * @param {Object} props Props of the component.
   * @returns {Object} Map of scale-related props.
   * @private
   */
  _getScaleMixins(data, props) {

    const filteredData = data.filter(d => d);
    const allData = [].concat(...filteredData);

    const defaultScaleProps = this._getDefaultScaleProps(props);
    const userScaleProps = extractScalePropsFromProps(props, ATTRIBUTES);
    const missingScaleProps = getMissingScaleProps({
      ...defaultScaleProps,
      ...userScaleProps
    }, allData, ATTRIBUTES);
    const children = getSeriesChildren(props.children);
    const zeroBaseProps = {};
    const adjustBy = new Set();
    const adjustWhat = new Set();
    children.forEach((child, index) => {
      if (!child || !data[index]) {
        return;
      }
      ATTRIBUTES.forEach(attr => {
        const {
          isDomainAdjustmentNeeded,
          zeroBaseValue} = child.type.getParentConfig(
          attr,
          child.props
        );
        if (isDomainAdjustmentNeeded) {
          adjustBy.add(attr);
          adjustWhat.add(index);
        }
        if (zeroBaseValue) {
          zeroBaseProps[`${attr}BaseValue`] = 0;
        }
      });
    });
    return {
      ...defaultScaleProps,
      ...zeroBaseProps,
      ...userScaleProps,
      ...missingScaleProps,
      _allData: data,
      _adjustBy: Array.from(adjustBy),
      _adjustWhat: Array.from(adjustWhat),
      _stackBy: props.stackBy
    };
  }

  /**
   * Checks if the plot is empty or not.
   * Currently checks the data only.
   * @returns {boolean} True for empty.
   * @private
   */
  _isPlotEmpty() {
    const {data} = this.state;
    return !data || !data.length ||
      !data.some(series => series && series.some(d => d));
  }

  /**
   * Prepare the child components (including series) for rendering.
   * @returns {Array} Array of child components.
   * @private
   */
  _getClonedChildComponents() {
    const {animation} = this.props;
    const {scaleMixins, data} = this.state;
    const dimensions = getInnerDimensions(this.props, DEFAULT_MARGINS);
    const children = React.Children.toArray(this.props.children);
    const seriesProps = getSeriesPropsFromChildren(children);
    return children.map((child, index) => {
      let dataProps = null;
      if (seriesProps[index]) {
        // Get the index of the series in the list of props and retrieve
        // the data property from it.
        const {seriesIndex} = seriesProps[index];
        dataProps = {data: data[seriesIndex]};
      }
      return React.cloneElement(child, {
        ...dimensions,
        animation,
        ...seriesProps[index],
        ...scaleMixins,
        ...child.props,
        ...dataProps
      });
    });
  }

  renderDeckGlComponents(components, props) {
    const componentsToRender = components.filter(c => c && !c.type.requiresSVG && c.type.isDeckGL);
    if (componentsToRender.length === 0) {
      return null;
    }
    const animation = componentsToRender.some(layer => layer.props.animation);
    const {
      marginLeft,
      marginTop,
      marginBottom,
      marginRight,
      innerHeight,
      innerWidth
    } = componentsToRender[0].props;
    return (<DeckGLWrapper {...{
      animation,
      marginLeft,
      marginTop,
      marginBottom,
      marginRight,
      innerHeight,
      innerWidth
    }}>
      {componentsToRender}
    </DeckGLWrapper>);
  }

  renderCanvasComponents(components, props) {
    const componentsToRender = components.filter(c => c && !c.type.requiresSVG && c.type.isCanvas);

    if (componentsToRender.length === 0) {
      return null;
    }
    const {
      marginLeft,
      marginTop,
      marginBottom,
      marginRight,
      innerHeight,
      innerWidth
    } = componentsToRender[0].props;
    return (<CanvasWrapper {...{
      marginLeft,
      marginTop,
      marginBottom,
      marginRight,
      innerHeight,
      innerWidth
    }}>
      {componentsToRender}
    </CanvasWrapper>);
  }

  render() {
    const {
      className,
      width,
      height
    } = this.props;

    if (this._isPlotEmpty()) {
      return (
        <div
          className={`rv-xy-plot ${className}`}
          style={{
            width: `${width}px`,
            height: `${height}px`
          }}/>
      );
    }
    const components = this._getClonedChildComponents();

    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
        className={`rv-xy-plot ${className}`}>
        <svg
          className="rv-xy-plot__inner"
          width={width}
          height={height}
          onMouseDown={this._mouseDownHandler}
          onMouseMove={this._mouseMoveHandler}
          onMouseLeave={this._mouseLeaveHandler}
          onMouseEnter={this._mouseEnterHandler}>
          {components.filter(c => c && c.type.requiresSVG && !c.type.isDeckGL)}
        </svg>
        {this.renderCanvasComponents(components, this.props)}
        {this.renderDeckGlComponents(components, this.props)}
        {components.filter(c => c && !c.type.requiresSVG)}
      </div>
    );
  }
}

XYPlot.displayName = 'XYPlot';

export default XYPlot;

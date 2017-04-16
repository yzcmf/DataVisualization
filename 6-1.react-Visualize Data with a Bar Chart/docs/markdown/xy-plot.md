# XYPlot

XYPlot allows you to make line charts, area charts, scatterplots, heat maps, etc with animations and different interactions between them.

Currently following components are used for this purpose:

* XYPlot to wrap all the items.
* [Grids](grids.md) to show vertical and horizontal grids.
* [Axes](axes.md) to show X and Y axis.
* [Different kinds of series](series.md) for line/area/bar charts, scatterplots, heat maps, etc.
* [Hint](hint.md) to show the selected hint.
* [Crosshair](crosshair.md) for crosshairs.

## Usage

Import the necessary components from the library&hellip;

```jsx
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
```

&hellip; and add the following code to your `render` function:

```jsx
<XYPlot
  width={300}
  height={300}>
  <HorizontalGridLines />
  <LineSeries
    color="red"
    data={[
      {x: 1, y: 10},
      {x: 2, y: 5},
      {x: 3, y: 15}
    ]}/>
  <XAxis title="X" />
  <YAxis />
</XYPlot>
```

## Common concepts

XYPlot is a wrapper for series, hints, axes and other components. Most of these components do not require any properties by default, however it is expected that the user will pass the `data` property into each series.

`data` is an array of objects. Each item is some point on the chart. Object may contain following properties:

* `x`
* `y`
* `opacity` (optional)
* `fill` (optional)
* `stroke` (optional)
* `strokeWidth` (optional), `strokeStyle` (optional) - to control the width of the line series and whether they are dashed or solid.
* `color` (optional, used instead of `fill` and `stroke` if none of them is passed)
* `size` (optional)

If the property is not passed in any of the objects, the property is not visualized. The user can override the way how properties are visualized by passing custom range, domain or type of scales to the series or the entire chart (please see [Series](series.md) for more info).

Not all properties can be visualized in each series. Here's a short comparison of them:

|                      | `x` | `y` | `color` | `opacity` | `size` |
|----------------------|-----|-----|---------|-----------|--------|
| [LineSeries](line-series.md)  |  +  |  +  | +       |           |        |
| `AreaSeries`         |  +  |  +  | +       |           |        |
| [LineMarkSeries](line-series.md)     |  +  |  +  | +       |     +     | +      |
| `MarkSeries`         |  +  |  +  | +       |     +     | +      |
| [VerticalBarSeries](bar-series.md)  |  +  |  +  | +       |     +     |        |
| [HorizontalBarSeries](bar-series.md)|  +  |  +  | +       |     +     |        |
| `VerticalRectSeries`  |  +  |  +  | +       |     +     |        |
| `HorizontalRectSeries`|  +  |  +  | +       |     +     |        |
| [HeatmapSeries](heatmap-series.md)      |  +  |  +  | +       |     +     |        |      |


### A note on ordering

XYPlot is pretty flexible, and can accept most kinds of things DOM, SVG, really whatever react can build. As far as XYPlot is concerned there are two types of components in the world: those that can be rendered as part of an SVG tree and those that can't. It separates it's children into these two groups, and clusters the SVG elements under a root svg tag in order and then presents each of the remaining children in order. To wit, given a react configuration like:

```javascript
<XYPlot>
  <XAxis />
  <YAxis />
  <RectSeries {...props}/>
  <Hint className="first-hint"/>
  <Hint className="second-hint"/>
</XYPlot>
```
Would generate HTML something like:

```javascript
<div class="rv-xy-plot">
  <svg>
    <svg for XAxis />
    <svg for YAxis />
    <svg for RectSeries />
  </svg>
  <div class="rv-hint first-hint">...</div>
  <div class="rv-hint second-hint">...</div>
</divt>
```

The TLDR here is that *ORDER MATTERS*! If you want the elements to appear in a different order, reorder them!

## API Reference

### XYPlot

`XYPlot` is a component that wraps series, axis and grids, hints, etc and seamlessly provides necessary dimensions, sizes and scales into its children.  
`XYPlot` may or may not contain axes, grids, hints, crosshairs or series.

#### width
Type: `number`  
Width of the chart. The width should be passed.

#### height
Type: `number`  
Height of the component. The height should be passed.

#### className (optional)
Type: `string`  
DOM classNames to be added to the wrapper component.

#### margin (optional)
Type: `Object`  
Default: `{left: 40, right: 10, top: 10, bottom: 40}`
Margin around the chart.

#### stackBy (optional)
Type: `string`  
Stack the chart by the given attribute. If the attribute is `y`, the chart is stacked vertically; if the attribute is `x` then it's stacked horizontally.

```jsx
<XYPlot
  stackBy="y"
  width={300}
  height={300}>
  <LineSeries
    data={[
      {x: 1, y: 10},
      {x: 2, y: 5},
      {x: 3, y: 15}
    ]}/>
  <LineSeries
    data={[
      {x: 1, y: 12},
      {x: 2, y: 21},
      {x: 3, y: 2}
    ]}/>
</XYPlot>
```

*NOTE* in order to stack properly react-vis expects each x value in each series to be present (assuming stackBy: 'x', the same applies to stackBy 'y', just transposed). To wit, if our data looks like
```
const seriesOne = [
  {x: 1, y: 10},
  {x: 3, y: 15}
];

const seriesTwo = [
  {x: 1, y: 10},
  {x: 2, y: 5},
  {x: 3, y: 15}
];

const seriesThree = [
  {x: 3, y: 15}
];

```

would render weirdly (eg boxes would not lump together at the bottom of the chart). To avoid this, simply provide zeroes for empty cells

```
const seriesOne = [
  {x: 1, y: 10},
  {x: 2, y: 0},
  {x: 3, y: 15}
];

const seriesTwo = [
  {x: 1, y: 10},
  {x: 2, y: 5},
  {x: 3, y: 15}
];

const seriesThree = [
  {x: 1, y: 0},
  {x: 2, y: 0},
  {x: 3, y: 15}
];

```

Will render beautifully!

#### onMouseLeave (optional)
Type: `function()`  
The function that is triggered each time the mouse leaves the component.

#### onMouseMove (optional)
Type: `function()`  
The function that is triggered each time mouse moves over at the component.

#### onMouseEnter (optional)
Type: `function()`  
The function that is triggered each time the mouse enters the component.

#### animation (optional)
Type: `{duration: number}|boolean`
Default: `false`  
Animation config, which is automatically passed to all children, but can be overrided for the each child.  
If `false` is passed, then the child components *will not be* animated.  
If `true` is passed then the child components *will be* animated with the default settings.  
If an object is passed, then the child components *will be* animated with the given settings.

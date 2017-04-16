## LabelSeries:

<!-- INJECT:"LabelSeriesExample" -->

Sometimes you just need to write on your data, and labelSeries has your back. This simple series has a similar API as the markSeries except it adds a label property to each of the rows. This label is then rendered as part of the svg tree.

```javascript
<XYPlot width={300} height={300}>
  <LabelSeries
    animation
    allowOffsetToBeReversed
    data={data} />
</XYPlot>
```
This can be useful for annotating points, as above, or in labeling wedges as (as in the radial chart).

## Data format Reference

Like other series the `labelSeries` requires the data be formatted as an array of objects with several required keys and several options ones. Here's an example


```javascript
const myData = [
  {x: 0, y: 0, label: 'woah!', style={fontSize: 10}},
  {x: 1, y: 0, label: 'dope city', yOffset: 5},
  {x: 0, y: 1, label: 'cool Dog friend', xOffset: 5}
]
```

The above would render three points with labels as suggested!

#### x
Type: `number`
The x position in coordinates of the label.

#### y
Type: `number`  
The y position in coordinates of the label.

#### label
Type: `string`
The actual text to be offered.

#### xOffset
Type: `number`
A number in pixels for the label to be offset from the x position specified on the row.

#### yOffset
Type: `number`
A number in pixels for the label to be offset from the y position specified on the row.

#### style
Type: `object`
SVG text objects (which is what the labelSeries is made up of) accept a ton of different styles, so rather than prescribe every single one we just accept a general grab bag pf the styles. check out the [w3](https://www.w3schools.com/graphics/svg_path.asp) page for more details.


## Series API Reference

#### animation (optional)  
See the [XYPlot](xy-plot.md)'s `animation` section for more information.

### allowOffsetToBeReversed (optional)
The allows the offset specified on the data rows to flipped if the label is too close to an edge. This allows you to make sure your labels never get randomly clipped by going offscreen.

#### className (optional)
Type: `string`
Provide an additional class name for the series.

#### data
Type: `Array<Object>`
Array of data for the series. See above data format reference.

#### onNearestX (optional)
Type: `function(value, {event, innerX, index})`  
A callback function which is triggered each time when the mouse pointer gets close to some X value.
Callback is triggered with two arguments. `value` is the data point, `info` object has following properties:
- `innerX` is the left position of the value;
- `index` is the index of the data point in the array of data;
- `event` is the event object.

#### onValueMouseOver (optional)
Type: `function(d, {event})`  
`mouseover` event handler for the elements corresponding separate data points. First argument received is, `d`, the relevant data point, and second an object with the only `event` property.

#### onValueMouseOut (optional)
Type: `function(d, {event})`  
`mouseout` event handler for the elements corresponding separate data points. First argument received is, `d`, the relevant data point, and second an object with the only `event` property.  

#### onValueClick (optional)
Type: `function(d, {event})`  
`click` event handler for the elements corresponding separate data points. First argument received is, `d`, the relevant data point, and second an object with the only `event` property.  

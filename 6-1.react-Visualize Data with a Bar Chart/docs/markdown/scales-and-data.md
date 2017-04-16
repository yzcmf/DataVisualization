## Scales and data

### Data
It is expected that each visualization has a `data` property. Each data property is an object. Please refer to the documentation for each component for more detail.

### Scales

Scales describe the visual aspects of each data point. Depending on the visualization are x and y scales (for the position of x and y), color scale (e.g. the stroke or the fill of the series), size scale, opacity scale, radius scale, angle scale and others. Available scales are described in the "Scales and Data" section in the docs for each component.

Scales have their own range and domain. We are following the definition of scales which was given by Mike Bostock: _scales are functions that map from an input domain to an output range_. If the domain or the range for the scale is not passed, it will be calculated automatically according to the given data and scale parameters.

Scales are visualized _only_ in case if the appropriate property exists in the data object. For instance, if you want to visualize color, you should have `color` property in each of the data objects passed to the component. We do not support value accessors for the properties.

### Overriding scales

The scale parameters propagate from the parent to the child. For instance, scale parameters applied to the [XYPlot](xy-plot.md) component will be automatically applied to all nested series as well. react-vis allows you to override scales on any level of nesting.

### Scale properties

All scale properties are prepended with the name of the attribute, for instance `xDomain` where `x` is an attribute and `Domain` indicates a domain.

* `[name]Domain` (optional)  
  Type: `Array`  
  Array of values to visualize from. If domain is not passed, it will be calculated from the values which are passed to component.
* `[name]Range` (optional)  
  Type: `Array`  
  Array of real-world values to visualize to. If range is not passed, the defaults (depend on visualization type) will be applied.
* `[name]Type` (optional)  
  Type: `('linear'|'ordinal'|'category'|'time'|'time-utc'|'log'|'literal')`  
  Default: `'linear'`  
  Type of the scale. Each scale type can be one of following values:
    * `'linear'`  
    Continuous scale, that works with numbers. Similar to [d3.scaleLinear](https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear).
    * `'ordinal'`  
    Ordinal scale, works with numbers and strings. Similar to [d3.scaleOrdinal](https://github.com/d3/d3-scale/blob/master/README.md#ordinal-scales).
    * `'category'`  
    Categorical scale, each new value gets the next value from the range. Similar to d3.scale.category\[Number\], but works with other values besides colors.
    * `'time'`  
    Time scale. Similar to [d3.scaleTime](https://github.com/d3/d3-scale/blob/master/README.md#time-scales).
    * `'time-utc'`  
    Time UTC scale. Similar to [d3.scaleUtc](https://github.com/d3/d3-scale/blob/master/README.md#scaleUtc)
    * `'log'`  
    Log scale. Similar to [d3.scaleLog](https://github.com/d3/d3-scale/blob/master/README.md#log-scales).
    * `'literal'`  
    Returns exactly the value that was given to it. Similar to [d3.scaleIdentity](https://github.com/d3/d3-scale#scaleIdentity), except that it does NOT coerce data into numbers. This is useful for precisely specifying properties in the data, eg color can be specified directly on the data.

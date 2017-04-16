import test from 'tape';
import React from 'react';
import {mount} from 'enzyme';
import Treemap from 'treemap';

import {testRenderWithProps} from '../test-utils';

const INTERPOLATE_DATA = {
  title: 'interpolate',
  children: [
    {title: 'ArrayInterpolator', color: '#12939A', size: 1983},
    {title: 'ColorInterpolator', color: '#12939A', size: 2047},
    {title: 'DateInterpolator', color: '#12939A', size: 1375},
    {title: 'Interpolator', color: '#12939A', size: 8746},
    {title: 'MatrixInterpolator', color: '#12939A', size: 2202},
    {title: 'NumberInterpolator', color: '#12939A', size: 1382},
    {title: 'ObjectInterpolator', color: '#12939A', size: 1629},
    {title: 'PointInterpolator', color: '#12939A', size: 1675},
    {title: 'RectangleInterpolator', color: '#12939A', size: 2042}
  ]
};

const TREEMAP_PROPS = {
  height: 100,
  width: 100,
  className: 'little-nested-tree-example',
  data: {
    name: 'animate',
    children: [
      {title: 'Easing', color: '#12939A', size: 17010},
      {title: 'FunctionSequence', color: '#12939A', size: 5842},
      INTERPOLATE_DATA,
      {title: 'ISchedulable', color: '#12939A', size: 1041},
      {title: 'Parallel', color: '#12939A', size: 5176},
      {title: 'Pause', color: '#12939A', size: 449},
      {title: 'Scheduler', color: '#12939A', size: 5593},
      {title: 'Sequence', color: '#12939A', size: 5534},
      {title: 'Transition', color: '#12939A', size: 9201},
      {title: 'Transitioner', color: '#12939A', size: 19975},
      {title: 'TransitionEvent', color: '#12939A', size: 1116},
      {title: 'Neonate', color: '#12939A', size: 6006}
    ]
  }
};

// make sure that the components render at all
testRenderWithProps(Treemap, TREEMAP_PROPS);

test('Treemap: Basic rendering', t => {
  const $ = mount(<Treemap {...TREEMAP_PROPS}/>);
  t.equal($.find('.rv-treemap__leaf').length, 21, 'should find the right number of children');
  const expectedText = 'EasingNeonateinterpolateISchedulableParallelPauseFunctionSequenceSequenceTransitionTransitionerTransitionEventSchedulerArrayInterpolatorColorInterpolatorDateInterpolatorInterpolatorMatrixInterpolatorNumberInterpolatorObjectInterpolatorPointInterpolatorRectangleInterpolator';
  t.equal($.find('.rv-treemap').text(), expectedText, 'should find the correct text shown');
  t.equal($.find('.little-nested-tree-example').length, 1, 'should find the custom class name used');

  $.setProps({data: INTERPOLATE_DATA});
  t.equal($.find('.rv-treemap__leaf').length, 9, 'should find the right number of children');
  const newText = 'ArrayInterpolatorColorInterpolatorDateInterpolatorInterpolatorMatrixInterpolatorNumberInterpolatorObjectInterpolatorPointInterpolatorRectangleInterpolator';
  t.equal($.find('.rv-treemap').text(), newText, 'should find the correct text shown');
  t.equal($.find('.little-nested-tree-example').length, 1, 'should find the custom class name used');
  t.end();
});

test('Treemap: Empty treemap', t => {
  const $ = mount(<Treemap {...{...TREEMAP_PROPS, data: {}}}/>);
  t.equal($.find('.rv-treemap__leaf').length, 0, 'should find the right number of children');
  t.equal($.find('.rv-treemap').text(), '', 'should find the correct text shown');
  t.equal($.find('.little-nested-tree-example').length, 1, 'should find the custom class name used');

  t.end();
});

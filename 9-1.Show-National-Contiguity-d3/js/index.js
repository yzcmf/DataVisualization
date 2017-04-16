
d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(error, data){
  
  processData(data);
  
});

function processData(data){
  
  var tip = d3.select('#tip');
  var isBeingDragged = false;
  
  var canvasFrameWidth = 1000;
  var canvasFrameHeight = 1000;
  
  var canvas = d3.select('.canvas')
                        .append('svg')
                              .attr('width', canvasFrameWidth)
                                .attr('height', canvasFrameHeight);

  
  var simulation = d3.forceSimulation()
                      .force('link', d3.forceLink()
                            .id(function(d,i){ return i;}))
                        .force('charge', d3.forceManyBody().distanceMax([180]))
                          .force('center', d3.forceCenter(canvasFrameWidth / 2, canvasFrameHeight / 2+10));
  
  var link = canvas.append('g')
                  .attr('class', 'links')
                    .selectAll('line')
                      .data(data.links)
                        .enter()
                          .append('line')
                           .attr("stroke-width", 0.5)
                            .attr('stroke', 'black'); 
  
  var canvasForNodes = d3.select('.canvas').select('.nodes');
  
  var node = canvasForNodes
                .selectAll('.node')
                        .data(data.nodes)
                          .enter()
                            .append('img')
                              .attr('class', function(d){ return 'node flag flag-' + d.code;}) // see for width and height
                            .on('mouseover', function(d){
                              if ( isBeingDragged )
                                return;
                              tip
                                .style('display', 'block')
                                .html(d.country)
                                .style('top', d.y+30 + 'px')
                                .style('left', d.x+30 + 'px')
                              
                            })
                            .on("mouseout", function() {
                              if ( isBeingDragged )
                                return;
                              d3.select("#tip").style("display", "none");
                            })
                         .call(d3.drag()
                          .on('start', dragstarted)
                           .on('drag', dragged)
                            .on('end', dragended) );
  
  node.append('title')
          .text(function(d){ return 'title';});
  
   function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .style("left", function(d) { return d.x + 'px'; })
        .style("top", function(d) { return d.y + 'px'; });
  }
  
  simulation
    .nodes(data.nodes)
    .on('tick', ticked);
  
  simulation.force('link')
    .links(data.links);
  
 
                            
                      
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  
  d.fx = d.x;
  d.fy = d.y;
  isBeingDragged = true;
                              tip
                                .style('display', 'block')
                                .html(d.country)
                                .style('top', d3.event.y + 'px')
                                .style('left', d3.event.x + 'px')
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
  
  tip
    .style('top', d3.event.y + 'px')
    .style('left', d3.event.x + 'px')
  
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  isBeingDragged = false;
  
    d3.select("#tip").style("display", "none");
  
  d.fx = null;
  d.fy = null;
}   
  
  
  
  
}
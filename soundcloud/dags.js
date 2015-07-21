/*
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var svg = d3.select("div#dag").append("svg")
        .attr("width", x)
        .attr("height", y)
        .append("g");


function updateWindow(){
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    svg.attr("width", x).attr("height", y);
}

window.onresize = updateWindow;
*/

$( document ).ready(function() {

  // http://stackoverflow.com/questions/280634/endswith-in-javascript
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };  

  (function () {
    'use strict';
    window.DAG = {
      displayGraph: function (graph, dagNameElem, svgElem) {
        dagNameElem.text(graph.name);
        this.renderGraph(graph, svgElem);
      },

      renderGraph: function(graph, svgParent) {
        var nodes = graph.nodes;
        var links = graph.links;

        var graphElem = svgParent.children('g').get(0);
        $(graphElem).empty();

        // Create the renderer
        var render = new dagreD3.render();

        // Set up an SVG group so that we can translate the final graph.
        var svg   = d3.select(graphElem),
            inner = svg.append("g");

        var createGraph = function(nodes, edges) {
          var graph = new dagreD3.graphlib.Graph()
            .setGraph({})
            .setDefaultEdgeLabel(function() { return {}; });

          nodes.forEach(function(node) {
            // node.value.style = node.value.style || "stroke: #666; fill: #ddd;";
            if (node.value.url) { node.value.shape = node.value.shape || "circle"; }
            graph.setNode(node.id, node.value);
          });

          edges.forEach(function(e) {
            e.value.lineInterpolate = 'basis';
            if (e.v.endsWith("tool")) {
              e.value.arrowhead =   "undirected";
              e.value.arrowheadStyle = "stroke: #fff; fill: #fff;";
              e.value.style = "stroke: #fff; stroke-width: 2px; stroke-dasharray: 2, 2; fill: none;";
            } else if (e.u == "sections") {
              e.value.arrowheadStyle = "stroke: #777; fill: #777;";
              e.value.style = "stroke: #777; fill: none";
            } else {
              e.value.arrowheadStyle = "stroke: #000; fill: #000;";
              e.value.style = "fill: none";
            }
            graph.setEdge(e.u, e.v, e.value);
          });

          return graph;
        };

        var g = createGraph(nodes, links);
        
        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        inner.selectAll("g.node").each(function(id) {
          var gotoURL = g.node(id).url;
          if (gotoURL) {
            if (id.endsWith("tool")) {
                $(this).attr('data-role', 'link-tool');
            } else {
              $(this).attr('data-role', 'link');
            }
          }
        });

        inner.selectAll("g.node").on("click", function(id) {
          var gotoURL = g.node(id).url;
          if (gotoURL) {
            window.open(gotoURL,'_'+id);
          }       
        });

        var resize = function() {
          var gelem = d3.select("svg > g");
      
          var w = window,
              d = document,
              e = d.documentElement,
              gbody = d.getElementsByTagName('body')[0],
              x = w.innerWidth || e.clientWidth || gbody.clientWidth,
              y = w.innerHeight|| e.clientHeight|| gbody.clientHeight;

          var ratio_x = Math.min((x) / (g.graph().width), 1);
          var ratio_y = Math.min((y) / (g.graph().height), 1);

          console.log(x + " / " + g.graph().width + " = " + ratio_x);
          console.log(y + " / " + g.graph().height + " = " + ratio_y);

          gelem.attr("transform", "scale("+ Math.min(ratio_x, ratio_y) +")");
        }

        resize();
        
        window.onresize = resize; 
      }
    };
  })();

 
  (function () {
    'use strict';

    // callback for graph data loading
    window.loadData = function (data) {
      DAG.displayGraph(data, $('#dag-name'), $('#dag > svg'));
    };
  }());

  $.getJSON( "soundcloudlinkgraph.json", function( data ) {
    loadData(data);
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

}); // jquery document ready

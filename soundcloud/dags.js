$( document ).ready(function() {

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
            if (e.v == "tool") {
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
            if (id == "tool") {
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


        // Center the graph
        /*
        var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
        inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
        svg.attr("height", g.graph().height + 40);
        */
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

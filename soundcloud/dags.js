$( document ).ready(function() {
  var theGraph = undefined;

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

          nodes.forEach(function(u) {
            graph.setNode(u.id, u.value);
          });

          edges.forEach(function(e) {
            e.value.lineInterpolate = 'basis';
            if (e.v == "tool") {
              e.value.arrowheadStyle = "stroke: #777; fill: #777;";
              e.value.style = "stroke: #777; stroke-width: 2px; stroke-dasharray: 5, 5; fill: none;";
            } else if (e.u == "sections") {
              e.value.arrowheadStyle = "stroke: #a00; fill: #a00;";
              e.value.style = "stroke: #a00; fill: none";
            } else {
              e.value.arrowheadStyle = "stroke: #000; fill: #000;";
              e.value.style = "fill: none";
            }
            graph.setEdge(e.u, e.v, e.value);
          });

          return graph;
        };

        var g = createGraph(nodes, links);
        theGraph = g;

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        inner.selectAll("g.node").each(function(id) {
          var gotoURL = g.node(id).url;
          if (gotoURL) {
            $(this).attr('data-role', 'link');
          }       
        });

        inner.selectAll("g.node").on("click", function(id) {
          var gotoURL = g.node(id).url;
          if (gotoURL) {
            console.log(gotoURL);
            window.open(gotoURL,'_'+id);
          }       
        }).on( "mouseenter", function(id, qwe, asd) {
          console.log('this '+this+'id '+id+' qwe '+qwe+' asd ' +asd);
        }).on( "mouseleave", function(id) {
        } );
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

  function wire () {
    $( "g.node" ).mouseenter(function(event) { 
      var $rect = $(this).find("rect");
      if ($rect.length) {
        var dataBG = $rect.attr('data-bg');
        if (!dataBG) {
          $rect.attr('data-bg', $rect.css('fill')) 
        }
        $rect.css('fill', '#404040');
      } 
      if (this.__data__) {
        $('tr#'+this.__data__).css('background-color', '#efefef');
      }
    });
    $( "g.node" ).mouseleave(function(event) {
      var $rect = $(this).find("rect");
      if ($rect.length) {
        var dataBG = $rect.attr('data-bg');
        if (!dataBG) {
          $rect.css('fill', "none");
        } else {
          $rect.css('fill', dataBG);
        }
      }
      if (this.__data__) {
        $('tr#'+this.__data__).css('background-color', 'inherit');
      }
    });
  }

  $.getJSON( "soundcloudlinkgraph.json", function( data ) {
    loadData(data);
    wire();
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });

}); // jquery document ready

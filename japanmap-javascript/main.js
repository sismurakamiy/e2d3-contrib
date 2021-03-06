define(['d3', 'topojson'], function (d3, topojson) {
  return function (node, baseUrl) {
    /*
     * constructor
     */
    var _initialize = function (data) {
      var width = node.clientWidth;
      var height = node.clientHeight;

      var svg = d3.select(node)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'display: block; margin: auto;');
      var projection = d3.geo.mercator()
        .center([136, 35])
        .scale(1200)
        .translate([width / 2, height / 2]);
      var path = d3.geo.path()
        .projection(projection);

      svg.append('g')
        .attr('id', 'legend_group');

      d3.json(baseUrl + '/japan.topojson', function (error, json) {
        svg.selectAll('.states')
          .data(topojson.feature(json, json.objects.japan).features)
          .enter().append('path')
          .attr('stroke', 'gray')
          .attr('stroke-width', '0.5')
          .attr('id', function (d) { return 'state_' + d.properties.id})
          .attr('class', 'states')
          .attr('fill', '#ffffff')
          .attr('d', path);
        if (data) {
          exports.update(data);
        }
      });
    };

    /*
     * destructor
     */
    var _dispose = function () {
      d3.select(node).select('svg').remove();
    };

    /*
     * execute
     */
    _initialize()

    /*
     * export
     */
    var exports = {
      /**
       * (Required) called on data updated.
       *
       * @param data: ChartData
       */
      update: function (data) {
        var map = data.toMap();
        var values = map.values();

        var color = d3.scale.linear()
          .domain([d3.min(values), d3.max(values)])
          .range(['#ffffff', '#ff0000'])
          .interpolate(d3.interpolateLab);

        var initLabel = '2011年';

        d3.select(node)
          .selectAll('svg .states')
          .attr('fill', function (d) {
            if (map[d.properties.nam_ja] && $.isNumeric(map[d.properties.nam_ja][initLabel])) {
              return color(+map[d.properties.nam_ja][initLabel]);
            } else {
              return '#ffffff';
            }
          });

        var legend_data = color.ticks(5).reverse();
        d3.select(node).select('#legend_group')
          .selectAll('.legend_rect')
          .data(legend_data)
          .enter()
          .append('rect')
            .attr('class', 'legend_rect')
            .attr('x', 0)
            .attr('y', function(value, i){return i*20})
            .attr('width', '15')
            .attr('height', '15')
            .attr('fill', function(value){return color(value)})
        d3.select(node).select('#legend_group')
          .selectAll('.legend_text')
          .data(legend_data)
          .enter()
          .append('text')
            .attr('class', 'legend_text')
            .attr('x', 20)
            .attr('y', function(value, i){return i*20+10})
            .text(function(value){return value})
      },
      /**
       * (Optional) called on window resized.
       */
      resize: function(data) {
        _initialize(data);
        _dispose();
      }
    };

    return exports;
  };
});

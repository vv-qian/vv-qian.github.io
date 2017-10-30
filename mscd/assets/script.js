
var width = 818,
  height = 800;
var svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height - 150);

var tiler = d3.geo.tile()
            .size([width, height - 200]);
var vector;

var map = dc.geoChoroplethChart(svg); //focus chart
// var timeline = dc.seriesChart("#timeline"); // range chart (year)
// var biz_timeline = dc.seriesChart("#biz_timeline");
// var biz2_timeline = dc.seriesChart("#biz2_timeline");

var colors = {"mhi": "green", "mgr": "purple", "poverty": "blue"};
var full_title = {"mhi": "Mean Household Income", "mgr": "Median Gross Rent", "poverty": "blue"};


var color = (function(metric) {
  var specColors = [];
  if (colors[metric] === "green") {
    specColors = colorbrewer.Greens[5];
  } else if (colors[metric] === "purple") {
    specColors = colorbrewer.Purples[5];
  } else {
    specColors = colorbrewer.Blues[6];
  }
  if (specColors.indexOf("grey") < 0 ) {
    specColors.unshift("grey");
  }

  return specColors;
});

var domains = { "mhi": [0, 18191.2, 102709, 187226, 271743],
                "mgr": [0, 662.25, 1108.5, 1554.75, 2000],
                "poverty": []
              };

var projection = d3.geo.mercator()
            .center([-122.463701, 37.747683]) //-122.41, 37.79
            .scale(width*200)
            .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var ndx, yearDim, mhiDim, mgrDim, tractDim;
var filterYear, filterMetric, sf_topojson;
var parsed_data = [];
var parsed_biz = [];
var parsed_biz_tract = [];

var divlegend = document.getElementById("legend");
var maptitle = document.getElementById("yolo");

var filterMetric_mapping = {"mhi": "Mean Household Income", "mgr": "Median Gross Rent"};
var format = d3.format("$.2s");


function clickedOn(evt) {
  var oldFilterMetric = filterMetric;
  filterMetric = evt.target.id;
  if (filterMetric !== "mhi" && filterMetric !== "mgr") {
    filterYear = +(filterMetric.split("_")[1]);
    filterMetric = oldFilterMetric;
    metricChange(true);
    var titleMetric = maptitle.innerHTML.split(" ").slice(0, 3);
    titleMetric.push(filterYear);
    maptitle.innerHTML = titleMetric.join(" ");
  } else {
    metricChange(false);
    var titleMetric = maptitle.innerHTML.split(" ").slice(3, 4);
    var new_metric = full_title[filterMetric].split(" ").reverse();
    new_metric.forEach(function(d) {
      titleMetric.unshift(d);
    });
    maptitle.innerHTML = titleMetric.join(" ");
  }
}
divlegend.addEventListener("click", clickedOn, false);

function metricChange(yearChange) {
  var specColors = color(filterMetric);
  var specDomains = domains[filterMetric];
  map.valueAccessor( function(d) {
  if (filterMetric === "mhi") {
    return d.value.mhi;
  } else if (filterMetric === "pov") {
    return d.value.pov;
  } else { //default on mgr
    return d.value.mgr;
  }
  })
  .colors(d3.scale.threshold().domain(specDomains).range(specColors));

  if (yearChange) {
    var new_year_group = metricYearChange_map();
    map.group(new_year_group);
    plot_biz(yearChange);
  }

  // var new_metric_group = metricChange_timeline();
  // timeline.group(new_metric_group)
  // .yAxisLabel(function(d) {
  // if (filterMetric === "mhi") {
  //   return "Mean Household Income";
  // } else if (filterMetric === "pov") {
  //   return d.value.pov;
  // } else { //default on mgr
  //   return "Median Gross Rent";
  // }});
  dc.redrawAll();
}

queue()
  .defer(d3.json, "/data/sf_tracts.json")
  .defer(d3.csv, "/data/year_ordered_acs_inc_rent_biz.csv")
  .defer(d3.csv, "/data/groc_liq.csv")
  .await(ready);

var data_real;

function ready(error, tracts, data, biz) {
  if (error)
    throw error;
  sf_topojson = topojson.feature(tracts, tracts.objects.sf).features;

  filterMetric = "mgr";
  filterYear = 2014;

  svg.style("stroke", "black").style("fill", "lightgrey").style("stroke-width", "1px");

  var dateFormat;
  data.forEach(function(d) {
    dateFormat = d3.time.format('%Y');
    d.year = dateFormat.parse(d.year);
    d.mhi = +d.mhi;
    d.mgr = +d.mgr;
    parsed_data.push({"id": d.id, "year": d.year, "mhi": d.mhi, "mgr": d.mgr, "liq": +d.liq, "high_end_groc": +d.high_end_groc, "low_end_groc": +d.low_end_groc, "groc": +d.groc});
  });

  biz.forEach(function(d) {
    d.end_date = dateFormat.parse(d.end_date);
    d.start_date = dateFormat.parse(d.start_date);
    d.storetype = d.storetype;
    d.lat = +d.lat;
    d.lon = +d.lon;
    parsed_biz.push({"end_date": d.end_date, "storetype": d.storetype, "lat": d.lat, "lon": d.lon, "start_date": d.start_date});
  });


  ndx = crossfilter(parsed_data);
  yearDim = ndx.dimension(function(d) { return [d.id, +d.year.getFullYear()]; });
  tractDim = ndx.dimension(function(d) { return d.id; });

  vector = svg.append("g")
    .attr("class", "vector")
    .call(renderTiles);
  d3.select(".loading").remove();
  render(filterYear, filterMetric);
  plot_biz(false);

}


function sort_group(group, order) {
    return {
        all: function() {
          var g = group.all(), map = {};

            g.forEach(function(kv) {
                map[kv.key] = kv.value;
            });
            return order.map(function(k) {
                return {key: k, value: map[k]};
            });
        }
    };
};

function render(filterYear, filterMetric) {
  // dc.filterAll();
  var metric_grouped = metricYearChange_map();

  var year_grouped = metricChange_timeline();

  var hg_grouped = yearDim.group(function(d) { return d;}).reduceSum(
    function(d) {
      return d.high_end_groc;
    });

  var lg_grouped = yearDim.group(function(d) { return d;}).reduceSum(
    function(d) {
      return d.low_end_groc;
    });

  var order = parsed_data.map(function(values) {
    return [values.id, +values.year.getFullYear()];
  });
  //
  // var hg_grouped = sort_group(hg_grouped, order);
  // var lg_grouped = sort_group(lg_grouped, order)

  var specColors = color(filterMetric);
  var specDomains = domains[filterMetric];

  map.projection(projection)
    .dimension(tractDim)
    .group(metric_grouped)
    .valueAccessor(function(d) {
      console.log(filterMetric_mapping[filterMetric]);
      if (filterMetric === "mhi") {
        return d.value.mhi;
      } else if (filterMetric === "pov") {
        return d.value.pov;
      } else { //default on mgr
        return d.value.mgr;
      }
    })
    .colorAccessor(function(d) {
      return d;
    })
    .overlayGeoJson(sf_topojson, 'sf', function(d) { return d.id; })
    .colors(d3.scale.threshold().domain(specDomains).range(specColors))
    .title(function (d) {
      return "Census Tract " + d.key + "\n" + filterMetric_mapping[filterMetric] + " : " + format(d.value ? d.value : 0);
    })
    .transitionDuration(500);

//   timeline.width(670)
//       .height(300)
//       .margins({top: 10, right: 50, bottom: 30, left: 50})
//       .dimension(yearDim)
//       .group(year_grouped)
//       .keyAccessor(function(d) { return +d.key[1]; })
//       .valueAccessor(function(d) {
//         return +d.value;
//       })
//       .seriesAccessor(function(d) { return d.key[0]; })
//       .x(d3.scale.linear().domain([2000, 2014]))
//       .renderHorizontalGridLines(true)
//       .xAxisLabel("Year")
//       .yAxisLabel(function(d) {
//         if (filterMetric === "mhi") {
//           return "Mean Household Income";
//         } else { //default on mgr
//           return "Median Gross Rent";
//         }
//       })
//       .clipPadding(10)
//       .elasticY(true)
//       .brushOn(false)
//       .xAxis().ticks(8).tickFormat(d3.format("d"));
//
// biz_timeline.width(470)
//     .height(300)
//     .margins({top: 10, right: 50, bottom: 30, left: 30})
//     .dimension(yearDim)
//     .group(hg_grouped)
//     .keyAccessor(function(d) { return +d.key[1]; })
//     .valueAccessor(function(d) {
//       return +d.value;
//     })
//     .seriesAccessor(function(d) { return d.key[0]; })
//     .x(d3.scale.linear().domain([2000, 2014]))
//     .renderHorizontalGridLines(true)
//     .xAxisLabel("Year")
//     .yAxisLabel("Number of '$$'+ Grocery Stores")
//     .clipPadding(10)
//     .elasticY(true)
//     .brushOn(false)
//     .xAxis().ticks(8).tickFormat(d3.format("d"));
//
// biz2_timeline.width(470)
//     .height(300)
//     .margins({top: 10, right: 50, bottom: 30, left: 30})
//     .dimension(yearDim)
//     .group(lg_grouped)
//     .keyAccessor(function(d) { return +d.key[1]; })
//     .valueAccessor(function(d) {
//       return +d.value;
//     })
//     .seriesAccessor(function(d) { return d.key[0]; })
//     .x(d3.scale.linear().domain([2000, 2014]))
//     .renderHorizontalGridLines(true)
//     .xAxisLabel("Year")
//     .yAxisLabel("Number of '$' Grocery Stores")
//     .clipPadding(10)
//     .elasticY(true)
//     .brushOn(false)
//     .xAxis().ticks(8).tickFormat(d3.format("d"));


  dc.renderAll();
}


function renderTiles() {

  svg.selectAll("g")
    .data(tiler
        .scale(projection.scale() * 2 * Math.PI)
        .translate(projection([0, 0])))
    .enter().append("g")
      .each(function(d) {
        var g = d3.select(this);
        d3.json("https://vector.mapzen.com/osm/roads/" + d[2] + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-LM25tq4", function(error, json) {
          if (error) throw error;

          g.selectAll("path")
            .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
          .enter().append("path")
            .attr("class", function(d) { return d.properties.kind; })
            .attr("d", path);
        });
    });
}

function metricChange_timeline() {
  var year_grouped = yearDim.group(function(d) { return d;}).reduceSum(
    function(d) {
      if (filterMetric === "mhi") {
        return +d.mhi;
      } else if (filterMetric === "pov") {
        return +d.pov;
      } else { //default on mgr
        return +d.mgr;
      }
    });
  return year_grouped;
}

function metricYearChange_map() {
  var metric_grouped = tractDim.group(function(id) { return id;}).reduce(
    function(p, v) {
      if (v.year.getFullYear() === filterYear) {
          p.mhi += +v.mhi;
          p.mgr += +v.mgr;
          p.year = v.year.getFullYear();
          p.id = v.id;
      }
      return p;
    },
    function(p, v) {
      p.mhi -= +v.mhi;
      p.mgr -= +v.mgr;
      p.year = 0;
      p.id = "";
      return p;
    },
    function() {
      return {mhi: 0, year: 0, id: "", mgr: 0};
    }
  );
  return metric_grouped;
}


function plot_biz(yearChange) {
  var select_year_biz_data = [];

  parsed_biz.forEach(function(d) {
    if (d.end_date.getFullYear() >= filterYear && d.start_date.getFullYear() <= filterYear) {
      select_year_biz_data.push({"end_date": d.end_date, "storetype": d.storetype, "lat": d.lat, "lon": d.lon});
    }
  });


  if (yearChange) {
    svg.selectAll("circle.biz_circles").remove();
  }


  svg.selectAll(".circle")
    .data(select_year_biz_data).enter()
    .append("circle", ".circle")
    .attr("class", "biz_circles")
    .attr("r", "5px") // TODO: change to be 1 mile
    .attr("fill", function(d) { // yellow are liquor stores, orange are grocery
      if (d.storetype == "low_end_groc") {
          return "red"
      } else if (d.storetype === "high_end_groc") {
          return "#FF8000"
      } else if (d.storetype === "liq") {
          return "#FFFF00"
      } else if (d.storetype === "groc") {
          return "#636363"
      }
    })
    .attr("fill-opacity", 0.5)
    .attr("transform", function(d) {
      return "translate(" + projection([d.lon, d.lat]) + ")";
    });
}

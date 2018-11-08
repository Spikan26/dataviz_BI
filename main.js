var data = undefined;
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var data_nofilter = undefined;

function legend(element, keys, z) {
    var legendRectSize = 15;
    var svg = d3.select('#' + element).append('svg')
        .attr('width', 400)
        .attr('height', 30);

    var legend = svg.selectAll('.legend')
        .data(keys)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var horz = 0 + i * 110 + 10;
            var vert = 0;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d) {
            return z(d)
        })
        .style('stroke', function (d) {
            return z(d)
        });

    legend.append('text')
        .attr('x', legendRectSize + 5)
        .attr('y', 15)
        .text(function (d) {
            return d;
        });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function horizontal_bar_chart(element, property) {
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 600).attr("height", 300);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //var nested_data = [].concat(data);

    var nested_data = d3.nest()
        .key(function (d) {
            return d[property];
        })
        .rollup(function (d) {
            return d.length;
        })
        .entries(data);

    nested_data = nested_data.sort(function (a, b) {
        return d3.descending(a.value, b.value)
    });
    console.log(nested_data);
    //nested_data = data.filter(function(d){
    //TODO use switches from webpage to filter
    //return d.theme === "1";
    //  return d.nathan === "a";
    //});

    console.log("HORIZONTAL DATA");
    console.log(nested_data);
    //console.log(nested_data);


    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .paddingInner(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var z = d3.scaleOrdinal()
        .range(["#e74c3c", "#85c1e9", "#7d3c98", "#a04000"]);


    x.domain([0, 150]);

    z.domain();
    y.domain(nested_data.map(function (d) {
        return d.key;
    }));

    var bars = g.selectAll(".gbar")
        .data(nested_data)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + 30 * i + ")";
        });

    bars.append("rect")
        .attr("class", "bar")
        .attr("height", function (d) {
            return 25;
        })
        .attr("width", function (d) {
            return x(d.value) * 10;
        })
        .style("fill", function (d) {
            return z(d.key)
        });

    bars.append("text")
        .attr("dx" , -25)
        .attr("dy", 19)
        .text(function(d){
            return d.key;
        })

    bars.append("text")
        .attr("dx" , 260)
        .attr("dy", 18)
        .text(function(d){
            return d.value+" msg";
        })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bar_chart(element, property) {
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 300).attr("height", 300);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var nested_data = d3.nest()
        .key(function (d) {
            if(d[property] == 0){
                d[property] = 0.1;
            }
            return Math.ceil(d[property] / 10);
        })
        .rollup(function (d) {
            return {
                size: d.length, total_heure: d3.sum(d, function (d) {
                    return d.heure;
                })
            };
        })
        .entries(data);

    nested_data = nested_data.sort(function (a, b) {
        return d3.ascending(+a.key, +b.key)
    });




    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#1100fe","#9ec7fe","#9ec7fe","#2f86fd"]);

    if (property === "heure") {
        x.domain([0, d3.max(nested_data.map(function (d) {
            return +d.key;
        })) + 1]);
    } else {
        x.domain(nested_data.map(function (d) {
            return d.key;
        }));

    }

    y.domain([0, d3.max(nested_data, function (d) {
        return d.value.size;
    })]);
    z.domain(nested_data.map(function (d) {
        return d.key;
    }));

    g.selectAll(".bar")
        .data(nested_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.key)
        })
        .attr("y", function (d) {
            return y(d.value.size)
        })
        .attr("height", function (d) {
            return height - y(d.value.size);
        })
        .attr("width", function (d) {
            return x.bandwidth();
        })
        .style("fill", function (d) {
            return z(d.key)
        });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axes")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .attr("class", "axes")
        .call(d3.axisLeft(y).ticks(3))

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function () {
    console.log("READY");

    var URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGWmwy9vIxJDzGg9-DlfvXXwJhZFLSF5toB_RpNeGjUUqWO70o96yUGbrNjcQ2DlJAZrVtOugP7T3v";
    URL += "/pub?single=true&output=csv";


    d3.csv(URL, function (d) {
        data = d;
        data.forEach(function (d) {
            d.heure = +d.heure;
            d.caps = +d.caps;
        });
        data_nofilter = [].concat(data);
        console.log(data);

        bar_chart("bcp", "caps");
        horizontal_bar_chart("bcs", "emoji");
        //bar_chart("bcw", "heure");
        //treemap("status");

    });
});
///////////////////////////////////////////////////////////////////////////////////////////
function filter(){
    if ($('[id= "gaming"]').is(':checked')){
        console.log('gaming')
    }
}

$("#gaming").click(function () {

    filter()

});

$("#chek2").click(function () {

    filter()

});

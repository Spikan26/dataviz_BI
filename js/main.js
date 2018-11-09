var emoji_nofilter = undefined;
var hashtag_nofilter = undefined;
var words_nofilter = undefined;
var caps_nofilter = undefined;
var nbtag_nofilter = undefined;
var hours_nofilter = undefined;
var margin = {top: 20, right: 20, bottom: 30, left: 40};
var loaded = [false, false, false, false, false, false];
//
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

function horizontal_bar_chart(element, data, property) {
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 600).attr("height", 320).attr("x", -50);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    nested_data = d3.nest()
        .key(function (d) {
            return d[property];
        })
        .rollup(function (d) {
            return d3.sum(d, function (e) {
                return e.nombre;
            })
        })
        .entries(data);

    nested_data.sort(function (a, b) {
        return d3.descending(a.value, b.value)
    });

    var max = d3.max(nested_data, function (d) {
        return d.value;
    });

    var y = d3.scaleBand()
        .rangeRound([height, 0])
        .paddingInner(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var z = d3.scaleOrdinal()
        .range(["#e7173d", "#e76131", "#e7a534", "#f9e259", "#58ffb6", "#1935ff", "#b710ff"]);


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
        })
        .on("mouseover", function(d){
            tooltip
                .style("left", d3.event.pageX + 50 + "px")
                .style("top", d3.event.pageY + "px")
                .style("display", "inline-block")
                .html((d.key) + "<br>" + (d.value) + " msg");
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});


    bars.append("rect")
        .attr("class", "bar")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("height", function (d) {
            return 25;
        })
        .attr("width", function (d) {
            return (width - 70) * (d.value / max);
        })
        .style("fill", function (d) {
            return z(d.key)
        });

    bars.append("text")
        .attr("dx", 10)
        .attr("dy", 19)
        .text(function (d) {
            return d.key;
        });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bar_chart(element, widthchart, data, property) {
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", widthchart).attr("height", 320);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");


    nested_data = d3.nest()
        .key(function (d) {
            return d[property];
        })
        .rollup(function (d) {
            return d3.sum(d, function (e) {
                return e.nombre;
            })
        })
        .entries(data);

    nested_data.sort(function (a, b) {
        return d3.ascending(+a.key, +b.key)
    });

    console.log(nested_data);


    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#1100fe", "#9ec7fe", "#9ec7fe", "#2f86fd"]);


        x.domain(nested_data.map(function (d) {
            return +d.key;
        }));



    y.domain([0, d3.max(nested_data, function (d) {
        return +d.value;
    })]);
    z.domain(nested_data.map(function (d) {
        return +d.key;
    }));

    g.selectAll(".bar")
        .data(nested_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("x", function (d) {
            return x(d.key)
        })
        .attr("y", function (d) {
            return y(d.value)
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("width", function (d) {
            return x.bandwidth();
        })
        .style("fill", function (d) {
            return z(d.key)
        })

        .on("mouseover", function(d){
        tooltip
            .style("left", d3.event.pageX + 50 + "px")
            .style("top", d3.event.pageY + "px")
            .style("display", "inline-block")
            .html((d.key) + " % de majuscule <br>" + (d.value) + " msg");
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

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

function no_theme(element) {
    $("#" + element).html("");
    var svg = d3.select("#" + element).append("svg").attr("width", 300).attr("height", 300);

    svg.append("text")
        .attr("x", 5)
        .attr("y", 150)
        .text("Sélectionnez un thème pour commencer");

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function draw_all() {
    emoji_data = filter(emoji_data_nofilter);
    hashtag_data = filter(hashtag_data_nofilter);
    words_data = filter(words_data_nofilter);
    caps_data = filter(caps_data_nofilter);
    //nbtag_data = filter(nbtag_data_nofilter);
    hours_data = filter(hours_data_nofilter);

    if (themes.length == 0) {
        console.log("oops, nothing selected");
        no_theme("bc_caps");
        no_theme("bc_emoji");
        no_theme("bc_words");
        no_theme("bc_hashtags");
        no_theme("bc_time");

    } else {
        console.log(themes);
        bar_chart("bc_caps", 550, caps_data, "percent");
        bar_chart("bc_time", 1100, hours_data, "heure");
        horizontal_bar_chart("bc_emoji", emoji_data, "emoji");
        horizontal_bar_chart("bc_hashtags", hashtag_data, "hashtag");
        horizontal_bar_chart("bc_words", words_data, "word");
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function filter(data_nofilter) {
    themes = [];
    if ($('[id= "gaming"]').prop("checked") === true) {
        themes.push(1);
    }
    if ($('[id= "beaute"]').prop("checked") === true) {
        themes.push(2);
    }
    if ($('[id= "sport"]').prop("checked") === true) {
        themes.push(3);
    }
    if ($('[id= "food"]').prop("checked") === true) {
        themes.push(4);
    }
    if ($('[id= "humour"]').prop("checked") === true) {
        themes.push(5);
    }

    return data_nofilter.filter(function (d) {
        console.log(d.theme)
        return themes.includes(d.theme)
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function check_loaded() {
    if (loaded[0] == true && loaded[1] == true && loaded[2] == true && loaded[3] == true && loaded[5] == true) {
        draw_all();
        $('#gaming').click(function () {
            draw_all();
        })

        $('#beaute').click(function () {
            draw_all();
        })

        $('#sport').click(function () {
            draw_all();
        })

        $('#food').click(function () {
            draw_all();
        })

        $('#humour').click(function () {
            draw_all();
        })
    } else {
        console.log(loaded);
        setTimeout(check_loaded, 500)
    }
}

$(function () {
    console.log("READY");

    var CSV_emoji = "./csv/emojis_freq.csv";
    var CSV_tag = "./csv/hashtags_freq.csv";
    var CSV_word = "./csv/words_freq.csv";
    var CSV_caps = "./csv/caps_distribution.csv";
    //var CSV_nbtag = "./csv/hashtag_count.csv";
    var CSV_hours = "./csv/hours.csv";



    d3.csv(CSV_emoji, function (d) {
        data = d;
        data.forEach(function (d) {
            d.nombre = +d.nombre;
            d.theme = +d.theme;
        });
        emoji_data_nofilter = [].concat(data);
        loaded[0] = true;
    });

    d3.csv(CSV_tag, function (d) {
        data = d;
        data.forEach(function (d) {
            d.nombre = +d.nombre;
            d.theme = +d.theme;
        });
        hashtag_data_nofilter = [].concat(data);
        loaded[1] = true;
    });

    d3.csv(CSV_word, function (d) {
        data = d;
        data.forEach(function (d) {
            d.ok = +d.ok;

            if (d.ok == 0){
                d = "";
            }
            d.nombre = +d.nombre;
            d.theme = +d.theme;
        });
        words_data_nofilter = [].concat(data);
        loaded[2] = true;
    });

    d3.csv(CSV_caps, function (d) {
        data = d;
        data.forEach(function (d) {
            d.nombre = +d.nombre;
            d.percent = +d.percent;
            d.theme = +d.theme;
        });
        caps_data_nofilter = [].concat(data);
        loaded[3] = true;
    });
/*
    d3.csv(CSV_nbtag, function (d) {
        data = d;
        data.forEach(function (d) {
            d.nombre = +d.nombre;
            d.nbtag = +d.nbtag;
            d.theme = +d.theme;
        });
        hashtag_data_nofilter = [].concat(data);
        loaded[4] = true;
    });
*/
    d3.csv(CSV_hours, function (d) {
        data = d;
        data.forEach(function (d) {
            d.nombre = +d.nombre;
            d.heure = +d.heure;
            d.theme = +d.theme;
        });
        hours_data_nofilter = [].concat(data);
        loaded[5] = true;
    });

    setTimeout(check_loaded, 500);


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



async function init() {
    const data = await d3.csv("https://flunky.github.io/cars2017.csv");
    console.log(data);

    var svg = d3.select("svg");
    var g = svg.append("g").attr("transform", "translate(50,50)");

    var x = d3.scaleLog()
        .base(10)
        .domain([10, 150])
        .range([0, 200]);

    var y = d3.scaleLog()
        .base(10)
        .domain([10, 150])
        .range([200, 0]);

    g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d.AverageCityMPG); })
        .attr("cy", function(d) { return y(d.AverageHighwayMPG); })
        .attr("r", function(d, i) { return 2 + +d.EngineCylinders; });

    var xAxis = d3.axisBottom(x)
        .tickValues([10, 20, 50, 100])
        .tickFormat(d3.format("~s"));

    var yAxis = d3.axisLeft(y)
        .tickValues([10, 20, 50, 100])
        .tickFormat(d3.format("~s"));

    svg.append("g")
        .attr("transform", "translate(50,50)")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(50,250)")
        .call(xAxis);
}

init();

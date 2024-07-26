async function initScatterPlot() {
    const svg = d3.select("#scatterPlot svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2,
        gdp: +d.gdp,
        country: d.country,
        iso_code: d.iso_code,
        population: +d.population
    }));

    function updateScatterPlot() {
        const year = +document.getElementById("year").value;
        const yearData = data.filter(d => d.year === year && d.iso_code);

        xScale.domain([0, d3.max(yearData, d => d.gdp)]).nice();
        yScale.domain([0, d3.max(yearData, d => d.co2)]).nice();

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const circles = g.selectAll("circle").data(yearData);

        circles.enter().append("circle")
            .merge(circles)
            .attr("cx", d => xScale(d.gdp))
            .attr("cy", d => yScale(d.co2))
            .attr("r", d => Math.sqrt(d.population) / 500)
            .attr("fill", d => colorScale(d.country))
            .attr("opacity", 0.7)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Country: ${d.country}<br/>CO₂: ${d.co2}<br/>GDP: ${d.gdp}<br/>Population: ${d.population}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("stroke", null);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        circles.exit().remove();

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        const legend = g.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        legend.append("rect")
            .attr("x", innerWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legend.append("text")
            .attr("x", innerWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);

        // Add trend line
        const xMean = d3.mean(yearData, d => d.gdp);
        const yMean = d3.mean(yearData, d => d.co2);
        const xStdDev = d3.deviation(yearData, d => d.gdp);
        const yStdDev = d3.deviation(yearData, d => d.co2);
        
        const line = g.append("line")
            .attr("x1", xScale(xMean - xStdDev))
            .attr("y1", yScale(yMean - yStdDev))
            .attr("x2", xScale(xMean + xStdDev))
            .attr("y2", yScale(yMean + yStdDev))
            .attr("stroke", "red")
            .attr("stroke-width", 2);
    }

    document.getElementById("scatterPlot").addEventListener('update', updateScatterPlot);

    updateScatterPlot();
}

initScatterPlot();

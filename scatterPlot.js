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
    const yAxis = d3.axisLeft(yScale);

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2,
        country: d.country,
        gdp: +d.gdp
    }));

    function updateScatterPlot() {
        const year = +document.getElementById("year").value;
        const filteredData = data.filter(d => d.year === year);

        xScale.domain(d3.extent(filteredData, d => d.gdp));
        yScale.domain(d3.extent(filteredData, d => d.co2));

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const circles = g.selectAll(".circle")
            .data(filteredData, d => d.country);

        circles.enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => xScale(d.gdp))
            .attr("cy", d => yScale(d.co2))
            .attr("r", 5)
            .attr("fill", "steelblue");

        circles.exit().remove();

        circles.transition()
            .attr("cx", d => xScale(d.gdp))
            .attr("cy", d => yScale(d.co2))
            .attr("r", 5);
    }

    document.getElementById("scatterPlot").addEventListener('update', updateScatterPlot);

    updateScatterPlot();
}

initScatterPlot();

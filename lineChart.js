async function initLineChart() {
    const svg = d3.select("#lineChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2,
        country: d.country
    }));

    function updateLineChart() {
        const startYear = +document.getElementById("startYear").value;
        const endYear = +document.getElementById("endYear").value;
        const filteredData = data.filter(d => d.year >= startYear && d.year <= endYear);

        const nestedData = d3.group(filteredData, d => d.year);

        const yearSum = Array.from(nestedData, ([key, values]) => ({
            year: key,
            co2: d3.sum(values, d => d.co2)
        }));

        xScale.domain(d3.extent(yearSum, d => d.year)).nice();
        yScale.domain([0, d3.max(yearSum, d => d.co2)]).nice();

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.co2));

        g.selectAll(".line-path").data([yearSum])
            .join("path")
            .attr("class", "line-path")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        const points = g.selectAll(".point").data(yearSum);

        points.enter().append("circle")
            .attr("class", "point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.co2))
            .attr("r", 3)
            .attr("fill", "steelblue");

        points.attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.co2));

        points.exit().remove();
    }

    document.getElementById("lineChart").addEventListener('update', updateLineChart);

    updateLineChart();
}

initLineChart();

async function initLineChart() {
    const svg = d3.select("#lineChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const line = d3.line()
        .x(d => xScale(new Date(d.year, 0, 1)))
        .y(d => yScale(d.co2));

    const path = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2,
        country: d.country
    }));

    const worldData = data.filter(d => d.country === 'World');

    function updateLineChart() {
        const startYear = +document.getElementById("startYear").value;
        const endYear = +document.getElementById("endYear").value;
        const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

        xScale.domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)));
        yScale.domain([0, d3.max(filteredData, d => d.co2)]);

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        path.datum(filteredData).attr("d", line);
    }

    document.getElementById("lineChart").addEventListener('update', updateLineChart);

    updateLineChart();
}

initLineChart();

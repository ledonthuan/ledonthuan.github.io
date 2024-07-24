async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv", d3.autoType);
    console.log(data);  // Verify data is loaded correctly

    // Filter data for a specific country (e.g., 'World')
    const worldData = data.filter(d => d.country === 'World');

    // Initialize SVG
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(worldData, d => d.year))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(worldData, d => d.co2)])
        .range([innerHeight, 0]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append axes
    g.append("g").call(yAxis);
    g.append("g").call(xAxis)
        .attr("transform", `translate(0,${innerHeight})`);

    // Create the line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.co2));

    // Draw the line
    g.append("path")
        .datum(worldData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}

init();
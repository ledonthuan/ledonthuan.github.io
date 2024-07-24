async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");
    console.log(data);  // Verify data is loaded correctly

    // Initialize SVG
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.year)))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.co2)])
        .range([innerHeight, 0]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append axes
    g.append("g").call(yAxis);
    g.append("g").call(xAxis)
        .attr("transform", `translate(0,${innerHeight})`);

    // Draw data (e.g., line chart)
    const line = d3.line()
        .x(d => xScale(new Date(d.year)))
        .y(d => yScale(+d.co2));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add annotations, interactivity, etc. here
}

init();
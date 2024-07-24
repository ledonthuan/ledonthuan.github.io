async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");

    // Parse the data
    data.forEach(d => {
        d.year = new Date(d.year);  // Convert year to Date object
        d.co2 = +d.co2;             // Convert co2 to number
    });

    // Filter for the world data
    const worldData = data.filter(d => d.country === 'World');

    // Initialize SVG dimensions
    const svg = d3.select("svg");
    const width = +svg.attr("width") || 600;
    const height = +svg.attr("height") || 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(worldData, d => d.year))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(worldData, d => d.co2)])
        .range([innerHeight, 0]);

    // Create the line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.co2));

    // Draw the line
    g.append("path")
        .datum(worldData)  // Use datum instead of data
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // Append axes
    g.append("g")
        .call(yAxis);

    g.append("g")
        .call(xAxis)
        .attr("transform", `translate(0,${innerHeight})`);

    // Add annotations, interactivity, etc. here
}

init();

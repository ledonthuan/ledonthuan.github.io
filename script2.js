async function init(start, end) {
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
        .domain([new Date(start), new Date(end)])
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

    // Function to update chart based on custom time range
    function updateChart() {
        const startDate = d3.select("#startDate").property("value");
        const endDate = d3.select("#endDate").property("value");

        xScale.domain([new Date(startDate), new Date(endDate)]);

        // Update the x-axis
        g.select(".x-axis")
            .transition()
            .duration(500)
            .call(xAxis);
       
        // Update the line
        g.select("path")
            .datum(worldData)
            .transition()
            .duration(500)
            .attr("d", line);
    }

    // Listen to changes in the input fields and update chart on button click
    d3.select("#updateButton").on("click", updateChart);
}

// Call init() with default start and end dates
init("1970-01-01", "2020-01-01");
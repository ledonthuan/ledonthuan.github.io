async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");

    // Parse the data
    data.forEach(d => {
        d.year = +d.year;  // Parse year as an integer
        d.co2 = +d.co2;  // Ensure co2 is a number
    });

    // Filter for the world data
    const worldData = data.filter(d => d.country === 'World');

    // Initialize SVG dimensions
    const svg = d3.select("svg");
    const width = +svg.attr("width") || 600;
    const height = +svg.attr("height") || 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));  // Format y-axis ticks

    // Append axes
    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    // Create the line generator
    const line = d3.line()
        .x(d => xScale(new Date(d.year, 0, 1)))  // Use only the year for the x value
        .y(d => yScale(d.co2));

    const path = g.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    function updateChart() {
        // Get the selected date range
        const startYear = +document.getElementById("startDate").value;
        const endYear = +document.getElementById("endDate").value;

        // Filter data based on selected range
        const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

        // Update scales
        xScale.domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)));
        yScale.domain([0, d3.max(filteredData, d => d.co2)]);

        // Update axes
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        // Update line path
        path.datum(filteredData)
            .attr("d", line);
    }

    // Add event listener to the button
    document.getElementById("updateButton").addEventListener("click", updateChart);

    // Initial chart render
    updateChart();
}

init();


// async function init() {
//     // Load the dataset
//     const data = await d3.csv("owid-co2-data.csv");

//     // Parse the data
//     data.forEach(d => {
//         d.year = +d.year;  // Parse year as an integer
//         d.co2 = +d.co2;
//     });

//     // Filter for the world data
//     const worldData = data.filter(d => d.country === 'World');

//     // Initialize SVG dimensions
//     const svg = d3.select("svg");
//     const width = +svg.attr("width") || 600;
//     const height = +svg.attr("height") || 400;
//     const margin = { top: 20, right: 30, bottom: 40, left: 70 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     const g = svg.append("g")
//         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//     // Set up scales
//     const xScale = d3.scaleTime()
//         .range([0, innerWidth]);

//     const yScale = d3.scaleLinear()
//         .range([innerHeight, 0]);

//     // Set up axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale)
//         .tickFormat(d3.format(".2s"));

//     // Append axes
//     const xAxisGroup = g.append("g")
//         .attr("transform", `translate(0,${innerHeight})`);
//     const yAxisGroup = g.append("g");

//     // Create the line generator
//     const line = d3.line()
//         .x(d => xScale(new Date(d.year, 0, 1)))  // Use only the year for the x value
//         .y(d => yScale(d.co2));

//     const path = g.append("path")
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5);

//     function updateChart() {
//         const startYear = +document.getElementById("startDate").value;
//         const endYear = +document.getElementById("endDate").value;

//         const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

//         xScale.domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)));
//         yScale.domain([0, d3.max(filteredData, d => d.co2)]);

//         xAxisGroup.call(xAxis);
//         yAxisGroup.call(yAxis);

//         path.datum(filteredData)
//             .attr("d", line);
//     }

//     document.getElementById("updateButton").addEventListener("click", updateChart);

//     // Initial chart render
//     updateChart();
// }

// init();


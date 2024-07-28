// document.getElementById('lineChart').addEventListener('update', updateLineChart);

// async function updateLineChart() {
//     // Load the dataset
//     const data = await d3.csv("owid-co2-data.csv");

//     // Parse the data
//     data.forEach(d => {
//         d.year = +d.year;  // Parse year as an integer
//         d.co2 = +d.co2;   // Ensure co2 is a number
//     });

//     // Filter for the world data
//     const worldData = data.filter(d => d.country === 'World' && d.co2 !== null);

//     // Get the selected date range
//     const startYear = +document.getElementById("startYear").value;
//     const endYear = +document.getElementById("endYear").value;

//     // Filter data based on selected range
//     const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

//     // Initialize SVG dimensions
//     const svg = d3.select("#lineChart svg");
//     const width = +svg.attr("width") || 800;
//     const height = +svg.attr("height") || 600;
//     const margin = { top: 50, right: 30, bottom: 60, left: 80 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Clear previous content
//     svg.selectAll("*").remove();

//     // Append a group element to the SVG
//     const g = svg.append("g")
//         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//     // Set up scales
//     const xScale = d3.scaleTime()
//         .domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)))
//         .range([0, innerWidth]);

//     const yScale = d3.scaleLinear()
//         .domain([0, d3.max(filteredData, d => d.co2)])
//         .range([innerHeight, 0]);

//     // Set up axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale);

//     // Append axes
//     const xAxisGroup = g.append("g")
//         .attr("transform", `translate(0,${innerHeight})`);
//     const yAxisGroup = g.append("g");

//     xAxisGroup.call(xAxis);
//     yAxisGroup.call(yAxis);

//     // Create the line generator
//     const line = d3.line()
//         .x(d => xScale(new Date(d.year, 0, 1)))
//         .y(d => yScale(d.co2));

//     // Draw the line
//     g.append("path")
//         .datum(filteredData)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5)
//         .attr("d", line);

//     // Add x-axis label
//     svg.append("text")
//         .attr("class", "x-axis-label")
//         .attr("text-anchor", "middle")
//         .attr("x", margin.left + innerWidth / 2)
//         .attr("y", height - 10)
//         .text("Year");

//     // Add y-axis label
//     svg.append("text")
//         .attr("class", "y-axis-label")
//         .attr("text-anchor", "middle")
//         .attr("transform", `translate(${15},${margin.top + innerHeight / 2})rotate(-90)`)
//         .text("CO₂ Emissions (Metric Tons)");

//     // Add chart title
//     svg.append("text")
//         .attr("class", "chart-title")
//         .attr("text-anchor", "middle")
//         .attr("x", margin.left + innerWidth / 2)
//         .attr("y", margin.top / 2)
//         .attr("font-size", "24px")
//         .text("CO₂ Emissions Over Time");
// }

// // Initial update on page load
// updateLineChart();

document.getElementById('lineChart').addEventListener('update', updateLineChart);

async function updateLineChart() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");

    // Parse the data
    data.forEach(d => {
        d.year = +d.year;  // Parse year as an integer
        d.co2 = +d.co2;   // Ensure co2 is a number
    });

    // Filter for the world data
    const worldData = data.filter(d => d.country === 'World' && d.co2 !== null);

    // Get the selected date range
    const startYear = +document.getElementById("startYear").value;
    const endYear = +document.getElementById("endYear").value;

    // Filter data based on selected range
    const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

    // Initialize SVG dimensions
    const svg = d3.select("#lineChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 50, right: 30, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll("*").remove();

    // Append a group element to the SVG
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)))
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.co2)])
        .range([innerHeight, 0]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append axes
    const xAxisGroup = g.append("g")
        .attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Create the line generator
    const line = d3.line()
        .x(d => xScale(new Date(d.year, 0, 1)))
        .y(d => yScale(d.co2));

    // Draw the line
    g.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", height - 10)
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${15},${margin.top + innerHeight / 2})rotate(-90)`)
        .text("CO₂ Emissions (Metric Tons)");

    // Add chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + innerWidth / 2)
        .attr("y", margin.top / 2)
        .attr("font-size", "24px")
        .text("CO₂ Emissions Over Time changed");

    // Define annotations
    const annotations = [
        {
            note: {
                label: "Start of the Industrial Revolution",
                title: "1760"
            },
            data: { year: 1760, co2: filteredData.find(d => d.year === 1760)?.co2 },
            dy: -30,
            dx: 30
        },
        {
            note: {
                label: "End of World War II",
                title: "1945"
            },
            data: { year: 1945, co2: filteredData.find(d => d.year === 1945)?.co2 },
            dy: -30,
            dx: -30
        },
        {
            note: {
                label: "Kyoto Protocol Signed",
                title: "1997"
            },
            data: { year: 1997, co2: filteredData.find(d => d.year === 1997)?.co2 },
            dy: -30,
            dx: -30
        }
    ];

    const type = d3.annotationLabel;

    const makeAnnotations = d3.annotation()
        .editMode(false)
        .notePadding(15)
        .type(type)
        .accessors({
            x: d => xScale(new Date(d.year, 0, 1)),
            y: d => yScale(d.co2)
        })
        .annotations(annotations.map(d => ({
            note: d.note,
            x: xScale(new Date(d.data.year, 0, 1)),
            y: yScale(d.data.co2),
            dx: d.dx,
            dy: d.dy
        })));

    g.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Initial update on page load
updateLineChart();



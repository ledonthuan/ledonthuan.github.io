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
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
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

    // Define annotations
    const annotations = [
        {
            note: { label: "Industrial Revolution", title: "1780s" },
            data: { year: 1780, co2: 0.04 },
            dx: -30,
            dy: -30,
            subject: { radius: 4 }
        },
        {
            note: { label: "Great Depression", title: "1930s" },
            data: { year: 1930, co2: 1.0 },
            dx: -30,
            dy: -30,
            subject: { radius: 4 }
        },
        {
            note: { label: "Post-WWII Boom", title: "1950s" },
            data: { year: 1950, co2: 3.5 },
            dx: -30,
            dy: -30,
            subject: { radius: 4 }
        },
        {
            note: { label: "Oil Crisis", title: "1970s" },
            data: { year: 1973, co2: 4.7 },
            dx: -30,
            dy: -30,
            subject: { radius: 4 }
        },
        {
            note: { label: "2008 Financial Crisis", title: "2008" },
            data: { year: 2008, co2: 8.6 },
            dx: -30,
            dy: -30,
            subject: { radius: 4 }
        }
    ];

    // Add annotations to the chart
    const makeAnnotations = d3.annotation()
        .type(d3.annotationCalloutCircle)
        .accessors({
            x: d => xScale(new Date(d.year, 0, 1)),
            y: d => yScale(d.co2)
        })
        .annotations(annotations);

    g.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Event listener to trigger the update when the 'update' event is dispatched
document.getElementById('lineChart').addEventListener('update', updateLineChart);

// Initial update on page load
updateLineChart();


// // Event listener to trigger the update when the 'update' event is dispatched
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
//     const margin = { top: 20, right: 30, bottom: 40, left: 70 };
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
// }

// // Initial update on page load
// updateLineChart();

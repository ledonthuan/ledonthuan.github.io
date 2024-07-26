async function initLineChart() {
    const data = await d3.csv("owid-co2-data.csv");

    data.forEach(d => {
        d.year = +d.year;
        d.co2 = +d.co2;
    });

    const worldData = data.filter(d => d.country === 'World');

    const svg = d3.select("#lineChart").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const line = d3.line()
        .x(d => xScale(new Date(d.year, 0, 1)))
        .y(d => yScale(d.co2));

    xScale.domain(d3.extent(worldData, d => new Date(d.year, 0, 1)));
    yScale.domain([0, d3.max(worldData, d => d.co2)]);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    g.append("g").call(yAxis);

    g.append("path")
        .datum(worldData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Adding annotations
    const annotations = [
        {
            note: { label: "Industrial Revolution", title: "Late 1700s - Early 1800s" },
            data: { year: 1800, co2: 2000 },
            dy: -30,
            dx: 30,
            color: "red"
        },
        {
            note: { label: "Kyoto Protocol", title: "1997" },
            data: { year: 1997, co2: 25000 },
            dy: -50,
            dx: 50,
            color: "green"
        },
        {
            note: { label: "Paris Agreement", title: "2015" },
            data: { year: 2015, co2: 35000 },
            dy: -30,
            dx: -50,
            color: "blue"
        },
        {
            note: { label: "COVID-19 Pandemic", title: "2020" },
            data: { year: 2020, co2: 32000 },
            dy: 30,
            dx: -30,
            color: "orange"
        }
    ];

    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .accessors({
            x: d => xScale(new Date(d.year, 0, 1)),
            y: d => yScale(d.co2)
        })
        .annotations(annotations);

    g.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

initLineChart();


// async function init() { //line chart
//     // Load the dataset
//     const data = await d3.csv("owid-co2-data.csv");

//     // Parse the data
//     data.forEach(d => {
//         d.year = +d.year;  // Parse year as an integer
//         d.co2 = +d.co2;  // Ensure co2 is a number
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

//     // Set up y scale and axis format to display in millions of tons
//     const yScale = d3.scaleLinear()
//         .range([innerHeight, 0]);

//     // Create a custom format function for y-axis
//     const formatYAxis = d3.format(".2s");  // For large numbers (like 35,000,000), this can show "35M"

//     // Set up axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale)
//         .tickFormat(d => formatYAxis(d / 1e9) + 'B');  // Convert to millions of tons

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
//         // Get the selected date range
//         const startYear = +document.getElementById("startDate").value;
//         const endYear = +document.getElementById("endDate").value;

//         // Filter data based on selected range
//         const filteredData = worldData.filter(d => d.year >= startYear && d.year <= endYear);

//         // Update scales
//         xScale.domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)));
//         yScale.domain([0, d3.max(filteredData, d => d.co2)]);

//         // Update axes
//         xAxisGroup.call(xAxis);
//         yAxisGroup.call(yAxis);

//         // Update line path
//         path.datum(filteredData)
//             .attr("d", line);
//     }

//     // Add event listener to the button
//     document.getElementById("updateButton").addEventListener("click", updateChart);

//     // Initial chart render
//     updateChart();
// }

// init();

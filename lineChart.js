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

    const nestedData = d3.groups(data, d => d.country).map(([key, values]) => ({
        country: key,
        values: values.sort((a, b) => a.year - b.year)
    }));

    function updateLineChart() {
        const startYear = +document.getElementById("startYear").value;
        const endYear = +document.getElementById("endYear").value;

        const filteredData = nestedData.map(d => ({
            country: d.country,
            values: d.values.filter(v => v.year >= startYear && v.year <= endYear)
        }));

        xScale.domain([startYear, endYear]);
        yScale.domain([0, d3.max(filteredData, c => d3.max(c.values, d => d.co2))]).nice();

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.co2));

        const countries = g.selectAll(".country").data(filteredData, d => d.country);

        const countryEnter = countries.enter().append("g").attr("class", "country");
        
        countryEnter.append("path")
            .merge(countries.select("path"))
            .attr("fill", "none")
            .attr("stroke", d => d3.schemeCategory10[nestedData.findIndex(c => c.country === d.country)])
            .attr("stroke-width", 1.5)
            .attr("d", d => line(d.values));

        countries.exit().remove();

        // Adding annotations
        const annotations = [
            {
                note: { label: "Industrial Revolution begins", title: "1760" },
                x: xScale(1760),
                y: yScale(0),
                dx: 10,
                dy: -50,
                subject: { radius: 4 }
            },
            {
                note: { label: "First oil crisis", title: "1973" },
                x: xScale(1973),
                y: yScale(0),
                dx: 10,
                dy: -50,
                subject: { radius: 4 }
            },
            {
                note: { label: "Kyoto Protocol", title: "1997" },
                x: xScale(1997),
                y: yScale(0),
                dx: 10,
                dy: -50,
                subject: { radius: 4 }
            },
            {
                note: { label: "Great Depression", title: "1929-1939" },
                x: xScale(1929),
                y: yScale(0),
                dx: 10,
                dy: -50,
                subject: { radius: 4 }
            },
            {
                note: { label: "2008 Financial Crisis", title: "2008" },
                x: xScale(2008),
                y: yScale(0),
                dx: 10,
                dy: -50,
                subject: { radius: 4 }
            }
        ];

        const makeAnnotations = d3.annotation().annotations(annotations);

        // Clear previous annotations
        svg.select(".annotation-group").remove();

        // Append new annotations
        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }

    document.getElementById("lineChart").addEventListener('update', updateLineChart);

    updateLineChart();
}

document.addEventListener('DOMContentLoaded', initLineChart);




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

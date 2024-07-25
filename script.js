// async function init() {
//     // Load the dataset
//     const data = await d3.csv("owid-co2-data.csv");

//     // Parse the data
//     data.forEach(d => {
//         d.year = +d.year;  // Parse year as an integer
//         d.co2 = +d.co2;  // Ensure CO2 is a number
//     });

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
//     const xScale = d3.scaleBand()
//         .range([0, innerWidth])
//         .padding(0.1);

//     const yScale = d3.scaleLinear()
//         .range([innerHeight, 0]);

//     // Set up axes
//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale)
//         .tickFormat(d3.format(".2s"));  // Format y-axis ticks

//     // Append axes
//     g.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0,${innerHeight})`);
//     g.append("g")
//         .attr("class", "y-axis");

//     // Create a color scale
//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     // Create the update function
//     function updateChart(year) {
//         // Filter data for the selected year
//         const filteredData = data.filter(d => d.year === year);

//         // Aggregate CO2 emissions by country
//         const countryData = d3.rollup(
//             filteredData,
//             v => d3.sum(v, d => d.co2),
//             d => d.country
//         );

//         // Convert to an array, sort by CO2 emissions, and take the top 15
//         const sortedCountries = Array.from(countryData.entries())
//             .sort((a, b) => b[1] - a[1])  // Sort descending by total CO2
//             .slice(0, 15);  // Take the top 15 countries

//         // Check if sortedCountries is not empty
//         if (sortedCountries.length === 0) {
//             console.log("No data available for the selected year.");
//             return;
//         }

//         // Extract the country names and emissions
//         const countries = sortedCountries.map(d => d[0]);
//         const emissions = sortedCountries.map(d => d[1]);

//         // Update scales
//         xScale.domain(countries);
//         yScale.domain([0, d3.max(emissions)]);

//         // Update axes
//         g.select(".x-axis").call(xAxis);
//         g.select(".y-axis").call(yAxis);

//         // Bind data
//         const bars = g.selectAll(".bar")
//             .data(sortedCountries, d => d[0]);

//         // Enter
//         bars.enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", d => xScale(d[0]))
//             .attr("y", d => yScale(d[1]))
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => innerHeight - yScale(d[1]))
//             .attr("fill", d => colorScale(d[0]))
//             .merge(bars)
//             .transition()
//             .duration(750)
//             .attr("x", d => xScale(d[0]))
//             .attr("y", d => yScale(d[1]))
//             .attr("width", xScale.bandwidth())
//             .attr("height", d => innerHeight - yScale(d[1]))
//             .attr("fill", d => colorScale(d[0]));

//         // Exit
//         bars.exit().remove();
//     }

//     // Add event listener to the button
//     document.getElementById("updateButton").addEventListener("click", () => {
//         const year = +document.getElementById("yearInput").value;
//         updateChart(year);
//     });

//     // Initial chart render
//     const initialYear = +document.getElementById("yearInput").value;
//     updateChart(initialYear);
// }

// // Initialize the chart
// init();

async function init() { //bar chart
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");

    // Parse the data
    data.forEach(d => {
        d.year = +d.year;  // Parse year as an integer
        d.co2 = +d.co2;  // Ensure CO2 is a number
    });

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
    const xScale = d3.scaleBand()
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".2s"));  // Format y-axis ticks

    // Append axes
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`);
    g.append("g")
        .attr("class", "y-axis");

    // Create a color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the update function
    function updateChart(year) {
        // Filter data for the selected year
        const filteredData = data.filter(d => d.year === year);

        // Aggregate CO2 emissions by country
        const countryData = d3.rollup(
            filteredData,
            v => d3.sum(v, d => d.co2),
            d => d.country
        );

        // Convert to an array and sort by CO2 emissions
        const sortedCountries = Array.from(countryData.entries())
            .sort((a, b) => b[1] - a[1])  // Sort descending by total CO2
            .slice(0, 15);  // Take the top 15 countries

        const countries = sortedCountries.map(d => d[0]);
        const emissions = sortedCountries.map(d => d[1]);

        // Update scales
        xScale.domain(countries);
        yScale.domain([0, d3.max(emissions)]);

        // Update axes
        g.select(".x-axis").call(xAxis);
        g.select(".y-axis").call(yAxis);

        // Bind data
        const bars = g.selectAll(".bar")
            .data(countries, d => d);

        // Enter
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d))
            .attr("y", d => yScale(countryData.get(d)))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(countryData.get(d)))
            .attr("fill", d => colorScale(d))
            .merge(bars)
            .transition()
            .duration(750)
            .attr("x", d => xScale(d))
            .attr("y", d => yScale(countryData.get(d)))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(countryData.get(d)))
            .attr("fill", d => colorScale(d));

        // Exit
        bars.exit().remove();
    }

    // Add event listeners
    document.getElementById("updateButton").addEventListener("click", () => {
        const year = +document.getElementById("yearInput").value;
        updateChart(year);
    });

    // Initial chart render
    const initialYear = +document.getElementById("yearInput").value;
    updateChart(initialYear);
}

// Initialize the chart
init();

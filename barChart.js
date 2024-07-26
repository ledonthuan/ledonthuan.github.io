async function initBarChart() {
    const svg = d3.select("#barChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand().range([0, innerWidth]).padding(0.1);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2,
        country: d.country,
        iso_code: d.iso_code
    }));

    function updateBarChart() {
        const year = +document.getElementById("year").value;
        const filteredData = data.filter(d => d.year === year && d.iso_code);

        const top15Data = filteredData.sort((a, b) => d3.descending(a.co2, b.co2)).slice(0, 15);

        xScale.domain(top15Data.map(d => d.country));
        yScale.domain([0, d3.max(top15Data, d => d.co2)]);

        xAxisGroup.call(xAxis).selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
        yAxisGroup.call(yAxis);

        const bars = g.selectAll(".bar")
            .data(top15Data, d => d.country);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.co2))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.co2))
            .attr("fill", "steelblue");

        bars.exit().remove();

        bars.transition()
            .attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.co2))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.co2));
    }

    document.getElementById("barChart").addEventListener('update', updateBarChart);

    updateBarChart();
}

initBarChart();



// async function init() {
//     // Load the dataset
//     const data = await d3.csv("owid-co2-data.csv");

//     // Parse the data and filter out rows without a country code
//     const filteredData = data
//         .map(d => {
//             d.year = +d.year;
//             d.co2 = +d.co2;
//             return d;
//         })
//         .filter(d => d.iso_code);  // Keep only rows with a country code

//     // Initialize SVG dimensions
//     const svg = d3.select("svg");
//     const width = +svg.attr("width") || 800;
//     const height = +svg.attr("height") || 600;
//     const margin = { top: 20, right: 30, bottom: 70, left: 70 };
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
//         .tickFormat(d3.format(".2s"));

//     // Append axes
//     const xAxisGroup = g.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0,${innerHeight})`);
//     const yAxisGroup = g.append("g")
//         .attr("class", "y-axis");

//     // Create a color scale
//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     // Function to update the chart
//     function updateChart(year) {
//         // Filter data for the selected year
//         const yearData = filteredData.filter(d => d.year === year);

//         // Aggregate CO2 emissions by country
//         const countryData = d3.rollup(
//             yearData,
//             v => d3.sum(v, d => d.co2),
//             d => d.country
//         );

//         // Convert to an array, sort by CO2 emissions, and take the top 15
//         const topCountries = Array.from(countryData.entries())
//             .sort((a, b) => b[1] - a[1])  // Sort descending by total CO2
//             .slice(0, 15);  // Take the top 15 countries

//         // Extract data
//         const countries = topCountries.map(d => d[0]);
//         const emissions = topCountries.map(d => d[1]);

//         // Update scales
//         xScale.domain(countries);
//         yScale.domain([0, d3.max(emissions)]);

//         // Update axes
//         xAxisGroup.call(xAxis)
//             .selectAll("text")
//             .attr("transform", "rotate(-45)")
//             .style("text-anchor", "end");
//         yAxisGroup.call(yAxis);

//         // Create the bars
//         const bars = g.selectAll(".bar")
//             .data(topCountries, d => d[0]);

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

//     // Add event listeners to buttons
//     document.getElementById("decrementButton").addEventListener("click", () => {
//         const currentYear = +document.getElementById("year").value;
//         const newYear = Math.max(currentYear - 1, 1850);  // Updated minimum year
//         document.getElementById("year").value = newYear;
//         updateChart(newYear);
//     });

//     document.getElementById("incrementButton").addEventListener("click", () => {
//         const currentYear = +document.getElementById("year").value;
//         const newYear = Math.min(currentYear + 1, 2022);
//         document.getElementById("year").value = newYear;
//         updateChart(newYear);
//     });

//     // Add event listener to the input field
//     document.getElementById("year").addEventListener("change", () => {
//         const inputYear = +document.getElementById("year").value;
//         updateChart(inputYear);
//     });

//     // Initial chart render
//     const initialYear = +document.getElementById("year").value;
//     updateChart(initialYear);
// }

// // Initialize the chart
// init();

async function init() { //barchart
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");

    // Parse the data
    data.forEach(d => {
        d.year = +d.year;  // Parse year as an integer
        d.co2 = +d.co2;
    });

    // Initialize SVG dimensions
    const svg = d3.select("svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const xScale = d3.scaleBand()
        .padding(0.1)
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => d / 1000000 + 'M');

    // Append axes
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${innerHeight})`);

    g.append("g")
        .attr("class", "y-axis");

    // Create the stacked bar chart
    function updateChart(year) {
        // Filter data for the selected year
        const filteredData = data.filter(d => d.year === year);

        // Aggregate CO2 emissions by country
        const countryData = d3.rollup(
            filteredData,
            v => d3.sum(v, d => d.co2),
            d => d.country
        );

        const countries = Array.from(countryData.keys());
        const emissions = Array.from(countryData.values());

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

    // Event listeners for year controls
    document.getElementById("year").addEventListener("change", function() {
        updateChart(+this.value);
    });

    document.getElementById("decrementButton").addEventListener("click", function() {
        const yearInput = document.getElementById("year");
        yearInput.value = +yearInput.value - 1;
        updateChart(+yearInput.value);
    });

    document.getElementById("incrementButton").addEventListener("click", function() {
        const yearInput = document.getElementById("year");
        yearInput.value = +yearInput.value + 1;
        updateChart(+yearInput.value);
    });

    // Initial chart render
    updateChart(+document.getElementById("year").value);
}

init();

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

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.co2));

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2
    }));

    const annotationsData = [
        {
            note: { label: "Industrial Revolution", title: "1760" },
            data: { year: 1760, co2: 0 },
            dy: -30,
            dx: 30,
        },
        {
            note: { label: "World War II", title: "1939-1945" },
            data: { year: 1940, co2: 1000 },
            dy: -30,
            dx: -50,
        },
        {
            note: { label: "Oil Crisis", title: "1973" },
            data: { year: 1973, co2: 5000 },
            dy: 50,
            dx: 50,
        },
        {
            note: { label: "Kyoto Protocol", title: "1997" },
            data: { year: 1997, co2: 9000 },
            dy: -30,
            dx: -50,
        }
    ];

    function updateAnnotations() {
        const annotations = annotationsData.filter(d => d.data.year >= xScale.domain()[0] && d.data.year <= xScale.domain()[1]);

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .accessors({
                x: d => xScale(d.year),
                y: d => yScale(d.co2)
            })
            .annotations(annotations);

        g.selectAll(".annotation-group").remove();
        g.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }

    function updateLineChart() {
        const startYear = +document.getElementById("startYear").value;
        const endYear = +document.getElementById("endYear").value;

        const filteredData = data.filter(d => d.year >= startYear && d.year <= endYear);

        xScale.domain([startYear, endYear]).nice();
        yScale.domain([0, d3.max(filteredData, d => d.co2)]).nice();

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const path = g.selectAll(".line").data([filteredData]);

        path.enter().append("path")
            .attr("class", "line")
            .merge(path)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue");

        path.exit().remove();

        updateAnnotations();
    }

    document.getElementById("lineChart").addEventListener("update", updateLineChart);

    updateLineChart();
}

initLineChart();


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

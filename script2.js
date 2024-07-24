async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");
    console.log(data);  // Verify data is loaded correctly

    // Initialize SVG
    const svg = d3.select("svg");
    const g = svg.append("g").attr("transform","translate(100,100)");

    // only get the world data
    const worldData = data.filter(d => d.country === 'World');

    //set up scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(worldData, d => d.year))
        .range([0, 500]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(worldData, d => d.co2)])
        .range([300, 0]);

    // Create the line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.co2));

    // Draw the line
    g.append("path")
        .data(worldData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Set up axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    
    // Add annotations, interactivity, etc. here
}

init();
async function initLineChart() {
    const svg = d3.select("#lineChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 20, right: 30, bottom: 40, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    const line = d3.line()
        .x(d => xScale(new Date(d.year, 0, 1)))
        .y(d => yScale(d.co2));

    const data = await d3.csv("owid-co2-data.csv", d => ({
        year: +d.year,
        co2: +d.co2
    }));

    function updateLineChart() {
        const startYear = +document.getElementById("startYear").value;
        const endYear = +document.getElementById("endYear").value;

        const filteredData = data.filter(d => d.year >= startYear && d.year <= endYear && d.co2);

        xScale.domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)));
        yScale.domain([0, d3.max(filteredData, d => d.co2)]);

        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const path = g.selectAll("path").data([filteredData]);

        path.enter().append("path")
            .merge(path)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        path.exit().remove();

        // Remove previous annotations
        g.selectAll(".annotation").remove();

        // Define annotations
        const annotations = [
            {
                note: {
                    label: "Economic recession affected industrial output",
                    title: "2008 Financial Crisis"
                },
                x: xScale(new Date(2008, 0, 1)),
                y: yScale(d3.max(filteredData, d => d.co2) * 0.9),
                dx: 0,
                dy: -50,
                color: "red"
            },
            {
                note: {
                    label: "Implementation of Kyoto Protocol",
                    title: "1997 Kyoto Protocol"
                },
                x: xScale(new Date(1997, 0, 1)),
                y: yScale(d3.max(filteredData, d => d.co2) * 0.8),
                dx: 0,
                dy: -50,
                color: "green"
            }
            // Add more annotations as needed
        ];

        const makeAnnotations = d3.annotation()
            .annotations(annotations)
            .type(d3.annotationLabel)
            .accessors({
                x: d => d.x,
                y: d => d.y
            })
            .draw(g);
    }

    document.getElementById("lineChart").addEventListener('update', updateLineChart);

    updateLineChart();
}

initLineChart();

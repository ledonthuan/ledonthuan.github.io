async function initBarChart() {
    const svg = d3.select("#barChart svg");
    const width = +svg.attr("width") || 800;
    const height = +svg.attr("height") || 600;
    const margin = { top: 50, right: 30, bottom: 80, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand().range([0, innerWidth]).padding(0.1);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));

    const xAxisGroup = g.append("g").attr("transform", `translate(0,${innerHeight})`);
    const yAxisGroup = g.append("g");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Top 15 CO₂ Emitting Countries (hover for tooltip)");

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 4 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Country");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left / 4)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("CO₂ Emissions (MtCO₂)");

    const data = await d3.csv("owid-co2-data.csv", d => {
        return {
            year: +d.year,
            co2: +d.co2,
            coal_co2: +d.coal_co2,
            oil_co2: +d.oil_co2,
            gas_co2: +d.gas_co2,
            cement_co2: +d.cement_co2,
            flaring_co2: +d.flaring_co2,
            country: d.country,
            iso_code: d.iso_code
        };
    });

    console.log("Parsed Data: ", data); // Debugging step to ensure data is parsed correctly

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "none");

    function updateBarChart() {
        const year = +document.getElementById("year").value;
        const yearData = data.filter(d => d.year === year && d.iso_code);

        console.log("Filtered Data: ", yearData); // Debugging step to ensure data is filtered correctly

        const top15 = yearData.sort((a, b) => b.co2 - a.co2).slice(0, 15);

        xScale.domain(top15.map(d => d.country));
        yScale.domain([0, d3.max(top15, d => d.co2)]);

        xAxisGroup.call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
        yAxisGroup.call(yAxis);

        const bars = g.selectAll(".bar").data(top15);

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.co2))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.co2))
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                console.log("Hovered Data: ", d); // Debugging step to log the data of hovered element
                d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(
                    `Country: ${d.country}<br/>
                    Total CO₂: ${d.co2} MtCO₂<br/>
                    Coal CO₂: ${d.coal_co2 || 0} MtCO₂<br/>
                    Oil CO₂: ${d.oil_co2 || 0} MtCO₂<br/>
                    Gas CO₂: ${d.gas_co2 || 0} MtCO₂<br/>
                    Cement CO₂: ${d.cement_co2 || 0} MtCO₂<br/>
                    Flaring CO₂: ${d.flaring_co2 || 0} MtCO₂`
                )
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("stroke", null);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        bars.attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.co2))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.co2));

        bars.exit().remove();
    }

    document.getElementById("barChart").addEventListener('update', updateBarChart);

    updateBarChart();
}

initBarChart();


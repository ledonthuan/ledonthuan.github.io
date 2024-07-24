async function init() {
    // Load the dataset
    const data = await d3.csv("owid-co2-data.csv");
    console.log(data);  // Verify data is loaded correctly

    // Initialize SVG
    const svg = d3.select("svg");
    const g = svg.append("g").attr("transform","translate(50,50)");

    //set up scales
    const xScale = d3.scaleTime

    // Add annotations, interactivity, etc. here
}

init();
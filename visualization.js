document.addEventListener("DOMContentLoaded", () => {
  d3.json("/cantons.json").then(cantons => {
    d3.csv("/reform.csv").then(metaData => {
      // define width and height
      const width = 800;
      const height = 600;
      // grab #viz container
      const container = d3.select("#viz");
      // define container
      const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#313131");
      // define map projection
      const swissMapProjection = d3
        .geoAlbers()
        .rotate([0, 0])
        .center([8.3, 46.8])
        .scale(13000)
        .translate([width / 2, height / 2])
        .precision(0.1);
      // create path
      const pathGenerator = d3.geoPath().projection(swissMapProjection);
      // define threshold range for colors
      const colorScale = d3
        .scaleThreshold()
        .domain([30, 35, 40, 45, 50, 55, 60, 65, 70, 100])
        .range([
          "#d0001b",
          "#e0513c",
          "#ee7e5f",
          "#f7a684",
          "#fdceaa",
          "#d0e0af",
          "#a6c185",
          "#7da35b",
          "#538633",
          "#256900"
        ]);
      // define Tooltip
      const tooltip = container
        .append("div")
        .style("opacity", 0)
        .style("position", "fixed")
        .style("background", "rgba(255, 255, 255, 0.8)")
        .style("padding", "3rem")
        .style("pointer-events", "none");
      // define Cantons
      const swissCantons = svg
        .selectAll("path")
        .data(cantons.features)
        .enter()
        .append("path")
        .attr("d", d => pathGenerator(d))
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 0.5)
        .attr("fill", function(d) {
          const cantonMetaData = metaData.find(
            ja_anteil => ja_anteil.id == d.properties.id
          );
          return colorScale(cantonMetaData.ja_anteil);
        })
        .on("mouseenter", function(d) {
          const cantonYesVotes = metaData.find(
            ja_anteil => ja_anteil.id == d.properties.id
          );
          const cantonTotalVotes = metaData.find(
            total => total.id == d.properties.id
          );
          tooltip
            .classed("tooltip", true)
            .style("opacity", 1)
            .html(
              "<h1>" +
                d.properties.name +
                "</h1>" +
                "<h2>" +
                "Ja-Stimmenanteil, in %: " +
                cantonYesVotes.ja_anteil +
                "</h2>" +
                "<p>" +
                "Anzahl gültige Stimmen: " +
                cantonTotalVotes.total +
                "</p>"
            );
        })
        .on("mousemove", function(d) {
          tooltip
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
        })
        .on("mouseleave", function() {
          tooltip.style("opacity", 0);
        });
      const mycities = svg
        .selectAll("circle")
        .data(metaData)
        .enter()
        .append("circle")
        .attr("cx", d => swissMapProjection([d.lon, d.lat])[0])
        .attr("cy", d => swissMapProjection([d.lon, d.lat])[1])
        .attr("r", d => d.size)
        .attr("fill", "rgba(12,61,245,0.65)")
        .attr("stroke", "rgba(12,61,245,1)")
        .attr("stroke-width", 1)
        .style("pointer-events", "none")
        .on("click", d => {
          console.log("Data: ", d);
        });
    });
  });
});

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
        .style("background-color", "#white");
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
          "#3f007d",
          "#54278f",
          "#6a51a3",
          "#807dba",
          "#9e9ac8",
          "#74c476",
          "#41ab5d",
          "#238b45",
          "#006d2c",
          "#00441b"
        ]);
      // define Tooltip
      const tooltip = container
        .append("div")
        .style("opacity", 0)
        .style("position", "fixed")
        .style("background", "rgba(255, 255, 255, 0.85)")
        .style("padding", "15px")
        .style("border", "0.6px solid rgba(255,255,255,1)")
        .style("border-radius", "4px")
        .style("pointer-events", "none");
      // define Cantons
      const swissCantons = svg
        .selectAll("path")
        .data(cantons.features)
        .enter()
        .append("path")
        .attr("d", d => pathGenerator(d))
        .attr("stroke", "rgba(255,255,255,1)")
        .attr("stroke-width", 0.6)
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
              "<h2>" +
                d.properties.name +
                "</h2>" +
                "<p>" +
                "Ja-Stimmenanteil, in %: " +
                "<br>" +
                cantonYesVotes.ja_anteil +
                "</p>" +
                "<p>" +
                "Anzahl gültige Stimmen: " +
                "<br>" +
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
      // add bubbles with relative size
      const sizeOfVotes = svg
        .selectAll("circle")
        .data(metaData)
        .enter()
        .append("circle")
        .attr("cx", d => swissMapProjection([d.lon, d.lat])[0])
        .attr("cy", d => swissMapProjection([d.lon, d.lat])[1])
        .attr("r", d => d.size)
        .attr("fill", "rgba(255,255,255,0.65)")
        .attr("stroke", "rgba(255,255,255,1)")
        .attr("stroke-width", 1)
        .style("pointer-events", "none");
    });
  });
});

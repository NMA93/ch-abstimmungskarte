
document.addEventListener("DOMContentLoaded", () => {
  d3.json("/cantons.json")
    .then(cantons => {
      d3.csv("/referendum.csv")
        .then(yesVotes => {
          console.log(tooltip)
          // ====================

          const width = 800
          const height = 600

          const container = d3.select("#viz")

          const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid #000")

          
          const swissprojection = d3.geoAlbers()
            .center([0, 46.7])
            .rotate([-9, 0, 0])
            .parallels([40, 50])
            .scale(12500)

              const pathGenerator = d3.geoPath().projection(swissprojection)

          const colorScale = d3.scaleThreshold()
            .domain([30,35,40,45,50,55,60,65,70,100])
            .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"])

            const tooltip = container.append('div')
            .style('opacity' , 0)
            .style('position' , 'fixed')
            .style('background' , 'rgba(255, 255, 255, 0.8)')
            .style('padding' , '0.5rem')
            .style('pointer-events' , 'none');
          
            const swiss = svg.selectAll("path")
            .data(cantons.features)
            .enter()
            .append("path")
              .attr("d", d => pathGenerator(d))
              .attr("stroke", "#FFFFFF")
              .attr("stroke-width", 0.5)

              .on("mouseenter", function(d) {
                tooltip
                 .style("opacity", 1)
                 .html(d.properties.NAME)
                  })

             .on ("mousemove", function() {
               tooltip
               .style("left", d3.event.pageX + "px")
               .style("top", d3.event.pageY + "px")
              })

             .on("mouseleave", function(){
               tooltip.style("opacity", 0)
                })
              
                .attr("fill", function(d) {
      
                const cantonMetaData = yesVotes.find(ja_anteil => ja_anteil.id == d.properties.id)
                
                console.log(cantonMetaData)
                
                return colorScale (cantonMetaData.ja_anteil)

              });
              


          // aufgeschlüselte Karte

                        //if (cantonMetaData.ja_anteil > 50) {
                //  return "#004990"
               // } else {
               //   return "#DDDDDD"
              //  }

              

        })
    })
})

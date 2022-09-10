import "./App.css";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
function App() {


  //Chart Data
  const [data] = useState({
    "Javascript": 67.7,
    "HTML/CSS": 63.1,
    "SQL": 54.7,
    "Python": 44.1,
    "Java": 40.2,
    "Bash/Shell/PowerShell": 33.1,
    "C#": 31.4,
    "PHP": 26.2,
    "TypeScript": 25.4,
    "C++": 23.9,
    "C": 21.8,
    "Go": 8.8,
    "Kotlin": 7.8
  })


  const svgRef = useRef();

  useEffect(() => {
    let margin = { top: 20, right: 20, bottom: 30, left: 80 };
    let svgWidth = 720, svgHeight = 600;
    let height = svgHeight - margin.top - margin.bottom, width = svgWidth - margin.left - margin.right;
    let sourceNames = [], sourceCount = [];

    let x = d3.scaleLinear().rangeRound([0, width]),
    y = d3.scaleBand().rangeRound([0, height]).padding(0.2);
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        sourceNames.push(key);
        sourceCount.push(parseInt(data[key]));
      }
    }
    x.domain([0, d3.max(sourceCount, function (d) { return d; })]).range([0, width]);
    y.domain(sourceNames).range([0, 600]);

    let svg = d3
      .select(svgRef.current)
      .attr('height', svgHeight)
      .style("overflow", "visible")
      .attr('width', svgWidth)

    svg.append("g")
      .attr("transform", "translate(0, " + 600 + ")")
      .call(d3.axisBottom(x))
      .selectAll(".tick > line,.tick")
      .remove();

    svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll(".tick > line")
      .remove()

    // Create rectangles
    let bars = svg.selectAll('.bar')
      .data(sourceNames)
      .enter()
      .append("g");

    bars.append('rect')
      .attr('class', 'bar')
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .attr("x", function (d) { return 0; })
      .attr("y", function (d) { return y(d); })
      .attr("width", "0")
      .attr("fill", "hsl(214deg 69% 50%)")
      .attr("height", function (d) { return y.bandwidth(); });

      //Chart Animation on initial loading of page
    svg.selectAll("rect")
      .transition()
      .duration(500)
      .attr("y", function (d) { return y(d); })
      .attr("width", function (d) { return x(data[d]) })
      .delay(function (d, i) { console.log(i); return (i * 100) })


    bars.append("text")
      .text(function (d) {
        return data[d] + "%";
      })
      .attr("x", function (d) {
        return x(data[d]) + 30;
      })
      .attr("y", function (d) {
        console.log(d);
        return y(d) + y.bandwidth() * (0.6 + 0.1); // here 0.1 is the padding scale
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");

    //MouseOver Animation
    function onMouseOver(d, i) {
      d3.select(this).attr('class', 'highlight')
      d3.select(this).transition()
        .duration(500)
        .attr('height', function (d) { return y.bandwidth() + 6 })
        .attr("width", function (d) { return x(data[d]) + 6 })
    }
    //Mouse Out animation
    function onMouseOut(d, i) {
      d3.select(this).attr('class', 'bar')
      d3.select(this).transition()
        .duration(500)
        .attr('height', function (d) { return y.bandwidth() })
        .attr("width", function (d) { return x(data[d]) })
    }
  }, [data]);

  return (
    <div className="App">
      <h1>Most Used programming languages among Developers</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;

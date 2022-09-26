<template>
  <div class="container-graph" ref="infoBox">
    <button>Change</button>
    <svg id="bubblechart" :width="width + 'px'" :height="height + 'px'">
      <g
        v-for="node in nodes"
        :key="node.index"
        :transform="'translate(' + node.x + ',' + node.y + ')'"
      >
        <defs>
          <clipPath :id="'circle' + node.index">
            <rect
              :x="
                rScaler(node.total_times) -
                1 *
                  rScaler(node.total_times) *
                  2 *
                  circularSegment(node.red_weight)
              "
              :y="-rScaler(node.total_times)"
              :width="
                circularSegment(node.red_weight) * 2 * rScaler(node.total_times)
              "
              :height="rScaler(node.total_times) * 2"
              fill="red"
            ></rect>
          </clipPath>
        </defs>
        <circle
          :r="rScaler(node.total_times)"
          stroke="red"
          fill="red"
          stroke-width="1"
        />
        <circle
          :r="rScaler(node.total_times)"
          :clip-path="'url(#circle' + node.index + ')'"
          fill="blue"
        />
        <text
          fill="white"
          alignment-baseline="central"
          text-anchor="middle"
          :font-size="fontScaler(node.total_times)"
        >
          {{ node.champion }}
        </text>
        <!-- new URL("#clip", location) -->
      </g>
    </svg>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  props: ["initialNodes"],
  data() {
    return {
      nodes: this.initialNodes,
      width: Math.max(document.documentElement.clientWidth, 0),
      height: Math.max(document.documentElement.clientHeight - 400, 0),
      simulation: null,
      y: null,
      x: null,
      rScaler: d3.scaleLinear().domain([0, 100]).range([5, 30]),
      fontScaler: d3.scaleLinear().domain([0, 100]).range([7, 18]),
      svgSelector: null,
      innerHeight: 0,
      innerWidth: 0,
      margin: { top: 10, bottom: 10, left: 100, right: 100 },
    };
  },
  mounted() {
    console.log(this.$refs.infoBox.clientWidth)
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;
    this.y = d3
      .scaleBand()
      .domain(["All"])
      .range([this.innerHeight, this.margin.top])
      .padding(1);
    this.x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.margin.left, this.innerWidth]);

    this.svgSelector = d3.select("#bubblechart");

    const xAxis = (g) =>
      g
        .call(
          d3
            .axisTop(this.x)
            .tickFormat((d) => `${d}`)
            .ticks(10)
        )
        .call((g) => {
          g.attr("class", "axis");

          g.append("text")
            .attr("x", innerWidth - 500)
            .attr("y", 20)
            .attr("font-weight", "bold")
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("Blue Side Likelihood →");

          g.append("text")
            .attr("x", this.margin.left + 120)
            .attr("y", 20)
            .attr("font-weight", "bold")
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text("← Red Side Likelihood");
        });

    const xAxisContainer = this.svgSelector
      .append("g")
      .attr("transform", "translate(0,20  )");
    xAxisContainer.call(xAxis);

    const yAxis = (g) =>
      g
        .attr("fill", "#red")
        .call(d3.axisLeft(this.y).ticks(1))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").remove());

    const yAxisContainer = this.svgSelector
      .append("g")
      .attr("transform", "translate(50 ,0)");

    yAxisContainer.attr("class", ".axis").call(yAxis);

    this.simulation = d3
      .forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(-1))
      .force(
        "x",
        d3.forceX().x((d) => this.x(d.red_weight))
      )
      .force("y", d3.forceY(() => this.y("All")).strength(0.1))
      .force(
        "collision",
        d3.forceCollide().radius((d) => this.rScaler(d.total_times) + 2)
      );
  },
  created() {
    console.log(this.width, this.height)
    // simulation
  },
  computed: {

    // newNodes() {
    //   return this.nodes.map((node) => {
    //     return { ...node, w: this.circularSegment(Math.random()) };
    //   });
    // },
    // ScaledCircle() {
    //   return this.nodes.map(
    //   )
    // }
  },
  methods: {
    circularSegment(frac) {
      // let h = frac;
      let h = frac;
      if (h > 0 && h < 1) {
        let t0,
          t1 = Math.pow(12 * h * Math.PI, 1 / 3);
        for (let i = 0; i < 10; ++i) {
          t0 = t1;
          t1 =
            (Math.sin(t0) - t0 * Math.cos(t0) + 2 * h * Math.PI) /
            (1 - Math.cos(t0));
        }
        h = (1 - Math.cos(t1 / 2)) / 2;
      }
      return h;
    },
  },
};
</script>
<style>
.container-graph {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.axis line {
  stroke: red;
}
.axis path {
  stroke: red;
}
.axis text {
  fill: red;
}
</style>

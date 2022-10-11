<template>
  <svg id="visualization" :viewBox="viewBox">
    <g
      class="wrapper"
      :transform="`translate(${margin.left}, ${margin.top})`"
      opacity="1"
      ref='visualization' 
    >
      <g class="plot__axes">
        <!-- <g class="plot__axes__x"></g> -->
        <g class="plot__axes__y">
          <text text-anchor="end" :x="margin.left" :y="80">
            ↑ Champion Win Rate
          </text>
        </g>
      </g>
      <!-- <line
        :x1="innerWidth / 2"
        :y1="100"
        :x2="innerWidth / 2"
        :y2="innerHeight"
        style="stroke: gray; stroke-width: 2; opacity: 0.7"
      />
      <text
        :x="innerWidth / 2"
        y="100"
        font-size="10"
        text-anchor="middle"
        style="fill: white"
      >
        Equal Pick Rate
      </text>
      <g
        class="description2"
        :transform="`translate(${innerWidth / 2}, ${innerHeight / 2})`"
      >
        <text
          y="150"
          font-size="1.2rem"
          text-anchor="middle"
          style="fill: white"
        >
          Size of Bubble depends on total pick rate
        </text>

        <text
          x="100"
          font-size="1.2rem"
          text-anchor="start"
          style="fill: #f51641"
        >
          Red Pick Rate →
        </text>
        <text
          x="-100"
          font-size="1.2rem"
          text-anchor="end"
          style="fill: #5496d0"
        >
          ← Blue Pick Rate
        </text> 
      </g> -->
      <g class="plot-area">
        <g
          v-if="toggleVisExplain"
        >
        <IntroVis :NodeVal="sampleNode['lec']" :scaler="scales" />
          <!-- <CircleNode
            :NodeVal="sampleNode['lec']"
            r="50"
            f="20"
            toggleWinRate="true"
          /> -->
        </g>
        <g
          v-else
          class="plot__circles"
          v-for="node in nodes"
          :key="node.index"
          :transform="'translate(' + node.x + ',' + node.y + ')'"
        >
          <CircleNode
            :NodeVal="node[section]"
            :r="scales.r(node[section].totalpickrate)"
            :f="scales.f(node[section].totalpickrate)"
            :toggleWinRate="toggleWinRate"
          />
        </g>
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";
import CircleNode from "./CircleNode.vue";
import IntroVis from "./IntroVis.vue"
export default {
  props: [
    "initialNodes",
    "vis_step",
    "section",
    "toggleWinRate",
    "toggleVisExplain",
    "startVisualization",
  ],
  components: {
    CircleNode,
    IntroVis
  },
  data() {
    return {
      nodes: this.initialNodes,
      margin: { top: 100, bottom: 100, left: 50, right: 50 },
      width: 0,
      height: 0,
      scales: {
        x: null,
        y: null,
        r: d3.scaleLinear().domain([0, 1]).range([10, 60]),
        f: d3.scaleLinear().domain([0, 1]).range([10, 15]),
      },
      x_scale_margin: 100,
      yAxisPadding: 100,
      simulation: null,
      sampleNode: this.initialNodes.filter((v) => v.champion == "GWEN")[0],
    };
  },
  mounted() {
    this.width = this.$parent.$refs.vizContainer.clientWidth;
    this.height = this.$parent.$refs.vizContainer.clientHeight;
    this.scales.r = d3
      .scaleLinear()
      .domain([0, 1])
      .range([7, Math.max(this.width * 0.04, 10)]);
    this.scales.f = d3
      .scaleLinear()
      .domain([0, 1])
      .range([7, Math.max(this.width * 0.01, 16)]);
    this.render();
    console.log(
      this.width,
      this.height,
      this.$parent.$el.clientHeight,
      this.$parent.$refs.vizContainer.clientWidth * 0.5
    );
  },
  created() {
    console.log(this.section);
    this.simulation = d3.forceSimulation(this.nodes);
  },
  watch: {
    startVisualization: {
      handler(newVal, oldVal) {
        if (oldVal != newVal) {
          console.log(oldVal, newVal);
          this.showVis();
        }
      },
    },
    toggleWinRate: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (oldVal != newVal) {
          this.DrawAxis();
          this.UpdateSimulationData();
        }
      },
      immediate: false,
    },
    toggleVisExplain: {
      handler(newVal, oldVal) {
        if (oldVal != newVal) {
          this.changeDescView();
        }
      },
    },
    section: {
      handler(newVal, oldVal) {
        this.UpdateSimulationData();
        console.log(newVal, oldVal);
      },
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    innerWidth() {
      return this.width - this.margin.left - this.margin.right;
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom;
    },
  },
  methods: {
    showVis() {
      if (this.startVisualization) {
        d3.select(".wrapper").transition().duration(1000).attr("opacity", 1);
      } else {
        d3.select(".wrapper").transition().duration(1000).attr("opacity", 0);
      }
    },
    changeDescView() {
      if (this.toggleVisExplain) {
        d3.select(".description2")
          .transition()
          .duration(600)
          .attr(
            "transform",
            `translate(${this.innerWidth / 2}, ${this.innerHeight / 2})`
          )
          .attr("opacity", 1);
      } else {
        d3.select(".description2")
          .transition()
          .duration(600)
          .attr("transform", `translate(${this.innerWidth / 2}, ${0})`)
          .attr("opacity", 0);
      }
    },
    render() {
      this.initChart();
      this.DrawAxis();
    },
    initChart() {
      // this.simulation;
      this.scales.x = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.x_scale_margin, this.innerWidth - this.x_scale_margin]);

      this.scales.y = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.innerHeight, this.margin.top]);

      this.UpdateSimulationData();
    },
    ticked() {
      // this.nodes = this.nodes.map((v) => {
      //   return { ...v, cx1: v.x, cy1: v.y };
      // });
    },
    UpdateSimulationData() {
      this.simulation
        .force(
          "x",
          d3
            .forceX()
            .x((d) => this.scales.x(d[this.section].red_weight))
            .strength(this.toggleWinRate ? 0.03 : 0.7)
        )
        .force(
          "y",
          d3
            .forceY()
            .y((d) =>
              this.toggleWinRate
                ? this.scales.y(d[this.section].winrate)
                : this.scales.y(0.5)
            )
            .strength(this.toggleWinRate ? 1 : 0.02)
        )
        .force(
          "collision",
          d3.forceCollide().radius((d) => {
            return this.scales.r(d[this.section].totalpickrate) + 8;
          })
        )
        .on("tick", this.ticked);
      this.simulation.alpha(0.1).alphaDecay(0).restart();
    },
    DrawAxis() {
      if (this.toggleWinRate) {
        d3.select(".plot__axes__y")
          .transition()
          .duration(1000)
          .attr("opacity", 1)
          .call(
            d3
              .axisLeft(this.scales.y)
              .tickFormat((d) => `${d * 100} %`)
              .ticks(5)
          );
      } else {
        d3.select(".plot__axes__y")
          .transition()
          .duration(1000)
          .attr("opacity", 0);
      }

      d3.selectAll(".domain").remove();

      // d3.select(".plot__axes__x")
      //   .transition()
      //   .duration(500)
      //   .call(d3.axisTop(this.scales.x));
    },
  },
};
//  const t = d3.transition().duration(750);
//       svg.transition(t).attr('viewBox', [0, 0, width, height]);

//       // Update domain of y-Axis
//       y.domain(split ? years : ['All']);
//       y.range(split ? [splitHeight - margin.top - margin.bottom, 0] : [noSplitHeight - margin.top - margin.bottom, 0]);
//       yAxisContainer.call(yAxis, y, split ? years : ['All'])
//         .call(g => g.select('.domain').remove())
//         .call(g => g.selectAll('.tick line').remove());

//       // Update simulation
//       force.force('y', split ? d3.forceY(d => y(d.year) + y.bandwidth() / 2) : // If split by year align by year
//                                d3.forceY((noSplitHeight - margin.top - margin.bottom) / 2)); // If not split align to middle
//       //force.nodes(running);
//       force.alpha(1).restart();

//       // Update median line
//       medianLine.transition(t).attr('y2', split ? splitHeight - 20 : noSplitHeight);
</script>

<style lang="scss">
#Visualization {
  fill: red;
}
.btn {
  z-index: 1000;
}
.plot__axes__y {
  fill: white;
  color: white;

  &line {
    stroke: red;
  }

  &.path {
    stroke: red;
  }

  &text {
    fill: red;
  }
}
</style>

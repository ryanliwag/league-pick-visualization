<template>
  <svg id="visualization" :viewBox="viewBox">
    <g
      class="wrapper"
      :transform="`translate(${margin.left}, ${margin.top})`"
      opacity="0"
    >
      <g class="plot__axes">
        <!-- <g class="plot__axes__x"></g> -->
        <g class="plot__axes__y">
          <text x="100" y="50">Win Rate</text>
        </g>
      </g>
      <line
        :x1="innerWidth / 2"
        :y1="10"
        :x2="innerWidth / 2"
        :y2="innerHeight"
        style="stroke: gray; stroke-width: 2; opacity: 0.7"
      />
      <text
        :x="innerWidth / 2"
        y="0"
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
          :y="-innerHeight * 0.9"
          font-size="1.2rem"
          text-anchor="middle"
          style="fill: white"
        >
          Size of Bubble depends on total pick rate
        </text>

        <text x="100" font-size="1.2rem" text-anchor="start" style="fill: red">
          Red Pick Rate →
        </text>
        <text x="-100" font-size="1.2rem" text-anchor="end" style="fill: blue">
          ← Blue Pick Rate
        </text>
      </g>
      <g class="plot-area">
        <g
          v-if="toggleVisExplain"
          :transform="
            'translate(' + innerWidth / 2 + ',' + innerHeight / 2 + ')'
          "
        >
          <defs>
            <clipPath :id="'circle-sample'">
              <rect
                x="0"
                y="-300"
                :width="circularSegment(0.5) * 2 * 300"
                height="100rem"
              ></rect>
            </clipPath>
          </defs>
          <circle r="6rem" stroke="white" fill="blue" />
          <circle r="6rem" :clip-path="'url(#circle-sample)'" fill="red" />
          <text
            fill="white"
            alignment-baseline="central"
            text-anchor="middle"
            :font-size="scales.f(sampleNode[section].totalpickrate)"
            y="0"
          >
            {{ sampleNode.champion }}
          </text>
        </g>
        <g
          v-else
          class="plot__circles"
          v-for="node in nodes"
          :key="node.index"
          :transform="'translate(' + node.x + ',' + node.y + ')'"
        >
          <defs>
            <clipPath :id="'circle' + node.index">
              <rect
                :x="
                  scales.r(node[section].totalpickrate) -
                  1 *
                    scales.r(node[section].totalpickrate) *
                    2 *
                    circularSegment(node[section].red_weight)
                "
                :y="-scales.r(node[section].totalpickrate)"
                :width="
                  circularSegment(node[section].red_weight) *
                  2 *
                  scales.r(node[section].totalpickrate)
                "
                :height="scales.r(node[section].totalpickrate) * 2"
              ></rect>
            </clipPath>
          </defs>
          <circle
            :r="scales.r(node[section].totalpickrate)"
            stroke="white"
            fill="blue"
            v-if="node[section].totalpickrate > 0"
          />
          <circle
            :r="scales.r(node[section].totalpickrate)"
            :clip-path="'url(#circle' + node.index + ')'"
            fill="red"
            v-if="node[section].totalpickrate > 0"
          />
          <text
            fill="white"
            alignment-baseline="central"
            text-anchor="middle"
            :font-size="scales.f(node[section].totalpickrate)"
            v-if="node[section].totalpickrate > 0"
            :y="
              node[section].totalpickrate > 0.1
                ? 0
                : -(scales.r(node[section].totalpickrate) + 5)
            "
          >
            {{ node.champion }}
          </text>
          <text
            fill="white"
            alignment-baseline="central"
            text-anchor="middle"
            :font-size="scales.f(node[section].totalpickrate) - 5"
            v-if="(node[section].totalpickrate > 0.2) & toggleWinRate"
            y="20"
          >
            {{ Math.round(node[section].winrate * 100, 2) + "% WR" }}
          </text>
        </g>
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";

export default {
  props: [
    "initialNodes",
    "vis_step",
    "section",
    "toggleWinRate",
    "toggleVisExplain",
    "startVisualization",
  ],
  data() {
    return {
      nodes: this.initialNodes,
      margin: { top: 50, bottom: 50, left: 50, right: 50 },
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
      sampleNode: this.initialNodes.filter((v) => v.champion == "ZERI")[0],
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
    console.log(this.sampleNode[this.section]);
    // assign sample node
    // this.scales.x = d3
    //   .scaleLinear()
    //   .domain([0, 1])
    //   .range([this.margin.left, this.innerWidth]);
    // // y axis scale
    // this.scales.y = d3
    //   .scaleLinear()
    //   .domain([0, 1])
    //   .range([this.innerHeight, this.margin.top]);
    // this.simulation = d3
    //   .forceSimulation(this.nodes)
    //   .force("charge", d3.forceManyBody().strength(-0.01))
    //   .force(
    //     "x",
    //     d3.forceX((d) => this.scales.x(d[this.section].red_weight))
    //   )
    //   .force(
    //     "y",
    //     d3.forceY((d) =>
    //       this.toggleWinRate
    //         ? this.scales.y(d[this.section].winrate)
    //         : this.scales.y(0.5)
    //     )
    //   )
    //   .force(
    //     "collision",
    //     d3.forceCollide().radius((d) => {
    //       return this.scales.r(d[this.section].totalpickrate) + 5;
    //     })
    //   );
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
        d3.select(".wrapper").transition().duration(200).attr("opacity", 1);
      } else {
        d3.select(".wrapper").transition().duration(200).attr("opacity", 0);
      }
    },
    changeDescView() {
      if (this.toggleVisExplain) {
        d3.select(".description2")
          .transition()
          .duration(600)
          .attr(
            "transform",
            `translate(${this.innerWidth / 2}, ${this.innerHeight})`
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
    setScales() {
      this.scales.x = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.x_scale_margin, this.innerWidth - this.x_scale_margin]);

      // y axis scale
      this.scales.y = d3
        .scaleBand()
        .domain(["All"])
        .range([this.innerHeight, 0])
        .padding(1);
    },
    // changeData() {
    //   this.scales.y = d3
    //     .scaleLinear()
    //     .domain([1, 7])
    //     .range([
    //       this.margin.top + this.yAxisPadding,
    //       this.innerHeight - this.yAxisPadding,
    //     ]);
    //   d3.select(".plot__axes__y").call(d3.axisLeft(this.scales.y));

    //   // update simulation
    //   this.simulation.force(
    //     "y",
    //     d3.forceY((d) => Math.round(this.scales.y(d.pick_order_mean)))
    //   );
    //   this.simulation.alpha(1).alphaDecay(0.001).velocityDecay(0.3).restart();
    // },
    render() {
      // this.setScales();
      this.initChart();
      this.DrawAxis();
      // this.UpdateSimulationData();
      // this.UpdateSimulationData();
      // this.initSimulation();
    },
    initChart() {
      // this.simulation;
      this.scales.x = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.x_scale_margin, this.innerWidth - this.x_scale_margin]);

      this.scales.y = d3
        .scaleBand()
        .domain(["All"])
        .range([this.innerHeight, 0])
        .padding(1);

      this.UpdateSimulationData();
    },

    UpdateSimulationData() {
      console.log(this.toggleWinRate);
      this.simulation = d3
        .forceSimulation(this.nodes)
        .force("charge", d3.forceManyBody().strength(-0.1))
        .force(
          "x",
          d3
            .forceX()
            .x((d) => this.scales.x(d[this.section].red_weight))
            .strength(0.8)
        )
        .force(
          "y",
          d3
            .forceY()
            .y((d) =>
              this.toggleWinRate
                ? this.scales.y(d[this.section].winrate)
                : this.scales.y("All")
            )
            .strength(1)
        )
        .force(
          "collision",
          d3.forceCollide().radius((d) => {
            return this.scales.r(d[this.section].totalpickrate) + 8;
          })
        );

      // console.log("Update", this.section);
      // const nodes_to = d3.selectAll(".plot__circles");
      // nodes_to.exit().remove();
      // console.log(this.nodes, this.section);
      // this.simulation.stop()
      this.simulation.alpha(1).alphaDecay(0.05).velocityDecay(0.3).restart();
    },
    DrawAxis() {
      if (this.toggleWinRate) {
        this.scales.y = d3
          .scaleLinear()
          .domain([0, 1])
          .range([this.innerHeight, this.margin.top]);
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
        this.scales.y = d3
          .scaleBand()
          .domain(["All"])
          .range([this.innerHeight, this.margin.top])
          .padding(1);
        d3.select(".plot__axes__y")
          .transition()
          .duration(1000)
          .attr("opacity", 0);
      }

      d3.selectAll(".domain").remove();

      d3.select(".plot__axes__x")
        .transition()
        .duration(500)
        .call(d3.axisTop(this.scales.x));
    },
    circularSegment(frac) {
      // Calculate the Circular Segment from a fraction input.
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

<style>
#Visualization {
  fill: red;
}
.btn {
  z-index: 1000;
}
</style>

<template>
  <svg id="visualization" :viewBox="viewBox">
    <g class="wrapper" :transform="`translate(${margin.left}, ${margin.top})`">
      <g class="plot__axes">
        <g
          class="plot__axes__x"
          :transform="`translate(0, ${innerHeight / 2})`"
        ></g>
        <g class="plot__axes__y"></g>
      </g>
      <g
        class="plot__circles"
        v-for="node in nodes"
        :key="node.index"
        :transform="'translate(' + node.x + ',' + node.y + ')'"
      >
        <defs></defs>
        <circle
          :r="scales.r(node[section].totalpickrate)"
          stroke="white"
          fill="red"
          stroke-width="2"
        />
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";

export default {
  props: ["initialNodes", "vis_step", "section", "toggleWinRate"],
  data() {
    return {
      nodes: this.initialNodes,
      margin: { top: 10, bottom: 100, left: 50, right: 50 },
      width: 0,
      height: 0,
      scales: {
        x: null,
        y: null,
        r: d3.scaleLinear().domain([0, 1]).range([6, 40]),
        f: d3.scaleLinear().domain([0, 1]).range([7, 18]),
      },
      yAxisPadding: 100,
      simulation: null,
    };
  },
  mounted() {
    this.width = this.$parent.$refs.vizContainer.clientWidth;
    this.height = this.$parent.$refs.vizContainer.clientHeight;
    this.render();
  },
  created() {
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
    toggleWinRate: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (oldVal != newVal) {
          // this.UpdateAxis();
        }
      },
    },
    section: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (oldVal != newVal) {
          this.UpdateSimulationData();
        }
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
    setScales() {
      this.scales.x = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.margin.left, this.innerWidth]);

      // y axis scale
      this.scales.y = d3
        .scaleBand()
        .domain(["All"])
        .range([this.innerHeight, this.margin.top])
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
        .range([this.margin.left, this.innerWidth]);

      this.scales.y = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.innerHeight, this.margin.top]);

      this.UpdateSimulationData();
    },

    UpdateSimulationData() {
      this.simulation = d3
        .forceSimulation(this.nodes)
        .force("charge", d3.forceManyBody().strength(-0.01))
        .force(
          "x",
          d3.forceX().x((d) => this.scales.x(d[this.section].red_weight))
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
        )
        .force(
          "collision",
          d3.forceCollide().radius((d) => {
            return this.scales.r(d[this.section].totalpickrate) + 3;
          })
        );
      // console.log("Update", this.section);
      // const nodes_to = d3.selectAll(".plot__circles");
      // nodes_to.exit().remove();
      // console.log(this.nodes, this.section);
      this.simulation.alpha(1).alphaDecay(0.1).velocityDecay(0.3).restart();
    },
    DrawAxis() {
      d3.select(".plot__axes__y")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.scales.y));
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

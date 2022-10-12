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
        <defs>
          <clipPath :id="'circle' + node.index">
            <rect
              :x="
                scales.r(node.total_times) -
                1 *
                  scales.r(node.total_times) *
                  2 *
                  circularSegment(node.red_weight)
              "
              :y="-scales.r(node.total_times)"
              :width="
                circularSegment(node.red_weight) *
                2 *
                scales.r(node.total_times)
              "
              :height="scales.r(node.total_times) * 2"
              fill="#C33030"
            ></rect>
          </clipPath>
        </defs>
        <circle
          :r="scales.r(node.total_times)"
          stroke="white"
          fill="red"
          stroke-width="2"
        />
        <circle
          :r="scales.r(node.total_times)"
          :clip-path="'url(#circle' + node.index + ')'"
          fill="#442FDA"
        />
        <text
          fill="white"
          alignment-baseline="central"
          text-anchor="middle"
          :font-size="scales.f(node.total_times)"
          v-if="node.total_times > 5"
        >
          {{ node.champion }}
        </text>
        <!-- new URL("#clip", location) -->
      </g>
    </g>
  </svg>
</template>
<script>
import * as d3 from "d3";
//style="background-color:green"
export default {
  props: ["initialNodes", "vis_step"],
  data() {
    return {
      step: this.vis_step,
      nodes: this.initialNodes,
      margin: { top: 10, bottom: 10, left: 50, right: 50 },
      width: 0,
      height: 0,
      scales: {
        x: null,
        y: null,
        r: d3.scaleLinear().domain([0, 100]).range([10, 40]),
        f: d3.scaleLinear().domain([0, 100]).range([7, 18]),
      },
      yAxisPadding: 100,
      simulation: null,
    };
  },
  mounted() {
    console.log(this.$parent.$refs.vizContainer.clientWidth);
    this.width = this.$parent.$refs.vizContainer.clientWidth;
    this.height = this.$parent.$refs.vizContainer.clientHeight;

    this.render();
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(-0.01))
      .force(
        "x",
        d3.forceX().x((d) => this.scales.x(d.red_weight))
      )
      .force(
        "y",
        d3.forceY(() => this.scales.y("All"))
      )
      .force(
        "collision",
        d3.forceCollide().radius((d) => this.scales.r(d.total_times) + 2)
      )
      .alphaDecay(0.01)
      .velocityDecay(0.6);
  },
  created() {
    // simulation
  },
  watch: {
    vis_step: {
      handler(newStep, oldStep) {
        console.log(this.step, oldStep);
        if (newStep == 2) {
          this.changeData();
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
    changeData() {
      this.scales.y = d3
        .scaleLinear()
        .domain([1, 7])
        .range([
          this.margin.top + this.yAxisPadding,
          this.innerHeight - this.yAxisPadding,
        ]);
      d3.select(".plot__axes__y").call(d3.axisLeft(this.scales.y));

      // update simulation
      this.simulation.force(
        "y",
        d3.forceY((d) => Math.round(this.scales.y(d.pick_order_mean)))
      );
      this.simulation.alpha(1).alphaDecay(0.001).velocityDecay(0.3).restart();
    },
    setScales() {
      // x axis scale
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

      //   this.scales.r = d3.scaleLinear().domain([0, 100]).range([5, 30]);
      this.scales.f = d3.scaleLinear().domain([0, 100]).range([7, 18]);
    },
    renderAxes() {
      const { x, y } = this.scales;
      d3.select(".plot__axes__x")
        .call(d3.axisTop(x))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").remove());
      d3.select(".plot__axes__y").call(d3.axisLeft(y));
    },
    render() {
      this.setScales();
      this.renderAxes();
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
</script>

<style>
#Visualization {
  fill: red;
}
.btn {
  z-index: 1000;
}
</style>

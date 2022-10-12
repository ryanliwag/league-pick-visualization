<script>
// See this file to see how the IntersectionObserver is implemented
export default {
  name: "CircleNode",
  props: ["NodeVal", "r", "f", "toggleWinRate"],
  data: function () {
    return {
      data: [],
    };
  },
  components: {},
  mounted() {},
  created() {
    console.log(this.NodeVal);
  },
  computed: {
    buttonStyling() {
      return {
        Button: true,
        "is-selected": this.isSelected,
      };
    },
    circle_segment() {
      return this.calculate_circular_segment(this.NodeVal.red_weight);
    },
  },
  methods: {
    calculate_circular_segment(f) {
      let h = f;
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

<template>
  <defs>
    <clipPath :id="'circle' + NodeVal.index">
      <rect
        :x="r - 1 * r * 2 * circle_segment"
        :y="-r"
        :width="circle_segment * 2 * r"
        :height="r * 2"
      ></rect>
    </clipPath>
    <filter id="f1" x="0%" y="0%" :width="r * 2 + 2" :height="r * 2 + 2">
      <feOffset result="offOut" in="SourceGraphic" dx="1" dy="1" />
      <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
    </filter>
  </defs>
  <circle
    :r="r"
    style="stroke: gray; fill: gray; stroke-width: 1px"
    filter="url(#f1)"
    v-if="NodeVal.totalpickrate > 0"
  />
  <circle class="Node--circle left" :r="r" v-if="NodeVal.totalpickrate > 0" />
  <circle
    :r="r"
    class="Node--circle right"
    :clip-path="'url(#circle' + NodeVal.index + ')'"
    v-if="NodeVal.totalpickrate > 0"
  />
  <text
    class="Node--circle text"
    alignment-baseline="central"
    text-anchor="middle"
    :font-size="f"
    v-if="NodeVal.totalpickrate > 0"
    :y="NodeVal.totalpickrate < 0.1 ? -15 : 0"
  >
    {{ NodeVal.index.toUpperCase() }}
  </text>
  <text
    class="Node--circle text"
    alignment-baseline="central"
    text-anchor="middle"
    :font-size="f - 5"
    v-if="(NodeVal.totalpickrate > 0.2) & toggleWinRate"
    y="10"
  >
    {{ Math.round(NodeVal.winrate * 100, 2) + "% WR" }}
  </text>
  <text
    class="Node--circle text"
    alignment-baseline="central"
    text-anchor="middle"
    :font-size="f - 5"
    v-if="NodeVal.totalpickrate > 0.2"
    :y="20"
  >
    {{ NodeVal.blue_picks + "-" + NodeVal.red_picks }}
  </text>
</template>

<style lang="scss" scoped>
.Node--circle {
  &.left {
    fill: #5496d0;
  }
  &.right {
    fill: #f51641;
  }

  &.text {
    fill: whitesmoke;
  }
}
</style>

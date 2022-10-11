<script>
// See this file to see how the IntersectionObserver is implemented
import CircleNode from "./CircleNode.vue";
import * as d3 from "d3";
import {
  annotation,
  annotationCalloutCircle,
  annotationCallout,
  annotationXYThreshold,
  annotationCustomType,
} from "d3-svg-annotation";

export default {
  name: "IntroVis",
  props: ["NodeVal", "scaler"],
  data: function () {
    return {
      data: [],
    };
  },
  components: { CircleNode },
  mounted() {
    console.log(this.scaler.x(0.5), this.NodeVal);
    d3.select("#intro-visualization").call(this.annotationGen);
    //   .append("g")
  },
  created() {},
  computed: {
    customAnnotation() {
      return annotationCustomType(annotationXYThreshold, {
        note: {
          lineType: "none",
          orientation: "top",
          align: "middle",
        },
      });
    },
    annotations() {
      return [
        {
          note: {
            label:
              "Size of circle is dependent upon total number of picks and bans the champion has had throughout the split.",
          },
          data: {
            sx: 0.5,
            sy: this.NodeVal.winrate,
          },
          type: annotationCalloutCircle,
          color: "whitesmoke",
          dy: -100,
          dx: -50,
          subject: { radius: 30 },
        },
        {
          note: {
            label: "Red Pick Rate",
          },
          data: {
            sx: 0.5,
            sy: this.NodeVal.winrate,
          },
          type: annotationCallout,
          color: "#f51641",
          x: 30,
          dy: 0,
          dx: 50,
          connector: { start: "arrow" },
        },
        {
          note: {
            label: "Blue Pick Rate",
          },
          data: {
            sx: 0.5,
            sy: this.NodeVal.winrate,
          },
          color: "#5496d0",
          type: annotationCallout,
          x: -30,
          dy: 0,
          dx: -50,
        },
                {
          note: {
            label:
              "Number of times champion has been picked at each side",
          },
          data: {
            sx: 0.5,
            sy: this.NodeVal.winrate,
          },
          type: annotationCallout,
          y:20,
          color: "whitesmoke",
          dy: 100,
          dx: 50,
          connector:{end:"arrow"},
          subject: { radius: 30 },
        },
        // {
        //   note: { label: "50% Pick Rate at Each Side" },
        //   subject: {
        //     y1: -200,
        //     y2: 200,
        //   },
        //   y: 0,
        //   type: this.customAnnotation,
        //   data: { x: "8/15/1998" },
        // },
      ];
    },
    annotationGen() {
      return annotation().annotations(this.annotations);
    },
  },
  methods: {},
};
</script>

<template>
  <g
    :transform="'translate(' + scaler.x(0.5) + ',' + scaler.y(0.5) + ')'"
    id="intro-visualization"
  >
    <CircleNode :NodeVal="NodeVal" r="30" f="14" toggleWinRate="true" /> </g
  ><!-- <text>gg</text> -->
</template>

<style lang="scss" scoped>
.annotation-note-label {
  .tspan {
    fill: red;
  }
}

.annotation text {
  fill: red;
}
.annotation-note-title {
  font-weight: bold;
}

.annotation path {
  stroke: red;
}
</style>

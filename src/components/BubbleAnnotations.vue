<script>
// See this file to see how the IntersectionObserver is implemented
import * as d3 from "d3";
import {
  annotation,
  annotationXYThreshold,
  annotationCustomType,
} from "d3-svg-annotation";

export default {
  name: "BubbleAnnotations",
  props: ["scaler", "toggleWinRate"],
  data: function () {
    return {
      data: [],
    };
  },
  watch: {
    toggleWinRate: {
      handler(newVal, _) {
        console.log(newVal, _);
        if (newVal) {
          d3.select("#bubble-annotations")
            .transition()
            .duration(500)
            .opacity(0);
        } else {
          d3.select("#bubble-annotations")
            .transition()
            .duration(500)
            .opacity(1);
        }
      },
    },
  },
  mounted() {
    console.log(this.scales);
    d3.select("#bubble-annotations").call(this.annotationGen);
    //   .append("g")
  },
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
          note: { label: "50% Pick Rate at Each Side" },
          subject: {
            y1: -50,
            y2: 1000,
          },
          y: -50,
          x: this.scaler.x(0.5),
          type: this.customAnnotation,
          color: "white",
          data: { x: "8/15/1998" },
        },
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
  <g id="bubble-annotations"> </g>
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

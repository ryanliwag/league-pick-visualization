<script>
// import BubbleChart from "./components/BubbleChart.vue";
// import Visualization from "./components/Visualization.vue";
import LolData from "./data/lol_dataset_v2.json";
import { ref } from "vue";

// See this file to see how the IntersectionObserver is implemented
import { onIntersect } from "./composables/onIntersect";
import Visualization from './components/Visualization2';
const observer_1 = ref({});
const observer_2 = ref({})
export default {
  name: "App",
  data: function () {
    return {
      data: [],
      isVisible: false,
      loading: true,
      show: false,
      vis_step: 1,
      regionVis: "lpl",
      toggleWinRate: true,
      visible: false,
      section: 0,
    };
  },
  components: {
    Visualization,
    // BubbleChart,
    // Visualization,
  },
  mounted() {
    console.log(LolData);
    observer_1.value = onIntersect(
      document.querySelector("#section-1"),
      this.onEnter_lck,
      this.onExit
    );
    observer_2.value = onIntersect(
      document.querySelector("#section-2"),
      this.onEnter_lpl,
      this.onExit,
    )
  },

  created() {
    this.loadData();
    console.log(this.data)
  },
  methods: {
    loadData() {
      this.loading = false;
      this.data = LolData;
    },
    onEnter_lpl() {
      console.log("I see you");
      this.regionVis = 'lpl'
      this.toggleWinRate = true
    },
    onEnter_lck() {
      this.regionVis ='lck'
      this.toggleWinRate = false
    },
    onExit() {
      console.log("Bye");
    },
  },
};
</script>

<template>
  <div class="app-container">
    <div class="container">
      <div class="section-container" id="section-1">hello</div>
      <div class="section-container" id="section-2">hello2</div>
    </div>
    <div class="visual-container" ref="vizContainer">
      <template v-if="loading">loading</template>
      <template v-else>data loaded</template>
      {{regionVis}}
      <Visualization :initialNodes="data" :section='regionVis' :toggleWinRate='toggleWinRate'/>
    </div>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed");
@import url("https://fonts.googleapis.com/css?family=Oswald");
@import url("https://fonts.googleapis.com/css?family=EB+Garamond");

html,
body {
  margin: 0;

  background: linear-gradient(
    179.08deg,
    #282832 0.79%,
    #2e3856 38.95%,
    #3d3c5e 70.92%,
    #463152 99.79%
  );
}

body h1 {
  color: white;
  font-size: 2rem;
  font-family: "Owsald", sans-serif;
}

body p {
  color: white;
  font-size: 14px;
  font-family: "EB Garamond", sans-serif;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.container {
  margin: 10rem 0;
  width: 80vw;
  max-width: 90vw;
  min-height: 375px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;

  // display: grid;
  // grid-template-columns: 300px;
  // grid-template-rows: 100%;
  // gap: 10px;
  // padding: 10px;
}

.section-container {
  border: #282832;
  z-index: 1;
  height: 60vh;
  width: 100%;
  margin-bottom: 5rem;
}

.description-container {
  z-index: -999;
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-start;
  // align-items: flex-start;
  // width: 300px;
  // z-index: 1;
}

.visual-container {
  position: fixed;
  /* width: 60%;
  height: 50%; */
  // margin-left: 10rem;
  // left: 310px;
  // top: 25%;
  // /* margin: 0 1rem;
  width: 80vw;
  height: 60vh;
  left: 10%;
  top: 25%;
  // background-color: yellow;
}

.description-space {
  &.first {
    height: 60vh;
  }
  &.sec {
    height: 80vh;
  }
}

.Grid {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
}
</style>

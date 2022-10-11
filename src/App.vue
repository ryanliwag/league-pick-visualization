<script>
// import BubbleChart from "./components/BubbleChart.vue";
// import Visualization from "./components/Visualization.vue";
import LolData from "./data/lol_dataset_v2.json";
import { ref } from "vue";
import Button from "./components/button.vue";
// See this file to see how the IntersectionObserver is implemented
import { onIntersect } from "./composables/onIntersect";
import Visualization from "./components/Visualization2";
const observer_1 = ref({});
const observer_2 = ref({});
const observer_noVis = ref({});
const observer_intro = ref({});
export default {
  name: "App",
  data: function () {
    return {
      data: [],
      loading: true,
      toggleWinRate: false,
      toggleVisExplain: false,
      startVisualization: false,
      regions: [
        { region: "lcs", selected: true },
        { region: "lpl", selected: false },
        { region: "lck", selected: false },
        { region: "lec", selected: false },
      ],
    };
  },
  components: {
    Visualization,
    Button,
    // BubbleChart,
    // Visualization,
  },
  mounted() {
    observer_noVis.value = onIntersect(
      document.querySelector("#noVis"),
      this.onEnter_noVis,
      this.onExit_noVis
    );
    observer_intro.value = onIntersect(
      document.querySelector("#introVis"),
      this.onEnter_intro,
      this.onExit
    );
    observer_1.value = onIntersect(
      document.querySelector("#section-1"),
      this.onEnter_Visualization,
      this.onExit
    );
    observer_2.value = onIntersect(
      document.querySelector("#section-2"),
      this.onEnter_toggle_winrate,
      this.onExit
    );
  },

  created() {
    this.loadData();
    console.log(this.data);
  },
  computed: {},
  methods: {
    changeRegion(region) {
      console.log("region CHanged", region);
      this.regions = this.regions.map((v) => {
        if (v.region == region) {
          return { ...v, selected: true };
        } else {
          return { ...v, selected: false };
        }
      });
    },
    loadData() {
      this.loading = false;
      this.data = LolData;
    },
    onEnter_noVis() {
      this.startVisualization = false;
    },
    onExit_noVis() {
      this.startVisualization = true;
      this.toggleVisExplain = true;
    },
    onEnter_intro() {
      this.toggleVisExplain = true;
      this.startVisualization = true;
    },
    onEnter_Visualization() {
      this.toggleWinRate = false;
      this.startVisualization = true;
      this.toggleVisExplain = false;
    },
    onEnter_toggle_winrate() {
      console.log("I see you");
      this.toggleWinRate = true;
      this.startVisualization = true;
      this.toggleVisExplain = false;
    },
    onExit() {},
  },
};
</script>

<template>
  <div class="app-container">
    <div class="container">
      <div class="intro-container" id="noVis">
        <h1>Visualizing League Champions in Pro Play</h1>
        <div class="contact">
          <p>Visualization built by: Ryan Liwag</p>
          <p>Contact: rjhontomin@gmail.com</p>
        </div>
      </div>
      <div class="section-container intro">
        <h2>How the Visualization Works</h2>
        <p>
          Visualization combines data from 4 major regions of LPL, LCK, LCS and
          LEC. All data is consitstent with the same 19.32-19.67 patch.
        </p>
        <p>
          Each champion is represented as a bubble, and size is determined by
          number of time champions has been picked or banned in througout the
          season. Red and Blue color shows percentage share of either red or
          blue side pick rate of the champion.
        </p>
      </div>
      <div class="description-space" id="introVis" />
      <div class="section-container">
        <h2>Red vs Blue</h2>
        <p>
          Each champion is represented as a bubble, and size is determined by
          number of time champions has been picked or banned in througout the
          season. Red and Blue color shows percentage share of either red or
          blue side pick rate of the champion.
        </p>

        <Button
          v-for="region in regions"
          :key="region.region"
          :isSelected="region.selected"
          @changeRegion="changeRegion(region.region)"
          >{{ region.region.toUpperCase() }}</Button
        >
      </div>
      <div class="description-space" id="section-1" />
      <div class="section-container">
        <h2>What about Win rate?</h2>
        <p>
          Each champion is represented as a bubble, and size is determined by
          number of time champions has been picked or banned in througout the
          season. Red and Blue color shows percentage share of either red or
          blue side pick rate of the champion.
        </p>
      </div>
      <div class="description-space" id="section-2" />
    </div>
    <template v-if="loading">loading</template>
    <template v-else>
      <div class="visual-container" ref="vizContainer">
        <Visualization
          :initialNodes="data"
          :section="regions.filter((v) => v.selected == true)[0].region"
          :toggleVisExplain="toggleVisExplain"
          :toggleWinRate="toggleWinRate"
          :startVisualization="startVisualization"
        />
      </div>
    </template>
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
  // background: #e4eae1;
  font-family: "Owsald", sans-serif;
}

body h1 {
  color: white;
  font-size: 2.5rem;
  font-family: "Owsald", sans-serif;
}

h2 {
  color: white;
    font-size: 2rem;
}

body p {
  color: white;
  font-size: 1rem;
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
  width: 80vw;
  max-width: 90vw;
  min-height: 375px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.section-container {
  border: #8c8c8c;
  z-index: 1;
  max-width: 600px;
  margin: 0 1rem;
  background-color: #eeeeee;
  padding: 1rem;

  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.5);
  opacity: 1;

  h2 {
    color:black;
  }
  p {
    color:black
  }
}

.intro-container {
  max-width: 600px;
  margin: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .contact {
    line-height: 10px;
  }
}

.description-container {
  z-index: 1;
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
  width: 1200px;
  height: 90vh;

  top: 10%;
  z-index: 0;
  // background-
}

.description-space {
  height: 60vh;
  min-height: 600px;
  width: 100%;
  margin: 10vh 0;
}

// @media (min-width: 768px) {

// }

// .description-space {
//   &.first {
//     height: 60vh;
//   }
//   &.sec {
//     height: 80vh;
//   }
// }

.Grid {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
}
</style>

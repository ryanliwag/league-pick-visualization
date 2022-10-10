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
const observer_intro = ref({});
const observer_noVis = ref({});
export default {
  name: "App",
  data: function () {
    return {
      data: [],
      isVisible: false,
      loading: true,
      show: false,
      vis_step: 1,
      regionVis: "LPL",
      toggleWinRate: false,
      toggleVisExplain: true,
      startVisualization: false,
      visible: false,
      section: 0,
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
      document.querySelector("#section-intro"),
      this.onEnter_intro,
      this.onExit
    );
    observer_1.value = onIntersect(
      document.querySelector("#section-1"),
      this.onEnter_lck,
      this.onExit
    );
    observer_2.value = onIntersect(
      document.querySelector("#section-2"),
      this.onEnter_lpl,
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
    onEnter_intro() {
      this.startVisualization = true;
      this.toggleVisExplain = true;
    },
    onEnter_noVis() {
      this.startVisualization = false;
    },
    onEnter_lpl() {
      console.log("I see you");
      this.toggleWinRate = true;
      this.toggleVisExplain = false;
    },
    onEnter_lck() {
      this.toggleWinRate = false;
      this.toggleVisExplain = false;
    },
    onExit_intro() {
      this.startVisualization = false;
    },
    onExit_noVis() {
      // this.to = false;
      // this.startVisualization = true;
      console.log("Bye");
    },
    onExit() {},
  },
};
</script>

<template>
  <div class="app-container">
    <div class="container">
      <div class="intro-container" id="noVis">
        <h1>Visualizing Champions in Pro Play</h1>
        <p>
          Visualization combines data from 4 major regions of LPL, LCK, LCS and
          LEC. All data is consitstent with the same 19.32-19.67 patch.
        </p>
        <p>
          Historically Blue side has had advantage not just in proplay but also
          in soloq games. Currently as of patch 12.11, blue side has a 4%
          winrate advantage over red.
        </p>
        <p>
          League's map is not symmetrical, it may offer certain champions better
          chances in lane simply through side selection. Blue side gets more
          dragons and heralds, but red side gets more dragons but this is also
          dependent on the impact of early game. Dragon stacking and early game
          gold advantage of herald has given the blue side enough of an
          advantage that red wouldnt even be able to contest or take baron.
          Dragon and Heralds have the added bonus of giving the blue team a
          better chance to win.
        </p>
        <p>
          Blue side just sees more in their screen, as the camera angle is not
          rectangular in league. You have a trapezoidal view where you see more
          on the top part of your screen compared to the bottom. ALthough in
          proplay, this may be less of a contributing factor. blue side is
          definitely better. Just think about trying to fight your way down the
          blue side top and realize that hitboxes start at the feet. This means
          the character models you are facing are in fact further away then they
          appear and your model is closer to them then it appears. for certain
          skill shots that have a tendency to latch on even if its at the very
          edge its a major advantage. coming down also means you will be more
          impeded by the hud. i have accidently hit my mini map trying to ult
          south bound with lux meaning it just randomly fires in whatever
          direction. this is simply not an issue with blue side at all. also the
          blind spot provided by standing behind your tower is more advantageous
          to blue side as its closer to the jungle entrance meaning its quicker
          to reach and to leave it for better roaming.
        </p>
      </div>
      <div class="section-container intro" id="section-intro">
        <h2>How the Visualization Works</h2>
        <p>
          Each champion is represented as a bubble, and size is determined by
          number of time champions has been picked or banned in througout the
          season. Red and Blue color shows percentage share of either red or
          blue side pick rate of the champion.
        </p>
      </div>
      <div class="description-space" />
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
        <!-- <div>
          <Button v-for=> </Button>
          <Button isSelected="true" @changeRegion="changeRegion('LCS')" region='lcs'>LCS</Button>
<Button isSelected="true" @changeRegion="changeRegion('LCS')" region='lcs'>LCS</Button>
<Button isSelected="true" @changeRegion="changeRegion('LCS')" region='lcs'>LCS</Button>

        </div> -->
      </div>
      <div class="description-space" id="section-1" />
      <div class="section-container">
        <h2>Win rate?</h2>
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

  // background: linear-gradient(
  //   179.08deg,
  //   #282832 0.79%,
  //   #2e3856 38.95%,
  //   #3d3c5e 70.92%,
  //   #463152 99.79%
  // );
  background: #e4eae1;
  font-family: "Owsald", sans-serif;
}

body h1 {
  color: black;
  font-size: 2.5rem;
  font-family: "Owsald", sans-serif;
}

h2 {
  color: black;
  font-size: 2rem;
}

body p {
  color: black;
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

  // display: grid;
  // grid-template-columns: 300px;
  // grid-template-rows: 100%;
  // gap: 10px;
  // padding: 10px;
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
}

.intro-container {
  max-width: 600px;
  margin: 0 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

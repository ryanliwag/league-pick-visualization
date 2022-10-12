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
      console.log("region Changed", region);
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
      this.toggleVisExplain = true;
    },
    onExit_noVis() {
      this.startVisualization = true;
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
        <h1>Visualizing League of Legends Champions in Pro Play</h1>
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
          Each Region seems to have different priorities in red and blue picks.
          LEC has a high ban rate for yuumi, compared to the rest of the
          regions. Likewise Eastern regions have less priority over picks like
          azir compared to western regions with higher blue pick rate.
        </p>
      </div>
      <div class="description-space" id="section-1" />
      <div class="section-container">
        <h2>What about Win rate?</h2>
        <p>
          Traditionally blue side has a higher winrate compared to red side.
          Factors that can affect this are camera position, non-symmetrical map
          and meta. Blue side winrate is tied when meta's shift to have more OP
          champions, that red side is unable counterpick or ban out.
        </p>
      </div>
      <div class="description-space" id="section-2" />
    </div>
    <template v-if="loading">loading</template>
    <template v-else>
      <div class="visual-container">
        <div class="svg-container" ref="vizContainer">
          <Transition name="slide-fade">
            <div v-if="startVisualization" class="league-switch">
              <p>Select Region:</p>
              <Button
                v-for="region in regions"
                :key="region.region"
                :isSelected="region.selected"
                @changeRegion="changeRegion(region.region)"
                >{{ region.region.toUpperCase() }}</Button
              >
            </div>
          </Transition>

          <Visualization
            :initialNodes="data"
            :section="regions.filter((v) => v.selected == true)[0].region"
            :toggleVisExplain="toggleVisExplain"
            :toggleWinRate="toggleWinRate"
            :startVisualization="startVisualization"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto+Condensed");
@import url("https://fonts.googleapis.com/css?family=Oswald");
@import url("https://fonts.googleapis.com/css?family=EB+Garamond");

@mixin respond-to($breakpoint) {
  @if $breakpoint == "small" {
    @media (min-width: 300px) {
      @content;
    }
  } @else if $breakpoint == "large" {
    @media (min-width: 1200px) {
      @content;
    }
  }
}

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

  background: rgb(
    204,
    204,
    204
  ); /* Fallback for older browsers without RGBA-support */
  background: rgba(204, 204, 204, 0.7);
  h2 {
    color: black;
  }
  p {
    color: black;
  }
  &.intro {
    height: 100%;
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
}

@include respond-to(small) {
  .visual-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: flex-end;
    align-items: center;
    top: 0;
    .league-switch {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;
    }
    .svg-container {
      width: 95%;
      height: 90vh;
    }
  }
}
@include respond-to(large) {
  .visual-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    top: 0;

    .league-switch {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-content: center;
      align-items: center;
    }
    .svg-container {
      width: 800px;
      height: 80vh;
    }

    // background-
  }
}

.description-space {
  height: 80vh;
  min-height: 800px;
  width: 100%;
  margin: 10vh 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

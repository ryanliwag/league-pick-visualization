<template>
  <div class="app-container">
    <div class="container">
      <div class="description-container">
        <h1>Red and Blue</h1>
        <button @click="changeData2">Change Data 2</button>
        <button @click="changeData1">Change Data 1</button>
        <p>
          Whereas recognition of the inherent digthis is EB GaramondLorem ipsum
          dolor sit amet, consectetur adipiscing elit. Etiam congue ex nulla,
          sed tristique orci cursus nec. Nam commodo, lacus et pharetra pretium,
          orci ex tempus ligula, nec placerat metus ipsum in velit. Nullam
          ultrices est non odio laoreet sagittis. Aliquam auctor rutrum purus ac
          vulputate. Praesent porttitor consectetur ultrices. Sed a vehicula
          metus. Integer lacinia tellus vel condimentum tempus. Donec ultricies
          in nibh et tristique. Vivamus ornare eu nisl at facilisis. Nam
          scelerisque lorem in augue pharetra condimentum. Praesent imperdiet
          scelerisque ante, at dignissim nibh tincidunt vel. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas.
        </p>
        <p>
          Quisque tempor in libero semper finibus. Proin sed semper est.
          Phasellus eu purus vitae purus vulputate pharetra. Nunc feugiat, ante
          non placerat molestie, eros velit facilisis tellus, vel finibus ipsum
          sem a nisl. Duis ornare nisl vitae efficitur venenatis. Cras libero
          ante, scelerisque semper laoreet a, consequat a urna. Aliquam ac magna
          diam.
        </p>
        <div class="description-space first"></div>
        <h1>What about Bans?</h1>
        <p>
          Whereas recognition of the inherent digthis is EB GaramondLorem ipsum
          dolor sit amet, consectetur adipiscing elit. Etiam congue ex nulla,
          sed tristique orci cursus nec. Nam commodo, lacus et pharetra pretium,
          orci ex tempus ligula, nec placerat metus ipsum in velit. Nullam
          ultrices est non odio laoreet sagittis. Aliquam auctor rutrum purus ac
          vulputate. Praesent porttitor consectetur ultrices. Sed a vehicula
          metus. Integer lacinia tellus vel condimentum tempus. Donec ultricies
          in nibh et tristique. Vivamus ornare eu nisl at facilisis. Nam
          scelerisque lorem in augue pharetra condimentum. Praesent imperdiet
          scelerisque ante, at dignissim nibh tincidunt vel. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas.
        </p>
        <p>
          Quisque tempor in libero semper finibus. Proin sed semper est.
          Phasellus eu purus vitae purus vulputate pharetra. Nunc feugiat, ante
          non placerat molestie, eros velit facilisis tellus, vel finibus ipsum
          sem a nisl. Duis ornare nisl vitae efficitur venenatis. Cras libero
          ante, scelerisque semper laoreet a, consequat a urna. Aliquam ac magna
          diam.
        </p>
        <div class="description-space sec"></div>
      </div>
      <div class="visual-container" ref="vizContainer">
        <Visualization :initialNodes="data_t" :vis_step="vis_step"/>
      </div>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// import BubbleChart from "./components/BubbleChart.vue";
import Visualization from "./components/Visualization.vue"
import Data from "./lol_pb_data.json";
export default {
  name: "App",
  data: function () {
    return {
      data_t: [],
      vis_step: 1,
    };
  },
  components: {
    // BubbleChart,
    Visualization
  },
  mounted() {
    console.log(Data);
  },
  created() {
    this.data_t = Data;
  },
  methods: {
    changeData2(){ 
      console.log(this.vis_step)
      this.vis_step = 2
    },
    changeData1() {
      this.vis_step = 1
    }
  }
};
</script>

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
  margin: 2rem 0;
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
  width: 80vw ;
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

<script>
// See this file to see how the IntersectionObserver is implemented
export default {
  name: "Button",
  props: ["isSelected", "title", "region"],
  data: function () {
    return {
      data: [],
    };
  },
  components: {},
  mounted() {},

  created() {},
  computed: {
    buttonStyling() {
      return {
        Button: true,
        "is-selected": this.isSelected,
      };
    },
  },
  methods: {},
};
</script>

<template>
  <div>
    <button @click="$emit('changeRegion')" :class="buttonStyling">
      <slot></slot>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.Button {
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  background: none;
  border: 0px solid whitesmoke;
  color: white;
  font-weight: 600;
  cursor: pointer;
  width: 60 px;
  margin: 0 0.3rem;

  &:hover {
    color: whitesmoke;
  }

  &.is-selected {
    background: white;
    color: black;
  }
}
</style>

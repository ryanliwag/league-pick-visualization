<script>
// See this file to see how the IntersectionObserver is implemented
export default {
  name: "Button",
  props: ["isSelected", "title", 'region'],
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
    <button @click="$emit('changeRegion')" :class="buttonStyling"><slot></slot></button>
  </div>
</template>

<style lang="scss" scoped>
.Button {
  border-radius: 4px;
  font-weight: bold;
  padding: 1rem;
  font-size: 1rem;  background: none;
  border: 1px solid #1f1f1f;
  color: white;
  font-weight: 600;
  cursor: pointer;
  width: 100px;

  &:hover {
    color: red;
  }

  &.is-selected {
    background: yellow;
  }
}
</style>

<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.root-filters
  degree = 30deg
  user-select none
  block-no-bg()
  display flex
  flex-wrap wrap
  align-items center
  @media ({mobile})
    flex-direction column
    align-items flex-start
  gap 20px
  position relative
  width 100%
  color textColor2
  input[type=checkbox]
    position absolute
    z-index -1
    opacity 0
    cursor pointer
  input[type=checkbox] + label
    display flex
    transition all 0.15s ease
    cursor pointer
  input[type=checkbox] + label::before
    content ""
    width 1em
    height 1em
    border 1px solid textColor5
    margin-right 0.5em
    background colorShadow
    background-size 300% 100%
    background-position-x 0
    opacity 1
    transform skewX(degree)
    transition all 0.15s ease
  input[type=checkbox] + label:hover::before
    box-shadow 5px 5px 10px colorShadowDark
    border-color textColor3
  input[type=checkbox]:checked
    display none
    + label::before
      box-shadow 4px 4px 10px colorShadowDark
      background-position-x -50%
      width 3em
      background empColor1_1
    + label
      color textColor1
      font-weight bold
  input[type=checkbox][disabled]
    + label::before
      filter saturate(0.4)
      border-color textColor5
    + label
      pointer-events none

.root-filters
  .root-filters
    padding 0
</style>

<template>
  <div class="root-filters">
    <div class="checkbox-group" v-for="(filter, idx) in filters">
      <input :id="'__' + filter.name + idx" :disabled="disabled" type="checkbox" @change="onChange(filter, idx)" v-model="filter.value">
      <label :for="'__' + filter.name + idx">{{ filter.name }}</label>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  emits: ['change'],

  props: {
    filters: {
      type: Array,
      required: true,
    },
    canBeNone: Boolean,
    radio: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    storingName: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
    }
  },

  mounted() {
    let hasNotFalseFilter = false;
    this.filters.forEach((filter) => {
      if (filter.value === undefined) {
        filter.value = false;
      }
      if (filter.value) {
        hasNotFalseFilter = true;
      }
    });

    if (this.storingName !== undefined) {
      if (this.$store.state.__filters === undefined) {
        this.$store.state.__filters = {}
      }
      const storedState = this.$store.state.__filters[this.storingName];
      if (storedState !== undefined) {
        this.filters.forEach((filter, i) => {
          this.filters[i] = storedState[i];
          if (this.filters[i].value === true) {
            this.onChange(this.filters[i], i);
          }
        });
      }
      this.$store.state.__filters[this.storingName] = this.filters;
    }

    if (!this.canBeNone && !hasNotFalseFilter) { // if filter can't be none => select first filter
      this.filters[0].value = true;
    }
  },

  methods: {
    onChange(filter, idx) {
      console.log(filter, idx)
      if (!this.canBeNone && !this.filters.reduce((sum, filter) => sum || filter.value, false)) { // can't disable only 1 filter
        filter.value = true;
        return;
      }

      if (this.radio) {
        // Drop all other filters
        this.filters.forEach((filt) => {
          if (filt !== filter)
            filt.value = false;
        });
      }

      this.$emit('change', filter);
    }
  }
};
</script>

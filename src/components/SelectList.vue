<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/forms.styl'
@require '../styles/utils.styl'
@require '../styles/fonts.styl'

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)
input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat

error-color = colorNo

height = 50px
item-height = 40px
max-list-height = 200px

field()
  font-medium()
  display flex
  align-items center
  padding 0 20px
  cursor pointer
  transition all 0.2s ease


.select-root
  position relative
  height height
  padding 0
  margin 0
  user-select none

  .title
    position absolute
    transition all 0.2s ease
    pointer-events none
    top -10px
    left 4px
    font-size 14px

  &[readonly]
    pointer-events none
    user-select text
    .title
      color textColor5
    .selected-item
      border none
      padding-left 10px
      img
        display none
  &[disabled]
    pointer-events none
    user-select text
    opacity 0.6
    .title
      color textColor5
    .selected-item
      img
        display none

  .selected-item
    field()
    justify-content space-between
    height height
    width 100%
    border 1px solid borderColor
    border-radius 5px
    color textColor1
    &:hover
      backdrop-filter brightness(3)
    img
      width 30px
      transform rotate(90deg)
      transition transform 0.3s ease

  &.unrolled
    .title
      top -16px
    .selected-item
      border-color empColor1_1
      background mix(blocksBgColor, white, 90%)
      border-radius 5px 5px 0 0
    img
      transform rotate(-90deg)

  &:not(.unrolled)
    .list
      max-height 0
      opacity 0

  &.solid
    .list
      background bgColorLight

  .list
    position absolute
    top height
    width 100%
    z-index 9999
    backdrop-filter blur(10px)
    max-height max-list-height
    overflow-y auto

    list-style none
    padding 0
    margin 0
    border-radius 0 0 5px 5px
    border solid 1px empColor1_1
    border-top none
    transition all 0.2s ease

    .item
      field()
      color textColor3
      height item-height
      &.selected
        color textColor1
        background mix(blocksBgColor, white, 92%)
        letter-spacing 1px
      &:hover
        background mix(blocksBgColor, white, 90%)
        color textColor1
      &:not(:first-child)
        border-top 1px solid borderColor
</style>

<template>
  <div class="select-root" :class="{unrolled, solid}" :readonly="readonly">
    <span class="error-text">{{ error }}</span>
    <div class="selected-item" @click="unrolled = !unrolled">
      {{ list[selectedIdx]?.name }}
      <img src="../res/arrow_corner_right.svg" alt="arrow">
    </div>
    <ul class="list scrollable">
      <li v-for="(item, idx) in list" class="item" :class="{selected: idx === selectedIdx}" @click.stop="selectItem(idx)">{{ item.name }}</li>
    </ul>
    <span class="title">{{ title }}</span>
  </div>
</template>

<script>
import FloatingInput from "./FloatingInput.vue";

export default {
  components: {FloatingInput},
  emits: ['input', 'update:modelValue'],

  props: {
    title: String,
    list: Array,
    selectedIdx: {
      type: Number,
      default: undefined,
    },
    selectedId: {
      type: Number,
      default: undefined,
    },
    solid: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    opened: Boolean,

    modelValue: null,
    error: String,
  },

  data() {
    return {
      States: {
        default: 0,
        success: 1,
        error: 2,
      },
      state: 0,

      error: this.$props.error,

      selectedIdx: undefined,
      unrolled: this.$props.opened,
    }
  },

  mounted() {
    if (this.$props.selectedIdx !== undefined)
      this.selectedIdx = this.$props.selectedIdx;
    this.selectedIdx = this.list.findIndex(item => item.id === this.$props.selectedId);
    if (this.selectedIdx === -1) {
      this.selectedIdx = undefined;
      return;
    }

    this.selectItem(this.selectedIdx);
  },

  methods: {
    focus() {
      this.unrolled = true;
    },

    selectItem(idx) {
      this.state = this.States.default;
      this.selectedIdx = idx;
      this.$emit('input', idx, this.list[idx]);

      this.$emit('update:modelValue', this.list[idx]);
      this.unrolled = false;
    }
  },

  watch: {
    list(to, from) {
      if (this.selectedId && this.selectedIdx === undefined) {
        this.selectedIdx = this.list.findIndex(item => item.id === this.$props.selectedId);
        if (this.selectedIdx === -1) {
          this.selectedIdx = undefined;
          return;
        }
      }

      this.selectItem(this.selectedIdx);
    }
  }
};
</script>

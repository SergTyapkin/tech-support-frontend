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
bg-color = bgColorLight
bg-color-hover = mix(bg-color, white, 90%)
bg-color-selected = mix(bg-color, white, 85%)
bg-color-selected-hover = mix(bg-color, white, 80%)

field()
  font-medium()
  display flex
  align-items center
  padding 0 20px
  cursor pointer
  transition background-color 0.1s ease


.select-root
  z-index 1
  position relative
  height height
  padding 0
  margin 0
  user-select none
  min-width 150px
  transform translateY(var(--overflow-y-length))
  transition transform 0.2s ease

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
    border-radius(5px)
    color textColor1
    &:hover
      background bg-color-selected-hover
    img
      width 30px
      transform rotate(90deg)
      transition transform 0.3s ease

  &.unrolled
    .title
      top -16px
    .selected-item
      border-color empColor1_1
      background bg-color-selected
      border-radius(5px 5px 0 0)
    img
      transform rotate(-90deg)

  &:not(.unrolled)
    .list
      max-height 0
      opacity 0

  .list
    position absolute
    top height
    width 100%
    z-index 9999
    max-height max-list-height
    overflow-y auto

    list-style none
    padding 0
    margin 0
    border-radius(0 0 5px 5px)
    border solid 1px empColor1_1
    border-top none
    transition all 0.2s ease

    .item
      field()
      color textColor3
      height item-height
      background bg-color
      &.selected
        color textColor1
        letter-spacing 1px
        background bg-color-selected
      &:hover
        color textColor1
        background bg-color-hover
      &.selected:hover
        background bg-color-selected-hover
      &:not(:first-child)
        border-top 1px solid borderColor
</style>

<template>
  <div class="select-root" ref="root" :class="{unrolled}" :readonly="readonly" :style="{'--overflow-y-length': overflowYLength + 'px'}">
    <span class="error-text">{{ error }}</span>
    <div class="selected-item" @click="toggleOpen">
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
import {HEADER_HEIGHT, MOBILE_HEADER_HEIGHT} from "../constants";

const INITIAL_HEIGHT = 50;
const ITEM_HEIGHT = 40;
const MAX_LIST_HEIGHT = 200;
const BOTTOM_MARGIN = 10;

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
      overflowYLength: 0,
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

    this.selectItem(this.selectedIdx, true);
  },

  methods: {
    focus() {
      this.unrolled = true;
    },

    selectItem(idx, disableEmitting = false) {
      this.state = this.States.default;
      this.selectedIdx = idx;

      this.$emit('update:modelValue', this.list[idx]);
      this.setClose();

      if (!disableEmitting)
        this.$emit('input', idx, this.list[idx]);
    },

    toggleOpen() {
      if (!this.unrolled) { // opening list
        this.setOpen();
      } else { // closeList
        this.setClose();
      }
    },

    setOpen() {
      const bottomY = this.$refs.root.offsetTop + INITIAL_HEIGHT + Math.min(ITEM_HEIGHT * this.list.length, MAX_LIST_HEIGHT);
      const maxHeight = /*HEADER_HEIGHT()*/ + document.querySelector('.main').scrollHeight;
      this.overflowYLength = Math.min(maxHeight - bottomY - MOBILE_HEADER_HEIGHT() - BOTTOM_MARGIN, 0);
      this.unrolled = true;
    },
    setClose() {
      this.overflowYLength = 0;
      this.unrolled = false;
    },
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

      this.selectItem(this.selectedIdx, true);
    }
  }
};
</script>

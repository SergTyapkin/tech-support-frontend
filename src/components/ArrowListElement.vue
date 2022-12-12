<style lang="stylus" scoped>
@require '../styles/constants.styl'

li
  list-style-type none
  padding 0
  margin 0
  width 100%
  border-color empColor6
  border-style solid
  border-width 0
  border-top-width 1px
  transition all 0.2s ease
  cursor pointer
  background linear-gradient(20deg, rgba(121, 86, 34, 0.3) 0%, rgba(55, 43, 16, 0) 100%) -50% 50% no-repeat
  background-size 0

  .all-info
    transition all 0.2s ease
    padding 10px
    display flex
    justify-content flex-start
    align-items center
    img
      width 25px
      display inline-block
      margin-right 10px
    .main-info
      max-width 70%
      .title-container
        .number
          margin-right 10px
          color empColor4
        //.title
      .info
        overflow hidden
        text-overflow ellipsis
    .choose
      opacity 0.3
      margin-left 30px
      transition all 0.3s ease-out
      transition-delay 20ms

  svg
    margin-right 10px

  ul
    padding 0
    margin 0

li:last-child
  border-bottom-width 1px
li.selected,
li:hover
li:hover + li
  border-color empColor1
li.inside:hover
  border-left-width 20px
  > .all-info
    border-left-width 0
    color textColor1
    letter-spacing 2px
    text-shadow 0 0 50px #f5f0f0, 0 0 10px #eaacbf, 0 0 15px #eaa093
    .choose
      opacity 1
      text-shadow 0 0 8px #e7bfac

li.selected
  background-size 100%
  > .all-info
    text-shadow 0 0 3px #a29a97


li.inside
  > .all-info
    //padding-left 20px
    //background linear-gradient(91deg,#533d0f,transparent) no-repeat
    background-size 25px 100%
    border-left colorShadowDark 20px solid

li.bg
  background-size 100%
</style>

<template>
  <li class="text-big" :class="{inside, bg, selected: !closed}">
    <div class="all-info" @click.prevent="onClick">
      <img v-if="!ispublished" src="../res/invisible.svg" alt="unpublished">
      <img v-if="islinkactive" src="../res/link.svg" alt="link active">

      <div class="main-info">
        <div class="title-container">
          <span class="number text-middle" v-if="number">{{ number }}</span>
          <span class="title">{{ title }}</span>
        </div>
        <div class="text-small info">{{ description }}</div>
      </div>
      <span class="text-small choose">
        {{ actionText }}<Arrow right ref="arrow" v-if="arrow"></Arrow>
      </span>
    </div>

    <ul class="roll-active" :class="{closed: closed}" ref="list">
      <ArrowListElement @click="$emit('click-inside', element)" v-for="(element, idx) in elements" v-bind="element" inside :arrow="element.arrow || false" closed :noClose="element.noClose" :number="numbered ? '#' + (idx + 1) : null"></ArrowListElement>
    </ul>
  </li>
</template>

<script>
import Arrow from "./Arrow.vue";
import {closeRoll, openRoll, openRollList} from "../utils/show-hide";
import {nextTick} from "vue";

export default {
  components: {Arrow},

  name: 'ArrowListElement',

  emits: ['click', 'open', 'close', 'click-inside'],

  props: {
    title: String,
    description: String,
    actionText: String,

    elements: {
      type: Array,
      default: []
    },

    closed: {
      type: Boolean,
      default: false
    },

    inside: {
      type: Boolean,
      default: false
    },

    arrow: {
      type: Boolean,
      default: true
    },

    noClose: {
      type: Boolean,
      default: false
    },

    bg: {
      type: Boolean,
      default: false
    },

    islinkactive: {
      type: Boolean,
      default: false
    },
    ispublished: {
      type: Boolean,
      default: true
    },
    openOnSetElements: {
      type: Boolean,
      default: false
    },
    preserveClickOpen: {
      type: Boolean,
      default: false
    },
    numbered: {
      type: Boolean,
      default: false
    },
    number: {
      type: String,
      default: null,
    }
  },

  data() {
    return {
      data_closed: this.$props.closed,
    }
  },

  mounted() {
    if (!this.data_closed) {
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.bottom);
    }
  },

  methods: {
    onClick() {
      this.$emit('click');
      if (this.noClose)
        return;

      if (this.data_closed) {
        if (this.preserveClickOpen) {
          this.$emit('open');
          return;
        }
        this.open();
        this.$emit('open');
        return;
      }
      this.close();
      this.$emit('close');
    },

    open() {
      openRoll(this.$refs.list);
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.bottom);
      this.data_closed = false;
    },
    close() {
      closeRoll(this.$refs.list);
      this.$refs?.arrow?.setDirection(this.$refs.arrow.directions.right);
      this.data_closed = true;
    },
  },

  watch: {
    elements: async function (to, from) {
      if (!this.openOnSetElements)
        return;

      await nextTick();
      this.open();
      this.$emit('open');
    }
  }
}
</script>

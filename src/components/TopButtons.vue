<style lang="stylus" scoped>
@require '../styles/constants.styl'

title-background = linear-gradient(160deg, #3b2516, #1f1313) no-repeat

_side-items-background = "rgba(188,116,39, 0.3) 0%, rgba(31,26,9,0.2) 100%) no-repeat"
side-items-background-left = unquote("linear-gradient(160deg, " + _side-items-background)
side-items-background = title-background
side-items-background-right = unquote("linear-gradient(320deg, " + _side-items-background)


.title-container
  margin 50px 0 20px 0
  width 100%
  display flex
  align-content stretch
  justify-content center
  transition all 0.3s ease
  box-shadow 0 10px 10px 0 black
  > *
    width 100%
    padding 20px
    transition all 0.3s ease
    text-shadow textLightingNormal2
    color textColor1
    @media ({mobile})
      padding 10px
      min-height 60px

.title-container.bg
  background title-background

.title-container.clickable.low-opacity
  > *
    opacity 0.5
.title-container.clickable
  > *
    cursor pointer
    opacity 0.8
    background side-items-background
    border-bottom transparent 2px solid
  > *:hover
    width 150%
    color textColor1
    letter-spacing 2px
    transition all 0.3s ease
    text-shadow 0 0 50px #f5f0f0, 0 0 10px #eaacbf, 0 0 15px #eaa093
    opacity 1
    border-bottom empColor1_1 2px solid

  > *
    display flex
    align-content center
    align-items center
    justify-content center
  > *:last-child
    justify-content flex-end
    background side-items-background-right
    border-right none
  > *:first-child
    justify-content flex-start
    background side-items-background-left

  span
    display inline-block

.no-link
  cursor default
</style>

<template>
  <div class="title-container " :class="{bg: bg, clickable: clickable, 'low-opacity': lowOpacity}">
    <router-link :to="(button.to || '')" v-for="(button, idx) in buttons" :class="{'no-link': button.to === undefined}"
                  @click="$emit('click', Object.assign(button, {idx}))">
      <Arrow left v-if="arrows && idx === 0" size="20px"></Arrow>
      <div>
        <div class=" lighting-text" :class="{'': clickable && !big}">{{ button.name }}</div>
        <div class="" v-html="button.description"></div>
      </div>
      <Arrow right v-if="arrows && idx !== 0 && idx === buttons.length-1" size="20px"></Arrow>
    </router-link>
  </div>
</template>

<script>
import Arrow from "./Arrow.vue";

export default {
  components: {Arrow},

  emits: ['click'],

  props: {
    buttons: {
      type: Array,
      default: [],
    },

    bg: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    arrows: {
      type: Boolean,
      default: false,
    },
    lowOpacity: {
      type: Boolean,
      default: false,
    },
    big: {
      type: Boolean,
      default: false,
    }
  },

  data() {
    return {
      base_url_path: this.$base_url_path
    }
  }
};
</script>

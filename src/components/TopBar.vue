<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

bg = blocksBgColor
height = 70px

.root
  z-index 1000
  font-medium()
  margin-bottom 20px
  width 100%
  display flex
  align-content stretch
  justify-content center
  transition all 0.3s ease
  box-shadow 0 10px 10px 0 colorShadowDark
  background bg
  height height
  > *
    width 100%
    padding 20px
    transition all 0.3s ease
    color textColor1
    @media ({mobile})
      padding 10px
      min-height 60px

    display flex
    align-content center
    align-items center
    justify-content center

    opacity 0.8
    border-bottom transparent 2px solid
    border-right mix(borderColor, transparent) 1px solid
  > *:hover
    width 150%
    color textColor1
    letter-spacing 2px
    transition all 0.3s ease
    opacity 1
    border-bottom empColor1_1 2px solid

  > *
    img
      width 40px
      margin-right 5px
  > .profile
    img
      width 30px
</style>

<template>
  <div class="root">
    <router-link :to="{name: 'events'}" class="events button">
      <img src="../res/events.svg" alt="">
      <span>Все события</span>
    </router-link>
    <router-link :to="{name: 'events', query: {userId: $user.id}}" class="my-events button">
      <img src="../res/my_events.svg" alt="">
      <span>Мои события</span>
    </router-link>
    <router-link :to="{name: 'profile'}" class="profile button">
      <img src="../res/profile.svg" alt="">
      <span>Профиль</span>
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

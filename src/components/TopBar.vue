<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

bg = blocksBgColor
margin-bottom = 0
height = (header-height - margin-bottom)

.root
  z-index 1000
  font-medium()
  margin-bottom margin-bottom
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
    font-small()
    @media ({mobile})
      font-small-extra()
      padding 10px
      min-height 60px
    display flex
    flex-direction column
    white-space nowrap
    align-content center
    align-items center
    justify-content center

    opacity 0.8
    border-bottom transparent 2px solid
    border-right mix(borderColor, transparent) 1px solid
  > *:hover
  > *.active
    width 150%
    color textColor1
    letter-spacing 2px
    transition all 0.3s ease
    opacity 1
    border-bottom empColor1_1 2px solid
  > *:hover
    background blocksBgColor

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
    <router-link :to="routes.events" class="events button" :class="{active: $route.fullPath === routes.events}">
      <img src="../res/events.svg" alt="">
      <span>Все события</span>
    </router-link>
    <router-link :to="routes.eventsMy" class="my-events button" :class="{active: $route.fullPath === routes.eventsMy}">
      <img src="../res/my_events.svg" alt="">
      <span>Мои события</span>
    </router-link>
    <router-link :to="routes.docs" class="docs button" :class="{active: $route.fullPath === routes.docs}">
      <img src="../res/doc.svg" alt="">
      <span>Документация</span>
    </router-link>
    <router-link :to="routes.profile" class="profile button" :class="{active: $route.fullPath === routes.profile}">
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
      base_url_path: this.$base_url_path,

      routes: {
        events: this.$router.resolve({ name: 'events' }).href,
        eventsMy: this.$router.resolve({ name: 'events', query: {userId: this.$user.id} }).href,
        docs: this.$router.resolve({ name: 'docs' }).href,
        profile: this.$router.resolve({ name: 'profile' }).href,
      }
    }
  },
};
</script>

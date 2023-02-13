<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.image-div
  position relative
  width 60px
  height 60px
  overflow visible
  .image
    border-radius(50%)
    outline 2px solid empColor2_1
    outline-offset 2px
    width 60px
    height 60px
    min-width 60px
    min-height 60px
  &::before
    content ""
    position absolute
    bottom -5px
    left 50%
    transform translateX(-50%)
    font-medium()
    font-family monospace
    z-index 2
  &::after
    z-index 1

  &.level-1
    &::before
      content "I"
      color colorSilver
    .image
      outline-color colorSilver
  &.level-2
    &::before
      content "II"
      color colorBronze
    .image
      outline-color colorBronze
  &.level-3
    &::before
      content "III"
      color colorGold
    .image
      outline-color colorGold
  &.level-4
    &::before
      content "IV"
  &.level-5
    &::before
      content "V"
  &.level-last
    &::after
      content ""
      background url("../res/hearthstone_legendary_card.png") no-repeat
      background-size contain
      position absolute
      inset -15px
      right -30px
    &::before
      bottom -9px
      color colorGold
  &.level-last-prev
    &::after
      content ""
      background url("../res/hearthstone_silver_legendary_card.png") no-repeat
      background-size contain
      position absolute
      top -10px
      left -18px
      right -27px
      bottom -10px
    &::before
      bottom -6px
      font-weight bold
      color mix(colorBronze, black, 30%)
</style>

<template>
  <div class="image-div" :class="`level-${level} ${level === maxLevels ? 'level-last' : ''} ${level === maxLevels - 1 ? 'level-last-prev' : ''}`">
    <AchievementAvatar alt="achievement" :image-id="imageId"></AchievementAvatar>
  </div>
</template>

<script>
import AchievementAvatar from "./AchievementAvatar.vue";


export default {
  components: {AchievementAvatar},
  props: {
    imageId: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    maxLevels: {
      type: Number,
      required: true,
    },
  },
}
</script>

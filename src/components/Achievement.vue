<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.image-div
  position relative
  width 60px
  height 60px
  overflow visible
  .heptagon-underlay
    position absolute
    inset -5%
    fill url(#AvatarHeptagonUnderlaySvgFill)
  .image
    --border-color-achievement empColor2_1
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
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
      --border-color-achievement colorSilver
  &.level-2
    &::before
      content "II"
      color colorBronze
    .image
      --border-color-achievement colorBronze
  &.level-3
    &::before
      content "III"
      color colorGold
    .image
      --border-color-achievement colorGold
  &.level-4
    &::before
      content "IV"
  &.level-5
    &::before
      content "V"
  &.level-solo
    &:before
      color colorSilver
    .image
      --border-color-achievement colorSilver
      --border-width 1px
      --border-offset unquote('0px')
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
  &.level-special
    &:before
      content "SPECIAL"
      background linear-gradient(#33ffbb 0%, #4da6ff 34%, #a64dff 70%, #FF3399 100%)
      color transparent
      background-clip text
      -webkit-background-clip text
      font-weight bolder
      font-size 12px
      bottom 30px
      left 43px
      transform rotate(75deg)
    &:after
      content none // disable stroke image
  &.no-level
    &:before
    &:after
      content none // disable stroke image and level text

    .image
      --border-color-achievement colorSilver
      --border-width 1px
      --border-offset unquote('0px')

  &.level-special
    .image
      --border-width unquote('0px')
      --border-offset unquote('0px')
      clip-path: url(#AvatarHeptagonSvgClip);
      -webkit-clip-path: url(#AvatarHeptagonSvgClip);
</style>

<template>
  <div class="image-div" :class="`level-${level} ${level === maxLevels ? (maxLevels === 1 ? 'level-solo' : 'level-last') : ''} ${level === maxLevels - 1 ? 'level-last-prev' : ''} ${special ? 'level-special' : ''} ${noLevel ? 'no-level' : ''}`">
    <svg v-if="special" class="heptagon-underlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M 15.0864 1.656 A 5.6496 5.6496 90 0 1 20.544 0.192 l 18.3504 4.9152 a 5.6496 5.6496 90 0 1 3.9936 3.9936 l 4.9152 18.3504 a 5.6496 5.6496 90 0 1 -1.464 5.4576 L 32.9136 46.344 a 5.6496 5.6496 90 0 1 -5.4576 1.464 l -18.3504 -4.9152 a 5.6496 5.6496 90 0 1 -3.9936 -3.9936 L 0.192 20.544 a 5.6496 5.6496 90 0 1 1.464 -5.4576 L 15.0864 1.656 Z"></path></svg>
    <AchievementAvatar :no-border-radius="special" class="image" alt="achievement" :image-id="imageId" border-width="2px" border-offset="2px" :size="size" :size-mobile="sizeMobile"></AchievementAvatar>
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
    level: Number,
    maxLevels: Number,
    special: Boolean,
    size: {
      type: String,
      default: '60px',
    },
    sizeMobile: {
      type: String,
      default: '60px',
    },
    noLevel: Boolean,
  },
}
</script>

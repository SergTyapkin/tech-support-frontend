<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/utils.styl'

borderColor = var(--border-color, #ff00ff)

.avatar
  position relative
  width var(--size)
  min-width var(--size)
  height var(--size)
  min-height var(--size)
  @media({mobile})
    width var(--size-mobile)
    min-width var(--size-mobile)
    height var(--size-mobile)
    min-height var(--size-mobile)

  .avatar-image
    width 100%
    height 100%
    &:not(.no-border-radius)
      // border borderColor 1px solid // not works on Safari
      border-radius(50%)
    position relative
    overflow hidden

  .border // and on Safari we need this shit
    position absolute
    inset calc(-1 * (var(--border-offset, var(--border-offset-default__)) + var(--border-width, var(--border-width-default__))))
    background radial-gradient(transparent 0%, transparent calc(70% - var(--border-width, var(--border-width-default__))), borderColor calc(70%), transparent calc(70% + 1px))

  &.no-border
    .border
      background none
</style>

<template>
  <div class="avatar"
       :style="{
         '--size': size,
         '--size-mobile': sizeMobile,
         '--border-offset-default__': borderOffset,
         '--border-width-default__': borderWidth,
       }"
       :class="{'no-border': ['0px', '0', 0].includes(borderWidth)}"
  >
    <ServerImage :image-id="imageId" :default-image-src="defaultImageSrc" alt="avatar" class="avatar-image" :class="{'no-border-radius': noBorderRadius}"></ServerImage>
    <div v-if="!noBorderRadius" class="border"></div>
    <slot></slot>
  </div>
</template>

<script>
import ServerImage from "./ServerImage.vue";
import defaultAvatarImage from '../res/default_avatar.png';


export default {
  // takes
  // --border-color
  // --border-width
  // --border-offset
  // css variables with priority above props
  components: {ServerImage},
  props: {
    defaultImageSrc: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    sizeMobile: {
      type: String,
      default: undefined,
    },
    borderWidth: {
      type: String,
      default: '0px',
    },
    borderOffset: {
      type: String,
      default: '0px',
    },
    noBorderRadius: Boolean,
  },

  data() {
    return {
      sizeMobile: this.$props.sizeMobile ? this.$props.sizeMobile : this.$props.size,
    }
  }
}
</script>

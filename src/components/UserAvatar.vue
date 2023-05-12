<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/utils.styl'

.avatar-root
  --border-color var(--border-color-user, mix(textColor2, transparent))
</style>

<template>
  <CircleServerImage class="avatar-root"
                     :default-image-src="img"
                     :size="size"
                     :size-mobile="sizeMobile"
                     :image-id="imageId"
                     :border-offset="borderOffset"
                     :border-width="borderWidth"
                     :no-border-radius="noBorderRadius"
  ></CircleServerImage>
</template>

<script>
import ServerImage from "./ServerImage.vue";
import defaultAvatarImage from '../res/default_avatar.png';
import CircleServerImage from "./CircleServerImage.vue";


export default {
  // takes
  // --border-color-user
  // css variable with priority above props
  components: {CircleServerImage, ServerImage},
  props: {
    imageId: {
      type: String,
      required: true,
    },
    size: String,
    sizeMobile: String,
    borderWidth: {
      type: String,
      default: '1px',
    },
    borderOffset: {
      type: String,
      default: '0px',
    },
    noBorderRadius: Boolean,
  },

  data() {
    return {
      img: defaultAvatarImage,
    }
  }
}
</script>

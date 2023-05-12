<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/utils.styl'

.avatar-root
  --border-color var(--border-color-achievement, empColor2_2)
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
import defaultAvatarImage from '../res/default_achievement.png';
import CircleServerImage from "./CircleServerImage.vue";


export default {
  // takes
  // --border-color-achievement
  // css variable with priority above props
  components: {CircleServerImage, ServerImage},
  props: {
    imageId: {
      type: String,
      required: true,
    },
    size: String,
    sizeMobile: String,
    borderWidth: String,
    borderOffset: String,
    noBorderRadius: Boolean,
  },

  data() {
    return {
      img: defaultAvatarImage,
    }
  }
}
</script>

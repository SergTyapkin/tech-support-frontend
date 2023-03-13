<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/utils.styl'

.avatar-image
  width var(--size)
  min-width var(--size)
  height var(--size)
  min-height var(--size)
  border mix(textColor2, transparent) 1px solid
  border-radius(50%)
  position relative
  overflow hidden
</style>

<template>
  <ServerImage :image-id="imageId" :default-image-src="img" alt="avatar" class="avatar-image" :style="{'--size': size}"></ServerImage>
</template>

<script>
import ServerImage from "./ServerImage.vue";
import defaultAvatarImage from '../res/default_avatar.png';


export default {
  components: {ServerImage},
  props: {
    imageId: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "80px",
    }
  },

  data() {
    return {
      img: defaultAvatarImage
    }
  },
}
</script>

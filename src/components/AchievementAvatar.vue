<style lang="stylus" scoped>

</style>

<template>
  <ServerImage :image-id="imageId" :default-image-src="img" alt="avatar" class="achievement-avatar"></ServerImage>
</template>

<script>
import ServerImage from "./ServerImage.vue";
import defaultAvatarImage from '../res/default_achievement.png';


export default {
  components: {ServerImage},
  props: {
    imageId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      img: defaultAvatarImage
    }
  }
}
</script>

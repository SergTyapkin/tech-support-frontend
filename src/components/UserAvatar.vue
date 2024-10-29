<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/utils.styl'

.user-avatar-root
  position relative
  display flex
  align-items center
  justify-content center
  .avatar-root
    --border-color var(--border-color-user, mix(textColor2, transparent))
    margin auto

  .trophy
    position absolute
    top var(--top)
    right var(--right)
    left var(--left)
    bottom var(--bottom)
    width 100%
    height 100%
    object-fit cover
    overflow visible
    transform scale(var(--scale))
</style>

<template>
  <div class="user-avatar-root">
    <CircleServerImage class="avatar-root"
                       :default-image-src="img"
                       :size="size"
                       :size-mobile="sizeMobile"
                       :image-id="imageId"
                       :border-offset="borderOffset"
                       :border-width="borderWidth"
                       :no-border-radius="noBorderRadius"
    >
      <img class="trophy" v-if="trophy !== undefined" :src="trophy.image" :style="{'--top': trophy.top, '--left': trophy.left, '--right': trophy.right, '--bottom': trophy.bottom, '--scale': trophy.scale || 1}" alt="trophy">
    </CircleServerImage>
  </div>
</template>

<script>
import ServerImage from "./ServerImage.vue";
import defaultAvatarImage from '../res/default_avatar.png';
import CircleServerImage from "./CircleServerImage.vue";

import ShamanCap from "../res/trophies/shamanСap.png"
import LeshaCap from "../res/trophies/leshaCap.png"

const USERS_TROPHIES = {
  20: {
    image: ShamanCap,
    top: "-40%",
    left: "-30%",
    scale: "0.9"
  },
  53: {
    image: LeshaCap,
    top: "-35%",
    left: "-20%",
    scale: "0.9"
  },
}

export default {
  // takes
  // --border-color-user
  // css variable with priority above props
  components: {CircleServerImage, ServerImage},
  props: {
    userId: {
      type: Number,
      required: true,
    },
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

      trophy: undefined,
    }
  },

  mounted() {
    this.updateUserTrophy();
  },

  methods: {
    updateUserTrophy() {
      this.trophy = USERS_TROPHIES[this.$props.userId];
    },
  },

  watch: {
    userId() {
      this.updateUserTrophy();
    }
  }
}
</script>

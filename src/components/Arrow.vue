<style lang="stylus" scoped>
@require '../styles/constants.styl'


.arrow
  width var(--size)
  height var(--size)
  border-top 5px solid empColor5
  border-right 5px solid empColor2
  border-radius 7px 0 7px 0
  transition all 0.2s ease
  display inline-block

.arrow.right
  right 0
  transform rotate(45deg)
  margin-left 20px

.arrow.left
  right 0
  transform rotate(-135deg)
  margin-right 20px

.arrow.top
  right 0
  transform rotate(-45deg)
  margin-left 20px

.arrow.bottom
  right 0
  transform rotate(135deg)
  margin-left 20px
</style>

<template>
  <span :class="`arrow ${direction}`" :style="`--size: ${size}`"></span>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '15px'
    },

    right: Boolean,
    top: Boolean,
    left: Boolean,
    bottom: Boolean,
  },

  data() {
    return {
      direction: '',
      directions: {
        top: 'top',
        right: 'right',
        left: 'left',
        bottom: 'bottom',
      }
    }
  },

  mounted() {
    if (this.$props?.top)
      this.direction = this.directions.top;
    if (this.$props?.left)
      this.direction = this.directions.left;
    if (this.$props?.right)
      this.direction = this.directions.right;
    if (this.$props?.bottom)
      this.direction = this.directions.bottom;
  },

  methods: {
    setDirection(dirName) {
      this.direction = dirName;
    }
  }
}
</script>

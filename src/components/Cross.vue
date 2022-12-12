<style lang="stylus" scoped>
@require '../styles/constants.styl'


cross-lines-width = 14%
.cross {
  width var(--size)
  height var(--size)
  transform: rotate(45deg);
  position: relative;
  display: inline-block;
  transition all 0.3s ease
  border-radius 50%
}
.cross:hover
  transform: rotate(135deg) scale(1.1);
.cross:hover:before,
.cross:hover:after
  background empColor2

.cross:before, .cross:after {
  content: "";
  position: absolute;
  z-index: -1;
  background: empColor4;
}
.cross:before {
  top: 0;
  left: 50%;
  width: cross-lines-width;
  margin-left (- cross-lines-width / 2)
  height: 100%;
}
.cross:after {
  top: 50%;
  left: 0;
  height: cross-lines-width;
  margin-top (- cross-lines-width / 2)
  width: 100%;
}
</style>

<template>
  <span class="cross" :style="`--size: ${size}`"></span>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '15px'
    },
  }
}
</script>

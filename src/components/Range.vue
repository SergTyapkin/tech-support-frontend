<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'


slider-width = 5px
slider-length = 200px
thumb-size = 3px

.slider-container
  display flex
  align-items center
  .value
    display flex
    align-items center
    justify-content center
    font-medium()
    padding 1px 8px
    border 1px solid empColor2_2
    background empColor2_4
    border-radius 3px
    text-align center
    color empColor2_1
    margin-right 10px

  .input-container
    flex 1
    display flex
    flex-direction column
    .slider
      all unset
      margin 10px
      margin-bottom 3px
      height slider-width
      max-width slider-length
      width calc(100% - 10px)
      background: bgColor;
      outline: none;
      border-radius: thumb-size;
      overflow hidden
      box-shadow: inset 0 0 5px empColor1_1;
      @media ({mobile})
        background linear-gradient(170deg, empColor1_1, empColor2_1)
        box-shadow none
    .slider::-webkit-slider-thumb
      -webkit-appearance none
      width thumb-size
      height thumb-size
      border-radius 50%
      background empColor2_1
      cursor pointer
      border 4px solid #333
      box-shadow (- slider-length - 5px) 0 0 (slider-length) mix(empColor1_1, transparent, 30%)

    .range-labels
      color textColor3
      font-size 10px
      max-width slider-length
      width calc(100% - 10px)
      display flex
      flex-direction row
      justify-content space-between
      margin 0 10px

</style>

<template>
  <div class="slider-container">
    <div class="value">{{ value }}1</div>
    <div class="input-container">
      <input type="range" class="slider" min="1" max="3" step="1" v-model="size" @input="onInput">
      <div class="range-labels">
        <div>0.25</div>
        <div>0.5</div>
        <div>0.75</div>
        <div>1</div>
        <div>1.25</div>
        <div>1.5</div>
        <div>1.75</div>
        <div>2</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },

    labels: Array,
  },

  data() {
    return {

    }
  }
}
</script>


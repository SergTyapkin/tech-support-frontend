<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'


slider-width = 7px
slider-length = 200px
thumb-size = 3px

.slider-container
  display flex
  align-items center
  position relative
  .value-container
    display flex
    align-items center
    justify-content flex-end
    font-medium()
    min-width 50px
    width 56px
    @media ({mobile})
      position absolute
      top -30px
      right 40px
    &.hidden
      display none
    .value
      all unset
      box-sizing border-box
      display block
      padding 1px 8px
      border 1px solid empColor2_2
      background empColor2_4
      border-radius 3px
      text-align center
      width 100%
      color empColor2_1

      -moz-appearance textfield
      -webkit-appearance textfield
      appearance textfield
      &::-webkit-outer-spin-button
      &::-webkit-inner-spin-button
        display none

  .input-container
    flex 1
    display flex
    flex-direction column
    input-margin = 10px
    input-margin-bottom = 0
    width slider-length + input-margin * 2
    .slider
      all unset
      margin input-margin
      margin-bottom input-margin-bottom
      height slider-width
      max-width slider-length
      width calc(100% - 10px)
      background linear-gradient(170deg, empColor1_2, empColor2_2)
      outline none
      border-radius thumb-size
      overflow hidden
      cursor pointer
    .slider::-webkit-slider-thumb
      -webkit-appearance none
      width thumb-size
      height thumb-size
      border-radius 50%
      background empColor2_1
      cursor pointer
      border 4px solid #333

    .range-labels
      color textColor3
      font-size 10px
      max-width (slider-length + 7px)
      width calc(100% - 7px)
      display flex
      flex-direction row
      justify-content space-between
      margin 0 5px 0 5px
      > *
        padding 0 6px
        padding-top 3px
        cursor pointer
        text-align center
        transition all 0.1s ease
        &:hover
          color textColor1
          transform translateY(2px)
      > *:first-child
        padding-left 0
      > *:last-child
        padding-right 0

    position relative
    .splitters-container
      mix-blend-mode overlay
      pointer-events none
      .splitter
        position absolute
        top 10px
        left "calc(%s + %s / var(--count) * (var(--num) + 0.25))" % ((thumb-size * 2) (slider-length - thumb-size * 2.5))
        width 2px
        height slider-width
        background bgColor
        &:first-child
        &:last-child
          display none

  .delete-container
    .delete-button
      img
        width 20px
        min-width 20px
        height 20px
      cursor pointer
      transition all 0.2s ease
      display flex
      align-items center
      justify-content center
      &:hover
        transform rotate(180deg) scale(1.1)
</style>

<template>
  <div class="slider-container">
    <div class="value-container" :class="{hidden: noValue}">
      <input type="number" aria-controls="off" ref="value" class="value" v-model="modelValue" :step="step" @change="updateVModel" :readonly="readonly">
    </div>
    <div class="input-container" v-if="!readonly">
      <input type="range" class="slider" ref="range" :min="min" :max="max" :step="step" v-model="modelValue" @change="updateVModel">
      <div class="range-labels">
        <div v-for="val in ((max-min) / step + 1)" @click="setModelValue(min + (val - 1) * step)">{{ min + (val - 1) * step }}</div>
      </div>
      <div class="splitters-container">
        <div class="splitter" v-for="i in ((max-min) / step + 1)" :style="{'--num': i - 1, '--count': (max-min) / step}"></div>
      </div>
    </div>
    <div class="delete-container" v-if="withDelete">
      <div class="delete-button" @click="setModelValue(null)">
        <img src="../res/cross.svg" alt="clear">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['change', 'update:modelValue'],

  props: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    noValue: Boolean,
    readonly: Boolean,
    withDelete: Boolean,

    modelValue: null,
    labels: Array,
  },

  data() {
    return {

    }
  },

  methods: {
    updateVModel(event) {
      let value = Number(event.target.value);
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },

    setModelValue(value) {
      this.$refs.value.value = value;
      this.$refs.value.dispatchEvent(new Event('input'));
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },
  }
}
</script>


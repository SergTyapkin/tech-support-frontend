<style lang="stylus" scoped>
@require '../../styles/constants.styl'
@require '../../styles/forms.styl'
@require '../../styles/fonts.styl'

li
  display flex
  align-items center
  padding 5px 20px
  margin 0
  justify-content space-between

  > .orderid
    margin-right 5px
    color textColor3
    font-small()
  > .input
    input()
    flex 1
  > .delete-button
    width 30px
    margin-left 10px
    cursor pointer
    transition all 0.1s ease
    &:hover
      transform scale(1.1)
</style>

<template>
  <li>
    <span class="orderid">{{ idx + 1 }}</span>
    <input type="text" class="input" :placeholder="placeholder" :value="modelValue.title" autocomplete="off" @input="updateVModel" ref="input">
    <div v-if="canDelete" class="delete-button" @click="$emit('delete', idx)"><img src="../../res/trash.svg" alt="delete"></div>
  </li>
</template>

<script>
  export default {
    emits: ['delete', 'move', 'update:modelValue'],

    props: {
      idx: Number,
      modelValue: {
        title: '',
        confirmed: '',
      }, // aka "item"
      placeholder: String,
      canDelete: Boolean,
    },

    data() {
      return {
      }
    },

    methods: {
      updateVModel() {
        this.modelValue.title = this.$refs.input.value;
        this.$emit('update:modelValue', this.modelValue);
      },
    }
  }
</script>

<style lang="stylus">
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'


form-bg = blocksBgColor

textarea
input
.input-like
  all unset
  width 100%
  color textColor1
  box-sizing border-box
  font-family Arial
  padding 10px
  font-size 1rem
  transition all 0.2s ease
textarea
  background colorShadowDark
  border-radius 3px
  border transparent 1px solid
textarea:focus
  border empColor2_1 1px solid
input
.input-like
  background colorShadowLight-x
  border-radius 5px 5px 0 0
  border-bottom 1px solid empColor1_1
  border-right 100px solid transparent
  border-left 100px solid transparent
  @media ({mobile})
    border-right-width 10px
    border-left-width 10px
textarea:focus
input:focus
.input-like:focus
  background colorShadowDark
  border-right-width 0
  border-left-width 0
  //border-color empColor1_1
.form:not(.no-bg)
  background form-bg
  box-shadow 3px 3px 10px black
  padding 40px 30px
  margin-top 100px

.form
  font-small-extra()
  margin-left auto
  margin-right auto
  width 100%
  max-width 460px
  border-radius 7px
  backdrop-filter blur(1px)
  mix-blend-mode difference
  transition all 0.3s ease

  .info-container
    text-align center
    margin 20px auto

  .submit-container
    .info
      margin-top 15px

  .fields-container
    > div
      margin 20px 0
      transition all 0.3s ease
      > label
        font-medium()
      > textarea,
      > input[type=text]
      > input[type=password],
      > input[type=email],
        display block
        width 100%
        padding 10px
      .info
        margin 5px 0

.form
  > div // containers
    margin 30px 0
  > div:last-child
    margin-bottom 0
  > div:first-child
    margin-top 0

.form
  textarea
    resize vertical
    transition border-color 0.3s ease

  input[type=button]
  input[type=submit]
    button-submit()


.form
  .form-info
    opacity 0
    transition all 0.3s
.form.error
.form.success
  .form-info
    opacity 1

.form.error
.form .error
  color colorNo
  *
    color colorNo
  textarea
  input
  .input-like
    border-color colorNo
//animation error 3s forwards
.form.success
.form .success
  color colorYes
  *
    color colorYes
  textarea,
  input
  .input-like
    border-color colorYes
//animation success 3s forwards

.form.disabled
  input
  .input-like
    user-select none
    filter saturate(0)

@media ({mobile})
  .form
    padding-left 10px
    padding-right 10px
</style>

<template>
  <form @submit.prevent.stop="submit" class="form" :class="{disabled: loading}" ref="form">
    <slot></slot>
  </form>
</template>

<script>
import {setTimedClass} from "../utils/utils";

export default {
  emits: ['submit'],

  data() {
    return {
      loading: false,
      info: '',
    };
  },

  methods: {
    submit() {
      this.$emit('submit', this.values);
    },

    showError() {
      setTimedClass([this.$refs.form], 'error');
    },
    showSuccess() {
      setTimedClass([this.$refs.form], 'success');
    },
  }
};
</script>

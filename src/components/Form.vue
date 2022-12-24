<style lang="stylus">
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/forms.styl'


.form
  form()
  input
  .input-like
    input()
  textarea
    textarea()
</style>

<template>
  <form class="form" :class="{disabled: loading}" ref="form" @submit.prevent.stop="$emit('submit')">
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
    showError() {
      setTimedClass([this.$refs.form], 'error');
    },
    showSuccess() {
      setTimedClass([this.$refs.form], 'success');
    },
  }
};
</script>

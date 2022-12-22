<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

.title
  font-large()
  margin-bottom 10px
  .small-title
    font-medium()
.description
  font-small-extra()
  color textColor2
  letter-spacing 0.5px

.no-bg
  background none
  backdrop-filter none
  mix-blend-mode unset

.input-info
  font-small()
  &:not(.link)
    color textColor4

.info
  font-small()
</style>

<template>
  <Form @submit="submit" ref="form" :class="{'no-bg': noBg}">
    <div class="info-container">
      <div class="title" :class="{'small-title': smallTitle}">{{ title }}</div>
      <div class="description">{{ description }}</div>
    </div>

    <div class="fields-container">
      <div class="form-info ">{{ info }}</div>
      <FloatingInput v-for="field in fields"
                     :title="field.title"
                     :autocomplete="field.autocomplete"
                     :type="field.type"
                     :error="errors[field.jsonName]"
                     v-model="values[field.jsonName]"
      >
        <router-link v-if="field.infoHref" :to="field.infoHref" class="input-info link" v-html="field.info"></router-link>
        <div class="input-info" v-else v-html="field.info"></div>
      </FloatingInput>
    </div>

    <div class="submit-container" v-if="!noSubmit">
      <input v-if="!loading" type="submit" :value="submitText">
    </div>
    <CircleLoading v-if="loading"></CircleLoading>

    <div class=" info">
      <slot></slot>
    </div>
  </Form>
</template>

<script>
import Form from "./Form.vue";
import FloatingInput from "./FloatingInput.vue";
import CircleLoading from './loaders/CircleLoading.vue';

export default {
  components: {FloatingInput, CircleLoading, Form},
  emits: ['submit'],

  props: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },

    fields: {
      type: Array,
      default: []
    },

    submitText: {
      type: String,
    },
    submitInfo: {
      type: String,
    },

    noBg: {
      type: Boolean,
      default: false
    },
    noSubmit: {
      type: Boolean,
      default: false
    },
    smallTitle: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      info: '',
      errors: {},
      values: {}
    };
  },

  mounted() {
    for (const field of this.fields) {
      this.values[field.jsonName] = '';
      this.errors[field.jsonName] = '';
    }
  },

  methods: {
    submit() {
      this.$emit('submit', this.values);
    },

    showError() {
      this.$refs.form.info = this.info;
      this.$refs.form.showError();
    },

    showSuccess() {
      this.$refs.form.info = this.info;
      this.$refs.form.showSuccess();
    },
  }
};
</script>

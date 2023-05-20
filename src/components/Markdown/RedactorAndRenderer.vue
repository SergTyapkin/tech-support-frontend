<style lang="stylus" scoped>
@require '../../styles/buttons.styl'


.root-redactor-renderer
  .top-buttons
    display flex
    justify-content space-between
    align-items center
    .switch-button
      button()
      width min-content
      white-space nowrap

  .info
    font-small()
    color textColor4

  .redactor
  .renderer
    max-height 3000px
    transition all 0.5s ease
    overflow-y auto
    &.hidden
      overflow-y hidden
      max-height 0
      transition all 0.5s cubic-bezier(0, 1, 0, 1)
      opacity 0
      pointer-events none

</style>

<template>
  <div class="root-redactor-renderer">
    <div class="top-buttons">
      <div class="info" v-if="modeRedactor">{{ info }}</div>
      <div class="info" v-if="!modeRedactor">
        <span v-if="canEdit">Превью</span>
        <span v-else>Описание</span>
      </div>
      <div v-if="modeRedactor" class="switch-button" @click="modeRedactor = !modeRedactor">Посмотреть превью</div>
      <div v-else-if="accessNotAdmins || canEdit" class="switch-button" @click="modeRedactor = !modeRedactor">В редактор</div>
    </div>
    <MarkdownRedactor :class="{hidden: !modeRedactor}" v-if="canEdit" class="redactor" @input="(text) => {$emit('input', text); updateVModel(text);}" @change="$refs.renderer?.update" ref="text" v-model="modelValue" :placeholder="placeholder" :rows="10"></MarkdownRedactor>
    <MarkdownRenderer :class="{hidden: modeRedactor}" class="renderer scrollable" ref="renderer"></MarkdownRenderer>
  </div>
</template>

<script>
import MarkdownRedactor from "./MarkdownRedactor.vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";


export default {
  components: {MarkdownRenderer, MarkdownRedactor},
  emits: [],

  props: {
    modelValue: String,
    info: String,
    placeholder: String,
    showInitialPreview: Boolean,
    accessNotAdmins: Boolean,
    canEdit: Boolean,
  },

  data() {
    return {
      modeRedactor: !this.$props.showInitialPreview,
    }
  },

  methods: {
    updateVModel(text) {
      const textSend = text || this.modelValue;
      this.$emit('input', textSend);
      this.$emit('update:modelValue', textSend);
    },
  },

  watch: {
    modelValue(to, from) {
      if (from === undefined)
        this.$refs.renderer.update(to);
    }
  }
};
</script>

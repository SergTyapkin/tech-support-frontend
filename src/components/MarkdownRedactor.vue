<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/forms.styl'


extra-small = 3px
small-font-size = 14px

svg-buttons-fill-color = textColor1
svg-stroke-width = 1px

// Markdowns
markdown-panel-shadow-margin = 5px
markdown-panel-shadow-offset = 3px 3px
markdown-panel-shadow-blur = 5px
markdown-panel-shadow-color = colorShadow
markdown-panel-margin = 2px
markdown-panel-border-radius = 3px 0 3px 0
markdown-panel-font-size = 14px
markdown-panel-height = 20px
markdown-panel-bg-color = bgColor

markdown-button-width = 30px
markdown-button-padding = 2px 0 0 0
markdown-button-divider-color = bgColorLight
markdown-button-bg-color = transparent
markdown-button-bg-color-hover = empColor1_1

markdown-button-svg-photo-stroke = 2px
markdown-button-svg-photo-fill = transparent


.markdown
  position relative
  background markdown-bg-color
  textarea
    textarea()
    padding-top markdown-panel-height + markdown-panel-shadow-margin
    width 100%
    resize vertical

.markdown-panel
  position absolute
  top 0
  left 0
  display flex
  overflow hidden
  box-shadow markdown-panel-shadow-offset markdown-panel-shadow-blur markdown-panel-shadow-color
  margin markdown-panel-margin
  border-radius markdown-panel-border-radius
  font-family Arial
  font-size markdown-panel-font-size
  height markdown-panel-height
  background markdown-panel-bg-color
  svg
    fill svg-buttons-fill-color
    overflow visible

  > div
    cursor pointer
    text-align center
    margin auto 0 auto 0
    width markdown-button-width
    height 100%
    padding markdown-button-padding
    background markdown-button-bg-color

    transition background ease 0.2s
    background-image:
        radial-gradient(1px 45% at 0% 50%, markdown-button-divider-color, transparent),
        radial-gradient(1px 45% at 100% 50%, markdown-button-divider-color, transparent);
    ._photo
      stroke svg-buttons-fill-color
      stroke-width svg-stroke-width
      fill markdown-button-svg-photo-fill
  > div._italic
    font-family Cursive
    padding-top 0
  > div:hover
    background markdown-button-bg-color-hover

  > div._bold
    font-weight bold
  > div._italic
    font-style italic
  > div._underscore
    text-decoration underline
  > div._strikethrough
    text-decoration line-through

.image-loader
  position relative
.image-loader::before
  content 'Отпустите, чтобы загрузить фото'
  position absolute
  inset 0
  padding-left 20px
  text-align center
  display flex
  align-items center
  background colorShadowDark-x
  color textColor1
  font-size 25px
  opacity 0
  transition opacity 0.2s ease
  pointer-events none
  z-index 999
.image-loader.in-drag::before
  opacity 1

</style>

<template>
  <div class="markdown" @change.stop="" @input="onInput">
    <DragNDropLoader class="image-loader" @load="attachPhoto"
                     :crop-size="cropSize"
                     :compress-size="compressSize">
      <textarea class="markdowned scrollable link" ref="textarea" :rows="rows" v-model="modelValue" @input="updateVModel()" :placeholder="placeholder"></textarea>
      <div class="markdown-panel">
        <div class="_bold" @click="encaseInputText('**', '**')">B</div>
        <div class="_italic" @click="encaseInputText(' _', '_ ')">I</div>
        <div class="_strikethrough" @click="encaseInputText(' ~~', '~~ ')">S</div>
        <div class="_code" @click="encaseInputText('`', '`')">`c`</div>
        <div class="_header-1" @click="encaseInputLines('# ')">H1</div>
        <div class="_header-2" @click="encaseInputLines('## ')">H2</div>
        <div class="_header-3" @click="encaseInputLines('### ')">H3</div>
        <div class="_blockquote" @click="encaseInputLines('> ')">>|</div>
        <div class="_list" @click="encaseInputLines('- ')"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="12px"><g transform="scale(0.25) translate(8, 2)"><path d="M57.124,51.893H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,51.893,57.124,51.893z"/><path d="M57.124,33.062H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3   C60.124,31.719,58.781,33.062,57.124,33.062z"/><path d="M57.124,14.231H16.92c-1.657,0-3-1.343-3-3s1.343-3,3-3h40.203c1.657,0,3,1.343,3,3S58.781,14.231,57.124,14.231z"/><circle cx="4.029" cy="11.463" r="4.029"/><circle cx="4.029" cy="30.062" r="4.029"/><circle cx="4.029" cy="48.661" r="4.029"/></g></svg></div>
        <div class="_link" @click="attachLink"><svg xmlns="http://www.w3.org/2000/svg" width="18px" height="15px"><g transform="scale(0.028) translate(70, 40)"><path d="M211.26,389.24l-60.331,60.331c-25.012,25.012-65.517,25.012-90.508,0.005c-24.996-24.996-24.996-65.505-0.005-90.496     l120.683-120.683c24.991-24.992,65.5-24.992,90.491,0c8.331,8.331,21.839,8.331,30.17,0c8.331-8.331,8.331-21.839,0-30.17     c-41.654-41.654-109.177-41.654-150.831,0L30.247,328.909c-41.654,41.654-41.654,109.177,0,150.831     c41.649,41.676,109.177,41.676,150.853,0l60.331-60.331c8.331-8.331,8.331-21.839,0-30.17S219.591,380.909,211.26,389.24z"/><path d="M479.751,30.24c-41.654-41.654-109.199-41.654-150.853,0l-72.384,72.384c-8.331,8.331-8.331,21.839,0,30.17     c8.331,8.331,21.839,8.331,30.17,0l72.384-72.384c24.991-24.992,65.521-24.992,90.513,0c24.991,24.991,24.991,65.5,0,90.491     L316.845,283.638c-24.992,24.992-65.5,24.992-90.491,0c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17     c41.654,41.654,109.177,41.654,150.831,0l132.736-132.736C521.405,139.418,521.405,71.894,479.751,30.24z"/></g></svg></div>
        <div class="_photo" @click="attachPhoto(undefined)"><svg class="_photo" xmlns="http://www.w3.org/2000/svg" width="19px" height="15px"><g transform="scale(0.8) translate(0, -2)"><path d="m14.134 3.65c.853 0 1.46.278 1.988.899.017.019.494.61.66.815.228.281.674.536.945.536h.41c2.419 0 3.863 1.563 3.863 4.05v5.85c0 2.241-2 4.2-4.273 4.2h-11.454c-2.267 0-4.223-1.953-4.223-4.2v-5.85c0-2.496 1.4-4.05 3.814-4.05h.409c.271 0 .717-.255.945-.536.166-.204.643-.796.66-.815.528-.621 1.135-.899 1.988-.899z"/><circle cx="12" cy="12" r="3.85"/></g></svg></div>
      </div>
    </DragNDropLoader>
  </div>
</template>

<script>
import ImageUploader from "../utils/imageUploader";
import {IMAGE_MAX_RES} from "../constants";
import DragNDropLoader from "./DragNDropLoader.vue";


const TIME_DIFF_TO_EMIT_CHANGE = 500; // ms

export default {
  components: {DragNDropLoader},
  emits: ['input', 'change', 'update:modelValue'],

  props: {
    modelValue: String,
    rows: {
      type: Number,
      default: 5
    },
    placeholder: String,
  },

  data() {
    return {
      cropSize: null,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, this.cropSize, this.compressSize),

      attachedImages: [],
      lastInputTime: Date.now(),
      timeout: null,
      changedFromEmit: false,
      stopEmitting: false,
    }
  },

  methods: {
    updateVModel(text) {
      const textSend = text || this.modelValue;
      this.$emit('input', textSend);
      this.$emit('update:modelValue', textSend);
    },

    /**
     * Ensace text in message-input between fragments of text
     *
     * @param leftText - text to add on left side
     * @param rightText - text to add on left side
     */
    encaseInputText(leftText, rightText = '') {
      let text = this.modelValue;
      const element = this.$refs.textarea;
      const start = element.selectionStart;
      const end = element.selectionEnd;
      if (start === end) {
        return;
      }
      const selected = leftText + text.substring(start, end) + rightText;
      text = text.substring(0, start) + selected + text.substring(end);
      element.focus();

      this.updateVModel(text)
      this.onInput();
    },

    /**
     * Ensace text lines in message-input between fragments of text
     *
     * @param leftText - text to add on begin of line
     * @param rightText - text to add on end of line
     */
    encaseInputLines(leftText, rightText = '') {
      let text = this.modelValue;
      const element = this.$refs.textarea;
      let start = element.selectionStart;
      let end = element.selectionEnd;
      start = text.substring(0, start).lastIndexOf('\n') + 1;
      if (start === -1) {
        start = 0;
      }
      const addToEndLength = text.substring(end).indexOf('\n');
      if (addToEndLength === -1) {
        end = text.length;
      } else {
        end += addToEndLength;
      }
      const selected = leftText + text.substring(start, end).replaceAll(/\n/g, rightText + '\n' + leftText) + rightText;
      text = text.substring(0, start) + selected + text.substring(end);
      element.focus();

      this.updateVModel(text)
      this.onInput();
    },

    async attachLink() {
      let text = this.modelValue;
      const element = this.$refs.textarea;
      const link = await this.$modal.prompt('Введите адрес ссылки');
      if (!link) {
        return;
      }
      const end = element.selectionEnd ? element.selectionEnd : 0;
      const name = await this.$modal.prompt('Теперь придумайте ей замещающий текст (необязательно)');
      if (!name) {
        text = text.substring(0, end) + ' ' + link + ' ' + text.substring(end);
        return;
      }
      text = text.substring(0, end) + `[${name}](${link})` + text.substring(end);

      this.updateVModel(text)
      this.onInput();
    },

    async attachPhoto(dataURL) {
      let text = this.modelValue;
      const element = this.$refs.textarea;

      let end = text.length;
      if (!dataURL)
        end = element.selectionEnd ? element.selectionEnd : 0;

      const imageId = await this.ImageUploader.upload(dataURL);

      text = text.substring(0, end) + '![image](' + this.$api.apiUrl + '/image/' + imageId + ')' + element.value.substring(end);

      this.updateVModel(text)
      this.onInput();
    },

    onInput() {
      this.changedFromEmit = true;

      if (this.stopEmitting)
        return;
      this.stopEmitting = true;


      this.timeout = setTimeout(() => {
        if (this.changedFromEmit) {
          this.emitChange();
        }
        this.stopEmitting = false;
      }, TIME_DIFF_TO_EMIT_CHANGE);
    },

    emitChange() {
      this.$emit('change', this.modelValue);
      this.changedFromEmit = false;
    }
  }
};
</script>

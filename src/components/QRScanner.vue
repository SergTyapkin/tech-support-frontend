<style lang="stylus" scoped>
@require '../styles/constants.styl'

video
  max-width 100%
</style>

<template>
  <div>
    <video class="roll-active" :class="{closed: closed}" ref="video"></video>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
import {closeRoll, openRoll} from "../utils/show-hide";

export default {
  emits: ['scan'],

  props: {
    closed: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      text: null,

      active: false,
      _scanner: null,
    };
  },

  mounted() {
    this._scanner = new QrScanner(this.$refs.video, (result) => {
      this.$emit('scan', result.data);
    }, {highlightScanRegion: true});
  },

  unmounted() {
    this._scanner.destroy();
  },

  methods: {
    start() {
      if (!this.active) {
        this._scanner.start().then(
            () => {},
            (error) => {
              this.$modal.alert("Не предоставлены права доступа к камере", "Настройте доступ к камере для этого сайта в браузере");
            }
        );
        this.active = true;
      }
    },

    stop() {
      this._scanner.stop();
      this.active = false;
    },

    show() {
      openRoll(this.$refs.video);
    },

    hide() {
      closeRoll(this.$refs.video);
    }
  }
};
</script>

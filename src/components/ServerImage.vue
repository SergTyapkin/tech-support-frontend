<style lang="stylus" scoped>

</style>

<template>
  <img v-if="imageId" class="image" :src="api_url + '/image/' + imageId" :alt="alt">
  <img v-else class="image" :src="defaultImageSrc" :alt="alt">
</template>

<script>
export default {
  props: {
    imageId: {
      type: Number,
      required: true,
    },
    defaultImageSrc: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'image',
    },
  },

  data() {
    return {
      api_url: this.$api.apiUrl,
    }
  }
}
</script>

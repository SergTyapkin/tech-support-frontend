<style lang="stylus" scoped>

</style>

<template>
  <img v-if="imageId" class="avatar" :src="api_url + '/image/' + imageId" alt="avatar">
  <img v-else class="avatar" src="../res/default_avatar.png" alt="avatar">
</template>

<script>
export default {
  props: {
    imageId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      api_url: this.$api.apiUrl,
    }
  }
}
</script>

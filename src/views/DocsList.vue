<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/constants.styl'

.list
  display flex
  flex-wrap wrap
  width 100%
  justify-content space-evenly
  list-style none
  margin 0
  padding 0
  margin-top 100px
  .info
    margin-top 200px
    font-large()
  .doc
    padding 10px 20px
    border-radius 10px
    margin 20px
    height 100%
    display flex
    flex-direction column
    padding-top 20px
    padding-bottom 20px
    transition all 0.2s ease
    &:hover
      background blocksBgColorHover
    .header
      border-bottom solid 1px borderColor
      font-large()
      color textColor1
    .info-characters
      padding 5px 0
      > *
        img
          width 24px
          margin-right 10px
        margin 5px 0
        display flex
        align-items center
        font-small()
        color textColor4
    .text
      font-small()
      color textColor3
</style>

<template>
  <ul class="list">
    <CircleLoading v-if="loading" class="info"></CircleLoading>

    <li v-else-if="!docs.length" class="info">Документации пока нет</li>

    <li v-for="doc in docs" class="doc">
      <router-link :to="{name: 'doc', params: {docId: doc.id}}">
        <div class="header">{{ doc.title }}</div>
        <div class="info-characters">
          <div><img src="../res/place.svg" alt="Place:">{{ doc.placename }}</div>
          <div><img src="../res/work.svg" alt="Work:">{{ doc.positionname }}</div>
        </div>
        <div class="text">{{ doc.text?.substring(0, 100) }}</div>
      </router-link>
    </li>
  </ul>
</template>

<script>
import CircleLoading from "../components/loaders/CircleLoading.vue";

export default {
  components: {CircleLoading},
  data() {
    return {
      loading: false,

      docs: [],
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$api.getDocs();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список документов');
      return;
    }

    this.docs = response.docs || [];
  }
}
</script>


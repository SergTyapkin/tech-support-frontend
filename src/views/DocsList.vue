<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/utils.styl'
@require '../styles/constants.styl'

.list
  display flex
  flex-wrap wrap
  width 100%
  justify-content space-evenly
  list-style none
  margin 0
  padding 0
  margin-bottom 20px
  @media ({desktop})
    margin-top 40px
    margin-bottom 40px
  .info
    margin-top 50px
    font-large()
    width 100%
    text-align center
  .doc
    block-clickable()
    block-dark-bg()
    width 100%
    max-width unset
    margin 20px
    display flex
    flex-direction column
    padding 0
    .link-container
      padding 30px
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

  .create-doc
    margin-top 30px
    block-clickable()
    background none
    border 2px dashed borderColor
    display flex
    align-items center
    justify-content center
    padding 10px
    width 50%
    img
      margin-right 10px
      width 40px
</style>

<template>
  <ul class="list">
    <CircleLoading v-if="loading" class="info"></CircleLoading>

    <li v-else-if="!docs.length" class="info">Документации пока нет</li>

    <li v-for="doc in docs" class="doc">
      <router-link :to="{name: 'doc', params: {docId: doc.id}}" class="link-container">
        <div class="header">{{ doc.title }}</div>
        <div class="info-characters">
          <div><img src="../res/place.svg" alt="Place:">{{ doc.placename }}</div>
          <div><img src="../res/work.svg" alt="Work:">{{ doc.positionname }}</div>
        </div>
        <div class="text">{{ $cropText(doc.text, 100) }}</div>
      </router-link>
    </li>

    <router-link :to="{name: 'createDoc'}" v-if="$user.isAdmin" class="create-doc">
      <img src="../res/plus.svg" alt="plus"><div class="text">Создать</div>
    </router-link>
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


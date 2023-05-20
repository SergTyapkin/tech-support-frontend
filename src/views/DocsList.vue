<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/utils.styl'
@require '../styles/buttons.styl'
@require '../styles/constants.styl'


.root-docs-list
  .loading
    margin 0 auto


.list
  display flex
  flex-wrap wrap
  width 100%
  justify-content space-evenly
  list-style none
  margin 0
  padding-left 0
  padding-right 0
  padding-top 0
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
    button-dashed()
    margin-top 10px
    margin-bottom 20px
    padding 10px
    width 50%
</style>

<template>
  <div class="root-docs-list">
    <CircleLoading v-if="loading" class="loading"></CircleLoading>
    <ul v-else class="list">
      <li v-if="!docs.length" class="info">Документации пока нет</li>

      <li v-for="doc in docs" class="doc">
        <router-link :to="{name: 'doc', params: {docId: doc.id}}" class="link-container">
          <div class="header">{{ doc.title }}</div>
          <div class="info-characters">
            <div><img src="../res/place.svg" alt="Place:">{{ doc.placename }}</div>
            <div><img src="../res/work.svg" alt="Work:">{{ doc.positionname }}</div>
          </div>
          <div class="text">{{ $cropText(cleanupMarkdownPreview(doc.text), 100) }}</div>
        </router-link>
      </li>

      <router-link :to="{name: 'createDoc'}" v-if="$user.canEditDocs" class="create-doc">
        <img src="../res/plus.svg" alt="plus"><div class="text">Создать</div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import CircleLoading from "../components/loaders/CircleLoading.vue";
import {cleanupMarkdownPreview} from "../utils/utils";

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

    this.$scroll.restore();
  },

  methods: {
    cleanupMarkdownPreview: cleanupMarkdownPreview,
  }
}
</script>


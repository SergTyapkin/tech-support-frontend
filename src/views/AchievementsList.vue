<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.root
  display flex
  flex-direction column
  .title
    display flex
    align-items center
    justify-content center
    font-large()
    width 100%
    padding 20px 20px 0
    margin-bottom 20px
    .text
      flex 1
      text-align center
    img
      width 40px
      height 40px
      opacity 0.8
      cursor pointer
      transition all 0.2s ease
      &:hover
        opacity 1
      &.hidden
        pointer-events none
        opacity 0
        width 0
  .achievements-list
    flex 1
    margin-bottom 20px
</style>

<template>
  <div class="root">
    <div class="title">
      <span class="text">Список всех достижений</span>
      <img :class="{hidden: !listAsCells}"
           src="../res/list_alt.svg"
           alt="list view"
           @click="listAsCells = false"
      >
      <img :class="{hidden: listAsCells}"
           src="../res/flex_wrap.svg"
           alt="cells view"
           @click="listAsCells = true"
      >
    </div>
    <AchievementsList class="achievements-list"
                      :preview-symbols-name="9999"
                      :preview-symbols-description="9999"
                      @select="(achievement) => {$router.push({name: 'achievement', params: {achievementId: achievement.id}})}"
                      @loaded="$scroll.restore()"
                      :as-cells="listAsCells"
    ></AchievementsList>
  </div>
</template>


<script>
import AchievementsList from "../components/AchievementsList.vue";


export default {
  components: {AchievementsList},

  data() {
    return {
      listAsCells: false,
    }
  },

  async mounted() {
  },

  methods: {
  }
}
</script>

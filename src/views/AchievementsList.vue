<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.root
  max-height 'calc(100% - %s)' % header-height
  @media ({mobile})
    max-height 'calc(100% - %s)' % header-height-mobile
    padding 0
  display flex
  flex-direction column
  .title
    font-large()
    text-align center
    width 100%
    padding-top 20px
    padding-bottom 0
    margin-bottom 20px
  .achievements-list
    flex 1
</style>

<template>
  <div class="root">
    <div class="title">Список всех достижений</div>
    <AchievementsList class="achievements-list scrollable"
                      :preview-symbols-name="9999"
                      :preview-symbols-description="9999"
                      @select="(achievement) => {$router.push({name: 'achievement', params: {achievementId: achievement.id}})}"
    ></AchievementsList>
  </div>
</template>


<script>
import AchievementsList from "../components/AchievementsList.vue";


export default {
  components: {AchievementsList},
  data() {
    return {
    }
  },

  async mounted() {
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.achievements-list
  overflow-y scroll
  block-dark-bg()
  padding 0
  .achievement
    padding 10px 10px
    display flex
    font-medium()
    transition all 0.2s ease
    cursor pointer
    &:hover
      background blocksBgColorHover
    .avatar
      width 60px
      height 60px
      min-width 60px
      min-height 60px
      border mix(textColor2, transparent) 1px solid
      border-radius(50%)
    .text
      padding 10px
      .name
        font-middle()
        color textColor1
        line-height 0.8
        white-space nowrap
      .description
        font-small-extra()
        color textColor3
</style>

<template>
  <div class="achievements-list">
    <CircleLoading v-if="loading"></CircleLoading>

    <div v-else v-for="achievement in achievements" @click="$emit('select', achievement)" class="achievement">
      <AchievementAvatar :image-id="achievement.imageid" class="avatar"></AchievementAvatar>
      <div class="text">
        <div class="name">{{ $cropText(achievement.name, 30) }}</div>
        <div class="description">{{ $cropText(cleanupMarkdownPreview(achievement.description), 60) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import AchievementAvatar from "./AchievementAvatar.vue";
import CircleLoading from "./loaders/CircleLoading.vue";
import {cleanupMarkdownPreview} from "../utils/utils";


export default {
  components: {CircleLoading, AchievementAvatar},

  emits: ['select'],
  // select(achievement)

  props: {
  },

  data() {
    return {
      loading: false,
      achievements: [],
    }
  },
  mounted() {
    this.getAllAchievements();
  },


  methods: {
    async getAllAchievements(force=false) {
      if (!force && this.achievements?.length)
        return;

      this.loading = true;
      const achievements = await this.$api.getAchievements();
      this.loading = false;

      if (!achievements.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список всех достижений");
        return;
      }
      this.achievements = achievements.achievements;
      console.log(this.achievements)
    },

    cleanupMarkdownPreview: cleanupMarkdownPreview,
  }
}
</script>

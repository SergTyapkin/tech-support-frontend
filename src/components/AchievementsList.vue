<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.achievements-list
  block-dark-bg()
  padding 0
  display flex
  justify-content space-evenly
  flex-wrap wrap
  .achievement
    width 100%
    max-width 100vw
    padding 10px 10px
    display flex
    font-medium()
    transition all 0.5s ease
    cursor pointer
    &:hover
      background blocksBgColorHover
    .avatar
      width 60px
      height 60px
      min-width 60px
      min-height 60px
      --border-color-achievement mix(textColor2, transparent)
      --border-width 1px
    .text
      padding 10px
      transition all 0.2s ease
      max-width 100vw
      max-height 100vh
      .name
        font-middle()
        color textColor1
        line-height 0.8
      .description
        font-small-extra()
        color textColor3

  &.as-cells
    padding 20px
    .achievement
      max-width 80px
      overflow hidden
      border-radius(10px)
      .text
        opacity 0
        max-width 0
        max-height 0
        padding 0
</style>

<template>
  <div class="achievements-list" :class="{'as-cells': asCells}">
    <CircleLoading v-if="loading"></CircleLoading>

    <div v-else v-for="achievement in achievements" @click="$emit('select', achievement)" class="achievement">
      <Achievement :image-id="achievement.imageid" :special="achievement.special" no-level class="avatar" size="60px"></Achievement>
      <div class="text">
        <div class="name">{{ $cropText(achievement.name, previewSymbolsName) }}</div>
        <div class="description">{{ $cropText(cleanupMarkdownPreview(achievement.description), previewSymbolsDescription) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Achievement from "./Achievement.vue";
import CircleLoading from "./loaders/CircleLoading.vue";
import {cleanupMarkdownPreview} from "../utils/utils";


export default {
  components: {CircleLoading, Achievement},

  emits: ['select', 'loaded'],
  // select(achievement)

  props: {
    previewSymbolsName: {
      type: Number,
      default: 30,
    },
    previewSymbolsDescription: {
      type: Number,
      default: 60,
    },
    asCells: Boolean,
  },

  data() {
    return {
      loading: false,
      achievements: [],
    }
  },
  async mounted() {
    await this.getAllAchievements();
    this.$emit('loaded');
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

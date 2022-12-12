<style lang="stylus" scoped>
@import "../styles/constants.styl"

.quest-container
  width 100%
  padding 20px
  padding-bottom 40px
  padding-top 0
  display flex
  flex-wrap wrap
  justify-content space-evenly
  @media ({mobile})
    padding-left 0
    padding-right 0
    padding-top 0
    > *
      margin-left 10px
      margin-right 10px
    > *:first-child
      margin-top 0

.root
  position relative
  .loading
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
</style>

<template>
  <div class="root">
    <div class="quest-container">
      <Quest v-for="quest in quests" v-bind="quest"></Quest>
    </div>
    <CircleLoading v-if="loading" class="loading"></CircleLoading>
  </div>
</template>


<script>
import Quest from "../components/Quest.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";


const QUEST_WIDTH = 420; //px
const QUEST_HEIGHT = 220; //px
const HEADER_HEIGHT = 200; //px

export default {
  components: {CircleLoading, Quest},

  props: {
    getQuestsFoo: {
      type: Function,
      required: true,
    },
    args: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      quests: [],
      loading: false,
    }
  },

  async mounted() {
    const placeholdersInRow = Math.floor(window.innerWidth / QUEST_WIDTH) || 1;
    const placeholdersInCol = Math.ceil((window.innerHeight - HEADER_HEIGHT) / QUEST_HEIGHT);
    const questsPlaceholdersCount = placeholdersInCol * placeholdersInRow;

    for (let i = questsPlaceholdersCount; i > 0; i--) {
      this.quests.push({isPlaceholder: true});
    }

    this.loading = true;
    const res = await this.getQuestsFoo(...this.args);
    this.loading = false;

    if (!res.ok_) {
      this.$popups.error(`Не удалось получить квесты`, `Ошибка ${res.status}: ${res.info}`);
      return;
    }
    this.quests = res.quests;
  },
}
</script>

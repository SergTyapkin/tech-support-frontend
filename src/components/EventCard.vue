<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/buttons.styl'

borderRadius = 5px
width = 200px
height = 300px

.root
  width width
  height height
  border solid 1px colorBorder
  border-radius borderRadius
  .header
    border-bottom solid 1px colorBorder
    .text
      text-large()
      color textColor1
    .time
      color textColor2

  .main
    > *
      font-small()
      color textColor3

</style>

<template>
  <div class="root">
    <header class="header">
      <div class="text">{{ name }}</div>
      <div class="time">{{ date }} ({{timeStart}} - {{timeEnd}})</div>
    </header>
    <main class="main">
      <span class="description">{{ description }}</span>
      <span class="place">Place: {{ placeId }}</span>
      <span class="time">Event time: {{eventTimeStart}} - {{eventTimeEnd}}</span>
      <span class="people">People needs: {{needPeopleTotal}}</span>
    </main>

    <CircleLoading v-if="loading"></CircleLoading>
    <div v-else-if="!isYouParticipated" class="button-participate" @click="participate">Участвовать</div>
    <div v-else class="button-not-participate" @click="notParticipate">Не пойду</div>
  </div>
</template>

<script>
import CircleLoading from "./loaders/CircleLoading";
export default {
  components: {CircleLoading},
  props: {
    id: Number,
    name: String,
    description: String,
    date: String,
    timeStart: String,
    timeEnd: String,
    eventTimeStart: String,
    eventTimeEnd: String,
    needPeople: Object,
    placeId: Number,
  },

  data() {
    return {
      loading: false,

      needPeopleTotal: Object.keys(this.$props.needPeople).length,

      isYouParticipated: false,
    }
  },

  methods: {
    async participate() {
      this.loading = true;
      const res = await this.$api.participateInEvent(id, this.$user.id, 0);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие");
        return;
      }
      this.isYouParticipated = true;
    },

    async notParticipate() {
      this.loading = true;
      const res = await this.$api.notParticipateInEvent(id, this.$user.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось отказаться от мероприятия");
        return;
      }
      this.isYouParticipated = false;
    }
  }
};
</script>

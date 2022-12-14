<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'

.button-participate
  button-submit()
.button-not-participate
  button-danger()
</style>

<template>
  <div>
    <FormExtended :fields="[]">
      <div>{{event.name}}</div>
      <div>{{event.placename}}</div>
      <div>{{event.date}}</div>

      <CircleLoading v-if="loading"></CircleLoading>
      <div v-else-if="!event.isyouparticipate" class="button-participate" @click="participate">Участвовать</div>
      <div v-else class="button-not-participate" @click="notParticipate">Не пойду</div>
    </FormExtended>
  </div>
</template>


<script>
import FormExtended from "/src/components/FormExtended.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";

export default {
  components: {CircleLoading, FormExtended},

  data() {
    return {
      loading: true,

      event: {},

      eventId: this.$route.params.eventId,
    }
  },

  async mounted() {
    if (this.eventId === undefined) {
      this.$popups.error("Ошибка", "id события нет в строке запроса");
      this.$router.push({name: "default"});
      return;
    }
    this.loading = true;
    const response = await this.$api.getEventById(this.eventId);
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
      return;
    }

    this.event = response;
  },


  methods: {
    async participate() {
      this.loading = true;
      const res = await this.$api.participateInEvent(this.eventId, this.$user.id, 1);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие");
        return;
      }
      this.event.isyouparticipate = true;
    },

    async notParticipate() {
      this.loading = true;
      const res = await this.$api.notParticipateInEvent(this.eventId, this.$user.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось отказаться от мероприятия");
        return;
      }
      this.event.isyouparticipate = false;
    }
  }
}
</script>

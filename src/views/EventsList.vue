<style lang="stylus" scoped>
@require '../styles/constants.styl'

.events-list
  display flex
  width 100%
  justify-content space-between
</style>

<template>
  <div>
    <ul class="events-list">
      <li v-for="event in events">
        <EventCard v-bind="event"></EventCard>
      </li>
    </ul>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import FormExtended from "/src/components/FormExtended.vue";
import EventCard from "../components/EventCard.vue";

export default {
  components: {EventCard, FormExtended, Form},

  data() {
    return {
      loading: true,

      events: undefined,

      userId: this.$route.query.userId,
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$api.getEvents({});
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
      return;
    }

    this.events = response;
  },

  methods: {
  }
}
</script>

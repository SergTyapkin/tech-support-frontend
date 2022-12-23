<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

.events-list
  display flex
  flex-wrap wrap
  width 100%
  justify-content space-evenly
  list-style none
  margin 0
  padding 0
  margin-top 100px
  .info
    margin-top 200px
    font-large()
  .card
    margin 20px
</style>

<template>
  <div>
    <ul class="events-list">
      <li v-if="!events?.length" class="info">Событий не найдено</li>

      <li v-else v-for="event in events" class="card">
        <EventCard :name="event.name"
                   :date="event.date"
                   :id="event.id"
                   :description="event.description"
                   :event-time-start="event.eventtimestart"
                   :event-time-end="event.eventtimeend"
                   :time-start="event.timestart"
                   :time-end="event.timeend"
                   :need-people="event.needpeople"
                   :place-name="event.placename"
                   :place-id="event.placeid"
                   :author-name="event.authorname"
                   :author-id="event.authorid"
        ></EventCard>
      </li>
    </ul>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import FormExtended from "/src/components/FormExtended.vue";
import EventCard from "../components/EventCard.vue";
import {BASE_URL_PATH} from "../constants";
import {nextTick} from "vue";
import {dateToStr, timeToStr} from "../utils/utils";

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
    await this.init();
  },

  methods: {
    async init() {
      this.loading = true;
      let response;
      if (this.userId === undefined)
        response = await this.$api.getEvents({});
      else
        response = await this.$api.getEvents({participantId: this.userId});
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
        return;
      }

      this.events = response.events;
    }
  },

  watch: {
    '$route.query.userId': {
      handler: async function (to, from) {
        if (this.$route.path !== BASE_URL_PATH + '/events') // go to another page
          return;

        this.userId = to;
        await nextTick();
        await this.init();
      },
      deep: true,
    },

    events: {
      handler: function (to, from) {
        this.events.forEach((event) => {
          event.date = dateToStr(event.date);
          event.eventtimestart = timeToStr(event.eventtimestart);
          event.eventtimeend = timeToStr(event.eventtimeend);
          event.timestart = timeToStr(event.timestart);
          event.timeend = timeToStr(event.timeend);
        })
      }
    }
  }
}
</script>

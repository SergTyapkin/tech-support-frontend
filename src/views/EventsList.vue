<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

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

  .create-event
    block-clickable()
    block-dark-bg()
    background none
    border 2px dashed borderColor
    display flex
    align-items center
    justify-content center
    width 300px
    min-height 300px
    img
      margin-right 10px
      width 40px
</style>

<template>
  <div>
    <ul class="events-list">
      <li v-if="!events?.length" class="info">Событий нет</li>

      <li v-else v-for="event in events" class="card">
        <EventCard :name="event.name"
                   :date="event.date"
                   :id="event.id"
                   :description="event.description"
                   :event-time-start="event.eventtimestart"
                   :event-time-end="event.eventtimeend"
                   :time-start="event.timestart"
                   :time-end="event.timeend"
                   :need-people="event.peopleneeds"
                   :participations-count="event.participationscount"
                   :place-name="event.placename"
                   :place-id="event.placeid"
                   :author-name="event.authorname"
                   :author-id="event.authorid"
        ></EventCard>
      </li>

      <router-link :to="{name: 'createEvent'}" class="card create-event">
        <img src="../res/plus.svg" alt="plus">
        <div class="text">Создать</div>
      </router-link>
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

      this.events = response.events || [];
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

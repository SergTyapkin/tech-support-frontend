<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.search-input
  flex 1

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
    font-large()
    width 100%
    text-align center
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

@media ({mobile})
  .filters
    > *
      width 100%

.loading
  width 100%
</style>

<template>
  <div>
    <Filters :filters="filters" @change="onChangeFilters" class="filters">
      <FloatingInput placeholder="Название мероприятия" no-info class="search-input" v-model="searchText" @input="getEvents"></FloatingInput>
      <SelectList v-model="placeSearch" @input="getEvents" :list="allPlaces" :selected-id="-1" title="Место проведения" solid></SelectList>
    </Filters>

    <ul class="events-list">
      <li v-if="loading" class="loading">
        <CircleLoading></CircleLoading>
      </li>

      <li v-else-if="!events?.length" class="info">Событий нет</li>

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

      <router-link :to="{name: 'createEvent'}" class="card create-event" v-if="$user.isAdmin">
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
import Filters from "../components/Filters.vue";
import FloatingInput from "../components/FloatingInput.vue";
import SelectList from "../components/SelectList.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import {BASE_URL_PATH} from "../constants";
import {nextTick} from "vue";
import {cleanupMarkdownPreview, dateToStr, timeToStr} from "../utils/utils";


export default {
  components: {CircleLoading, SelectList, FloatingInput, Filters, EventCard, FormExtended, Form},

  data() {
    return {
      loading: true,

      events: undefined,

      userId: this.$route.query.userId,

      allPlaces: [],

      filters: [{id: 0, name: 'Прошедшие'}, {id: 1, name: 'Все'}, {id: 2, name: 'Предстояшие', value: true}],
      searchText: '',
      placeSearch: undefined,
    }
  },

  async mounted() {
    this.getPlaces();
    this.init();
  },

  methods: {
    async init() {
      await this.getEvents();
    },

    onChangeFilters(filter) {
      // Drop all other filters
      this.filters.forEach((filt) => {
        if (filt !== filter)
          filt.value = false;
      });

      this.getEvents();
    },

    async getEvents() {
      const filtersObj = {};

      if (this.filters[0].value) {
        filtersObj.type = "past";
      } else if (this.filters[1].value) {
        ;
      } else if (this.filters[2].value) {
        filtersObj.type = "next";
      }

      if (this.searchText)
        filtersObj.search = this.searchText;

      if (this.placeSearch !== undefined && this.placeSearch.id !== -1)
        filtersObj.placeId = this.placeSearch.id;


      this.loading = true;
      let response;
      if (this.userId === undefined) {
        response = await this.$api.getEvents(filtersObj);
      } else {
        filtersObj.participantId = this.userId;
        response = await this.$api.getEvents(filtersObj);
      }
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
        return;
      }

      this.events = response.events || [];
    },

    async getPlaces() {
      this.loading = true;
      const response = await this.$api.getPlaces();
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список мест проведения мероприятий. " + (response.info || ""));
        return;
      }

      response.places.push({id: -1, name: "---"});
      console.log(response.places);
      this.allPlaces = response.places;
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
          event.description = cleanupMarkdownPreview(event.description);
        })
      }
    }
  }
}
</script>

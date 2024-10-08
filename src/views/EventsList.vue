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

.filters-container
  block()
  .top-row
    display flex
    gap 40px
    .filters
      padding 0
    .select-lists-container
      width 30%
      display flex
      flex-direction column-reverse
      gap 20px

@media ({mobile})
  .filters-container
    .top-row
      flex-direction column
      .filters
        > *
          width 100%
      .select-lists-container
        width 100%

.academy-filters
  padding 0
  padding-top 10px

.loading
  width 100%
</style>

<template>
  <div>
    <div class="filters-container">
      <div class="top-row">
        <Filters class="filters"
                 :filters="filters"
                 @change="onChangeFilters"
                 radio
                 can-be-none
                 storing-name="eventsList"
        >
          <FloatingInput placeholder="Поиск по названию" no-info class="search-input" v-model="searchText" @input="getEvents"></FloatingInput>
          <Filters :filters="reversedOrderFilters"
                   can-be-none
                   @change="(filter) => {
                     this.isReversedEventsOrder = filter.value;
                     this.events?.reverse();
                   }"
                   storing-name="eventsListReversedOrder"
                   class="filters-newers-first"
          ></Filters>
        </Filters>
        <div class="select-lists-container">
          <SelectList class="period-list" ref="periodSearch" v-model="periodSearch" @input="getEvents" :list="allPeriods" :selected-id="-1" title="За период" solid></SelectList>
          <SelectList class="place-list" ref="placeSearch" v-model="placeSearch" @input="getEvents" :list="allPlaces" :selected-id="-1" title="Поиск по месту" solid></SelectList>
        </div>
      </div>


      <div class="bottom-row">
        <Filters :filters="isAcademyFilters"
                 can-be-none
                 @change="getEvents()"
                 storing-name="eventsListIsAcademy"
                 class="academy-filters"
                 radio
        ></Filters>
      </div>
    </div>

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
                   :is-academy="event.isacademy"
        ></EventCard>
      </li>
    </ul>

    <router-link v-if="$user.canEditEvents" :to="{name: 'createEvent'}"><FloatingButton title="Создать"><img src="../res/plus_bold.svg" alt="plus"></FloatingButton></router-link>
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
import FloatingButton from "../components/FloatingButton.vue";


export default {
  components: {FloatingButton, CircleLoading, SelectList, FloatingInput, Filters, EventCard, FormExtended, Form},

  data() {
    return {
      loading: true,

      events: undefined,
      isReversedEventsOrder: false,

      userId: this.$route.query.userId,

      allPlaces: [],
      allPeriods: [],

      filters: [{id: 0, name: 'Прошедшие'}, {id: 1, name: 'Предстояшие', value: true}],
      reversedOrderFilters: [{name: 'Сначала новые'}],
      isAcademyFilters: [{id: 0, name: 'Академии'}, {id: 1, name: 'Мероприятия'}],
      searchText: '',
      placeSearch: undefined,
      periodSearch: undefined,
    }
  },

  async mounted() {
    await this.getPeriods();
    const dateNow = new Date();
    let periodIdx;
    const currentPeriod = this.allPeriods.find((period, idx) => {
      periodIdx = idx;
      return (
        new Date(period.datestart) <= dateNow &&
        new Date(period.dateend) > dateNow
      )
    });
    if (currentPeriod !== undefined) {
      this.$refs.periodSearch.selectItem(periodIdx);
    }

    this.getPlaces();
    this.init();
  },

  methods: {
    async init() {
      await this.getEvents();
      this.$scroll.restore();
    },

    onChangeFilters(filter) {
      if (filter.id === 1) {
        this.isReversedEventsOrder = false;
        this.reversedOrderFilters[0].value = false;
      } else {
        this.isReversedEventsOrder = true;
        this.reversedOrderFilters[0].value = true;
      }
      this.getEvents();
    },

    async getEvents() {
      const filtersObj = {};

      if (this.filters[0].value) {
        filtersObj.type = "past";
      } else if (this.filters[1].value) {
        filtersObj.type = "next";
      }

      if (this.searchText) {
        filtersObj.search = this.searchText;
      }

      if (this.placeSearch !== undefined && this.placeSearch.id !== -1) {
        filtersObj.placeId = this.placeSearch.id;
      }

      if (this.periodSearch !== undefined && this.periodSearch.id !== -1) {
        filtersObj.dateStart = this.periodSearch.datestart;
        filtersObj.dateEnd = this.periodSearch.dateend;
      }

      if (this.isAcademyFilters[0].value) {
        filtersObj.typeAcademy = "academy";
      } else if (this.isAcademyFilters[1].value) {
        filtersObj.typeAcademy = "events";
      }


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
      if (this.isReversedEventsOrder)
        this.events.reverse();
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
      this.allPlaces = response.places;
    },

    async getPeriods() {
      this.loading = true;
      const response = await this.$api.getPeriods();
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список временных периодов. " + (response.info || ""));
        return;
      }

      response.periods.push({id: -1, name: "Всё время"});
      this.allPeriods = response.periods;
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

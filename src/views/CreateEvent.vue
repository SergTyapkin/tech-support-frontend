<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/buttons.styl'
@require '../styles/utils.styl'


.root
  width 100%
  .newEventForm
    margin 20px auto
    display flex
    width 100%
    max-width 1400px
    @media ({mobile})
      padding 5px
      flex-direction column

    .left-column
    .right-column
      padding 15px
      margin 0

    .left-column
      flex 1
      .error-text
        color colorNo
        font-small()
      .description
        textarea()
        height 300px
      .timeNewEvent
        margin-top 10px
        display flex
        justify-content space-between
        > *
          flex 0.3

    .right-column
      .submit-input
        all unset
        margin-top 40px
        button-submit()
</style>

<template>
  <div class="root">
    <Form class="newEventForm" ref="form">
      <div class="left-column">
        <div v-if="errorText" class="error-text">{{ errorText }}</div>
        <FloatingInput v-model="name" title="Название" class="nameNewEvent"></FloatingInput>
        <textarea v-model="description" placeholder="Описание - что надо будет делать" class="description"></textarea>
        <div class="timeNewEvent">
          <FloatingInput v-model="date" type="date" title="Дата" class="inputDT"></FloatingInput>
          <FloatingInput v-model="timeEventStart" type="time" title="Начало в" class="inputDT"></FloatingInput>
          <FloatingInput v-model="timeEventEnd" type="time" title="Конец в" class="inputDT"></FloatingInput>
        </div>
      </div>
      <div class="right-column">
        <FloatingInput v-model="timeStart" title="Приходить с" type="time" class="right-input"></FloatingInput>
        <FloatingInput v-model="timeEnd" title="Оставаться до" type="time" class="right-input"></FloatingInput>
        <FloatingInput v-model="peopleNeeds" title="Сколько людей нужно" type="number" class="right-input"></FloatingInput>
        <SelectList v-model="place" :list="allPlaces" title="Место проведения"  class="right-input" solid></SelectList>
        <input class="submit-input" value="Создать" type="submit" @click="createEvent">
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "../components/Form.vue";
import FloatingInput from "../components/FloatingInput.vue";
import SelectList from "../components/SelectList.vue";


export default {
  components: {SelectList, FloatingInput, Form},

  data() {
    return {
      name: undefined,
      description: undefined,
      date: undefined,
      timeStart: undefined,
      timeEnd: undefined,
      timeEventStart: undefined,
      timeEventEnd: undefined,
      peopleNeeds: undefined,

      allPlaces: [],
      place: undefined,

      loading: false,
      errorText: undefined,
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$api.getPlaces();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error("Ошибка", "Не удалось получить список мест проведения мероприятий. " + response.info || "");
      return;
    }
    this.allPlaces = response.places;
  },

  methods: {
    validate() {
      let ok = false;
      if (!this.name) {
        this.errorText = "Введите название события";
      } else if (!this.date) {
        this.errorText = "Введите дату события";
      } else if (!this.timeStart) {
        this.errorText = "Введите время к которому приходить";
      } else if (!this.timeEnd) {
        this.errorText = "Введите время, когда можно уйти";
      } else if (!this.place) {
        this.errorText = "Выберите место проведения мероприятия";
      } else {
        ok = true;
      }
      return ok;
    },

    async createEvent() {
      if (!this.validate()) {
        this.$refs.form.showError();
        return;
      }

      this.loading = true;
      const response = await this.$api.createEvent(this.name, this.description, this.date, this.timeStart, this.timeEnd, this.place.id, this.timeEventStart, this.timeEventEnd, this.peopleNeeds);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось создать мероприятие');
        return;
      }

      const createdEventId = response.id;
      this.$router.push({name: "event", params: {eventId: createdEventId}});
    }
  }
}
</script>


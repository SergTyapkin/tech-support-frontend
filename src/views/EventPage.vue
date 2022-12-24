<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'

.root
 width 100%
.form-event
  margin 20px auto
  width 100%
  max-width 800px
  .event-info
    display flex
    .left-description
      border-right 2px solid borderColorDark
      padding-right 10px
    .right-description
      flex 1
      padding-left 10px
      .input-info
        font-small()
        color textColor4

    .main-info
      padding-top 12px

      border-radius 7px
      background colorShadowLight-x
      border colorShadowLight 1px solid
      margin-bottom 20px
      //.input-info
      //  font-small()
      //  color textColor4
      //  margin-bottom 0
      //  padding-left 10px
      .input:not(:last-of-type)
        margin-bottom 20px
    .textarea
      textarea()
      margin-top 10px
      resize none
      height 300px

  .buttons
    display flex
    .button-submit
      flex 0.5
      margin-right 20px
    .button-participate
      flex 1
      button-submit()
      width unset
      &.not
        button-danger()
</style>

<template>
  <div class="root">
    <Form :noSubmit="!$user.isAdmin" class="form-event" :class="{'is-admin': $user.isAdmin}" @submit="updateEventData">
      <div class="event-info">
        <div class="left-description">
          <div class="main-info">
<!--            <div class="input-info">Что?</div>-->
            <FloatingInput v-model="event.name" title="Название" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
<!--            <div class="input-info">А где?</div>-->
            <FloatingInput v-model="event.placename" list="places" title="Место проведения" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <datalist id="places">
              <option v-for="place in allPlaces">{{place.name}}</option>
            </datalist>
          </div>

          <div class="main-info">
<!--            <div class="input-info">И когда?</div>-->
            <FloatingInput v-model="event.date" type="date" title="Дата проведения" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timestart" type="time" title="Приходить c" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timeend" type="time" title="Оставаться до" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
          </div>

<!--          <div class="input-info">Кто вообще такое придумал?</div>-->
          <FloatingInput v-model="event.authorname" title="Автор мероприятия" readonly no-info class="input"></FloatingInput>
<!--          <div class="input-info">Дайте-ка мне его номерочек!</div>-->
          <FloatingInput v-model="event.authoremail" title="Связь с автором" readonly no-info class="input"></FloatingInput>
        </div>
        <div class="right-description">
          <div class="input-info">А что мы будем делать?</div>
          <textarea class="textarea scrollable" :readonly="!$user.isAdmin">{{event.description}}</textarea>
        </div>
      </div>

      <div class="buttons">
        <input v-if="!$user.isAdmin" :disabled="!isEdited" type="submit" value="Сохранить" class="button-submit">

        <CircleLoading v-if="loading"></CircleLoading>
        <div v-else-if="!event.isyouparticipate" class="button-participate" @click="participate">Пойду</div>
        <div v-else class="button-participate not" @click="notParticipate">Не пойду</div>
      </div>
    </Form>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";

export default {
  components: {CircleLoading, Form, FloatingInput},

  data() {
    return {
      loading: true,

      event: {},

      allPlaces: [],

      eventId: this.$route.params.eventId,

      isEdited: false,
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

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
      return;
    }

    this.event = response;

    const allPlaces = await this.$api.getPlaces();
      this.loading = false;

    if (!allPlaces.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мест проведения мероприятий');
      return;
    }

    this.allPlaces = allPlaces;
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
    },

    async updateEventData() {
      // TODO
    }
  }
}
</script>

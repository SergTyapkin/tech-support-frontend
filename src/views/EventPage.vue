<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'


.root
  width 100%
  display flex
  align-items center
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
        .usTableBorder
          padding 10px
          margin-top 20px
          display flex
          flex-direction column
          align-items center
          min-width 420px

      .main-info
        padding-top 12px

        border-radius 7px
        background colorShadowLight-x
        border colorShadowLight 1px solid
        margin-bottom 20px
        .input:not(:last-of-type)
          margin-bottom 20px
      .textarea
        textarea()
        margin-top 10px
        resize none

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
  <div class="root" css-fullheight @input="onChange">
    <Form :noSubmit="!$user.isAdmin" class="form-event" :class="{'is-admin': $user.isAdmin}" @submit="updateEventData">
      <div class="event-info">
        <div class="left-description">
          <div class="main-info">
            <FloatingInput v-model="event.name" title="Название" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <SelectList v-model="place" @click="onChange" :selected-id="event.placeid" :list="allPlaces" title="Место проведения" solid :readonly="!$user.isAdmin" class="input"></SelectList>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.date" type="date" title="Дата проведения" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timestart" type="time" title="Приходить c" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timeend" type="time" title="Оставаться до" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.eventtimestart" type="time" title="Начало мероприятия" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.eventtimeend" type="time" title="Конец мероприятия" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
          </div>

          <FloatingInput v-model="event.authorname" title="Автор мероприятия" readonly no-info class="input"></FloatingInput>
          <FloatingInput v-model="event.authoremail" title="Связь с автором" readonly no-info class="input"></FloatingInput>
        </div>
        <div class="right-description">
          <div class="input-info">А что мы будем делать?</div>
          <textarea class="textarea scrollable" :readonly="!$user.isAdmin">{{event.description}}</textarea>
          
          <div class="usTableBorder">
			      <UsersTable class="usTable"></UsersTable>
			    </div>
        </div>
      </div>

      <div class="buttons">
        <input v-if="$user.isAdmin" :disabled="!isEdited" type="submit" value="Сохранить" class="button-submit">

        <CircleLoading v-if="loading"></CircleLoading>
        <div v-else-if="!event.isyouparticipate && event.isnext" class="button-participate" @click="participate">Пойду</div>
        <div v-else-if="event.isnext" class="button-participate not" @click="notParticipate">Не пойду</div>
      </div>
    </Form>

    <FloatingButton v-if="isEdited" title="Сохранить" green @click="updateEventData">
      <img src="../res/save.svg" alt="save">
    </FloatingButton>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";
import FloatingButton from "../components/FloatingButton.vue";
import SelectList from "../components/SelectList.vue";
import UsersTable from "../components/UsersTable.vue";


export default {
  components: {SelectList, FloatingButton, CircleLoading, Form, FloatingInput, UsersTable},

  data() {
    return {
      eventId: this.$route.params.eventId,

      event: {},
      place: undefined,

      allPlaces: [],

      loading: true,
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
    let response = await this.$api.getEventById(this.eventId);
    this.loading = false;
    if (!response.ok_) {
      this.$popups.error("Ошибка", "Не удалось получить список мероприятий. " + response.info || "");
      return;
    }
    this.event = response;

    this.loading = true;
    response = await this.$api.getPlaces();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error("Ошибка", "Не удалось получить список мест проведения мероприятий. " + response.info || "");
      return;
    }
    this.allPlaces = response.places;
  },


  methods: {
    async participate() {
      this.loading = true;
      const res = await this.$api.participateInEvent(this.eventId, this.$user.id, 1);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие. " + (res.info || ""));
        return;
      }
      this.event.isyouparticipate = true;
    },

    async notParticipate() {
      this.loading = true;
      const res = await this.$api.notParticipateInEvent(this.eventId, this.$user.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось отказаться от мероприятия. " + (res.info || ""));
        return;
      }
      this.event.isyouparticipate = false;
    },

    async updateEventData() {
      this.loading = true;
      const res = await this.$api.editEvent(this.eventId, this.event.name, this.event.description, this.event.date, this.event.timestart, this.event.timeend, this.place.id, this.event.eventtimestart, this.event.eventtimeend);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось изменить мероприятие. " + (res.info || ""));
        return;
      }
      window.onbeforeunload = null;
      this.isEdited = false;
    },

    onChange() {
      window.onbeforeunload = () => true;
      this.isEdited = true;
    },
  },
}
</script>

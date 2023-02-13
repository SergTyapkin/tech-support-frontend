<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'


.root
  width 100%
  display flex
  align-items center
  .form-event
    margin 20px auto
    width 100%
    max-width 1400px
    @media ({mobile})
      padding 10px
    .event-info
      display flex
      @media ({mobile})
        flex-direction column
      .left-description
        border-right 2px solid borderColorDark
        padding-right 20px
        @media ({mobile})
          border-right none
          border-bottom 2px solid borderColorDark
          padding-right 0
          padding-bottom 10px
        .user-link
          cursor pointer
          pointer-events all
          &:hover
            transition all 0.2s ease
            filter brightness(2)

      .right-description
        flex 1
        padding-left 30px
        display flex
        flex-direction column
        @media ({mobile})
          padding-left 0
          padding-top 20px
        .input-info
          font-small()
          color textColor4
        .users-table
          width 100%
          margin 20px auto

      .main-info
        padding-top 12px

        border-radius(7px)
        background colorShadowLight-x
        border colorShadowLight 1px solid
        margin-bottom 20px
        .input:not(:last-of-type)
          margin-bottom 20px
      .info
        font-small()
        color textColor4

    .buttons
      display flex
      .button-submit
        flex 0.5
        margin-right 20px
      .button-participate-group
        flex 1
        display flex
        gap 20px
        @media ({mobile})
          flex-direction column
      .button-participate
        button-submit()
        &.not
          button-danger()
    .button-delete
      button-danger()
      display flex
      align-items center
      justify-content center
      width min-content
      padding 10px 20px
      img
        width 30px
</style>

<template>
  <div class="root" css-fullheight @input="onChange">
    <Form :noSubmit="!$user.isAdmin" class="form-event" :class="{'is-admin': $user.isAdmin}" @submit="updateEventData">
      <div class="event-info">
        <div class="left-description">
          <div class="main-info">
            <FloatingInput v-model="event.name" title="Название" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <SelectList v-model="place" @input="onChange" :selected-id="event.placeid" :list="allPlaces" title="Место проведения" solid :readonly="!$user.isAdmin" class="input"></SelectList>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.date" type="date" title="Дата проведения" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timestart" type="time" title="Приходить c" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timeend" type="time" title="Оставаться до" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.peopleneeds" type="number" title="Людей необходимо" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.eventtimestart" type="time" title="Начало мероприятия" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.eventtimeend" type="time" title="Конец мероприятия" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
          </div>

          <FloatingInput v-model="event.authorname" title="Автор мероприятия" readonly no-info class="input"></FloatingInput>
          <a :href="`https://t.me/${event.authortelegram}`" target="_blank" class="user-link">
            <FloatingInput :model-value="`@${event.authortelegram}`" title="Связь с автором" readonly no-info class="input"></FloatingInput>
          </a>
        </div>

        <div class="right-description">
          <div class="input-info">А что мы будем делать?</div>
          <MarkdownRedactor v-if="$user.isAdmin" class="redactor" @input="onChange" @change="$refs.renderer?.update" ref="text" v-model="event.description" placeholder="Описание"></MarkdownRedactor>
          <div class="info" v-if="$user.isAdmin">Превью</div>
          <MarkdownRenderer class="renderer" ref="renderer"></MarkdownRenderer>

          <UsersTable class="users-table" :users-lists="[{participations: event.participations}]" @change.stop="" @input.stop="" can-delete></UsersTable>
        </div>
      </div>

      <div class="buttons">
        <CircleLoading v-if="loading"></CircleLoading>
        <div v-else-if="!event.isyouparticipate && event.isnext" class="button-participate-group">
          <div class="button-participate" @click="participate">Пойду</div>
          <SelectList v-model="position" :list="allPositions" title="Чем займёшься" solid class="input"></SelectList>
        </div>
        <div v-else-if="event.isnext" class="button-participate not" @click="notParticipate">Не пойду</div>
      </div>
      <div v-if="$user.isAdmin" class="button-delete" @click="deleteEvent"><img src="../res/trash.svg" alt="delete">Удалить</div>
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
import MarkdownRedactor from "../components/MarkdownRedactor.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";


export default {
  components: {
    MarkdownRenderer,
    MarkdownRedactor, SelectList, FloatingButton, CircleLoading, Form, FloatingInput, UsersTable},

  data() {
    return {
      eventId: this.$route.params.eventId,

      event: {},
      position: undefined,
      place: undefined,

      allPlaces: [],
      allPositions: [],

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

    await this.getEventData();

    this.loading = true;
    let response = await this.$api.getPlaces();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error("Ошибка", "Не удалось получить список мест проведения мероприятий. " + (response.info || ""));
      return;
    }
    this.allPlaces = response.places;

    this.loading = true;
    response = await this.$api.getPositions();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error("Ошибка", "Не удалось получить список возможных направленностей работы. " + (response.info || ""));
      return;
    }
    this.allPositions = response.positions;
  },


  methods: {
    async getEventData() {
      this.loading = true;
      let response = await this.$api.getEventById(this.eventId);
      this.loading = false;
      if (!response.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список мероприятий. " + (response.info || ""));
        return;
      }
      this.event = response;
      this.$refs.renderer.update(this.event.description);
    },

    async participate() {
      if (!this.position) {
        this.$modal.alert("Не выбрана направленность работы", "Выбери, чем будешь заниматься");
        return;
      }

      this.loading = true;
      const res = await this.$api.participateInEvent(this.eventId, this.$user.id, this.position.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие. " + (res.info || ""));
        return;
      }
      this.event.isyouparticipate = true;

      await this.getEventData();
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

      await this.getEventData();
    },

    async updateEventData() {
      this.loading = true;
      const res = await this.$api.editEvent(this.eventId, this.event.name, this.event.description, this.event.date, this.event.timestart, this.event.timeend, this.place.id, this.event.eventtimestart, this.event.eventtimeend, this.event.peopleneeds);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось изменить мероприятие. " + (res.info || ""));
        return;
      }
      window.onbeforeunload = null;
      this.isEdited = false;
      this.$popups.success("Обновлено", "Данные мероприятия сохранены");
    },

    onChange() {
      window.onbeforeunload = () => true;
      this.isEdited = true;
    },

    async deleteEvent() {
      if (!await this.$modal.confirm("Удаление мероприятия", "Будут так же удалены все записи людей и их рейтинги за это мероприятие! Вы уверены?"))
        return;

      this.loading = true;
      const res = await this.$api.deleteEventById(this.eventId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось удалить мероприятие");
        return;
      }
      this.$popups.success("Удалено", "Мероприятия будто никогда и не сущестовало");
      this.$router.push({name: "events"});
    }
  },
}
</script>

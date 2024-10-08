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
          text-decoration underline
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
          .add-participation-button
          .select-user-list
          .select-position
            max-height 400px
            transition all 0.5s ease
            overflow hidden
            &.hidden
              max-height 0
              transition all 0.5s cubic-bezier(0, 1, 0, 1)
              opacity 0
              pointer-events none
          .add-participation-button
            button-dashed()
            margin-bottom 10px
          .select-user-list
            list-style none
            padding 0
            margin 0
            max-height 300px
            overflow-y scroll
          .select-position
            display flex
            flex-direction column
            align-items center
            gap 10px
            padding-bottom 150px
            .select-list
              min-width 300px
            .button-select-user
              button-submit()
              width min-content
              padding 10px 30px
              img
                width 30px
                height 30px
                margin-right 5px

      .main-info
        padding-top 12px

        border-radius(7px)
        background colorShadowLight-x
        border colorShadowLight 1px solid
        margin-bottom 20px
        .input:not(:last-of-type)
          margin-bottom 20px


    .buttons
      display flex
      .button-submit
        flex 0.5
        margin-right 20px
      .participation-group
        flex 1
        .button-participate-group
          display flex
          gap 20px
          @media ({mobile})
            flex-direction column
        .button-participate
          button-submit()
      .button-not-participate
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
    <Form :noSubmit="!$user.canEditEvents" class="form-event" :class="{'is-admin': $user.canEditEvents}" @submit="updateEventData">
      <div class="event-info">
        <div class="left-description">
          <div class="main-info">
            <FloatingInput v-model="event.name" title="Название" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
            <SelectList v-model="place" @input="onChange" :selected-id="event.placeid" :list="allPlaces" title="Место проведения" solid :readonly="!$user.canEditEvents" class="input"></SelectList>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.date" type="date" title="Дата проведения" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timestart" type="time" title="Приходить c" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.timeend" type="time" title="Оставаться до" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.peopleneeds" type="number" title="Людей необходимо" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
          </div>

          <div class="main-info">
            <FloatingInput v-model="event.eventtimestart" type="time" title="Начало мероприятия" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
            <FloatingInput v-model="event.eventtimeend" type="time" title="Конец мероприятия" :readonly="!$user.canEditEvents" no-info class="input"></FloatingInput>
          </div>

          <Filters :filters="isAcademyValue" @change="onChangeAcademy" can-be-none class="input-checkbox" :disabled="!$user.canEditEvents"></Filters>

          <FloatingInput v-model="event.authorname" title="Автор мероприятия" readonly no-info class="input"></FloatingInput>
          <a v-if="event.authortelegram" :href="`https://t.me/${event.authortelegram}`" target="_blank" class="user-link">
            <FloatingInput :model-value="`@${event.authortelegram}`" title="Связь с автором" readonly no-info class="input"></FloatingInput>
          </a>
        </div>

        <div class="right-description">
          <RedactorAndRenderer info="А что мы будем делать?" placeholder="Описание" v-model="event.description" @input="onChange()" show-initial-preview :can-edit="$user.canEditEvents"></RedactorAndRenderer>

          <UsersTable class="users-table"
                      :users-lists="[{participations: event.participations}]"
                      @change.stop
                      @input.stop
                      can-delete
                      can-edit-self
                      ref="usersTable"
          >
            <div class="add-participation-button" :class="{hidden: !$user.canEditParticipations || inSelectingUser || selectedUser}" @click="getAllUsers(); inSelectingUser = true">
              <img src="../res/plus.svg" alt="plus"><div class="text">Записать</div>
            </div>
            <ul class="select-user-list scrollable" :class="{hidden: !inSelectingUser}">
              <li v-for="user in allUsers" class="user" @click="inSelectingUser = false; selectedUser = user">
                <UserLine v-bind="user" :avatarimageid="user.avatarimageid" clickable></UserLine>
              </li>
            </ul>
            <div class="select-position" :class="{hidden: !selectedUser}" v-if="selectedUser">
              <UserLine v-bind="selectedUser"></UserLine>
              <SelectList v-if="selectedUser" v-model="selectedUser.position" :list="allPositions" class="select-list"></SelectList>
              <div class="button-select-user" @click="participateOtherUser(selectedUser.id, selectedUser.position.id); selectedUser = undefined;"><img src="../res/save.svg" alt="save">Добавить</div>
            </div>
          </UsersTable>
        </div>
      </div>

      <div class="buttons">
        <CircleLoading v-if="loading"></CircleLoading>
        <div v-else-if="!event.isyouparticipate && event.isnext" class="participation-group">
          <div class="button-participate-group">
            <div class="button-participate" @click="participate" :disabled="!position">Пойду</div>
            <SelectList v-model="position" :list="allPositions" title="Чем займёшься" solid class="input"></SelectList>
          </div>
          <div class="participation-comment">
            <FloatingInput @input.stop v-model="participationComment" placeholder="Комментарий к участию" no-info></FloatingInput>
          </div>
        </div>
        <div v-else-if="event.isnext" class="button-not-participate" @click="notParticipate">Не пойду</div>
      </div>
      <div v-if="$user.canEditEvents" class="button-delete" @click="deleteEvent"><img src="../res/trash.svg" alt="delete">Удалить</div>
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
import UserLine from "../components/UserLine.vue";
import RedactorAndRenderer from "../components/Markdown/RedactorAndRenderer.vue";
import Filters from "~/components/Filters.vue";


export default {
  components: {
    Filters,
    RedactorAndRenderer, UserLine, SelectList, FloatingButton, CircleLoading, Form, FloatingInput, UsersTable},

  data() {
    return {
      eventId: this.$route.params.eventId,

      event: {},
      position: undefined,
      place: undefined,
      participationComment: '',

      allPlaces: [],
      allPositions: [],

      loading: true,
      isEdited: false,

      allUsers: undefined,
      inSelectingUser: false,
      selectedUser: undefined,

      isAcademyValue: [{id: 0, name: 'Это академия', value: undefined}],
    }
  },

  async mounted() {
    if (this.eventId === undefined) {
      this.$popups.error("Ошибка", "id события нет в строке запроса");
      this.$router.push({name: "events"});
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

    this.$refs.usersTable.$el.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
  },


  methods: {
    onChangeAcademy(filter) {
      if (filter.id === 0) {
        this.isAcademyValue[0].value = filter.value;
      }
    },

    async getEventData() {
      this.loading = true;
      let response = await this.$api.getEventById(this.eventId);
      this.loading = false;
      if (!response.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список мероприятий. " + (response.info || ""));
        return;
      }
      this.event = response;
    },

    async addUserParticipation(userId, positionId, participationComment) {
      if (!positionId) {
        this.$modal.alert("Не выбрана направленность работы", "Выбери, чем будешь заниматься");
        return false;
      }

      this.loading = true;
      const res = await this.$api.participateInEvent(this.eventId, userId, positionId, participationComment);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие. " + (res.info || ""));
        return false;
      }

      await this.getEventData();
      return true;
    },

    async participate() {
      if (await this.addUserParticipation(this.$user.id, this.position?.id, this.participationComment))
        this.event.isyouparticipate = true;
    },
    async participateOtherUser(userId, positionId) {
      if (await this.addUserParticipation(userId, positionId))
        this.selectedUser = undefined;
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
      const res = await this.$api.editEvent(this.eventId, this.event.name, this.event.description, this.event.date, this.event.timestart, this.event.timeend, this.place.id, this.event.eventtimestart, this.event.eventtimeend, this.event.peopleneeds, this.isAcademyValue[0].value);
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
    },

    async getAllUsers() {
      this.loading = true;
      const res = await this.$api.getAllUsers();
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список всех пользователей');
        return;
      }

      this.allUsers = res.users;
    }
  },
}
</script>

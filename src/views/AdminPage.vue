<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.loading
  width 100%
  text-align center

.not-found-info
  text-align center
  width 100%
  padding 20px 10px
  color textColor5


.allBoards
  display flex
  @media ({mobile})
    flex-direction column
  gap 20px
  width 100%
  padding 20px
  @media ({mobile})
    padding-bottom (header-height-mobile + 20px)
  .column
    display flex
    flex-direction column
    justify-content space-between
    gap 20px
    flex 1
  .newUsersBoard
  .participationsBoard
  .searchUsersBoard
  .setupPlacesBoard
  .setupPositionsBoard
  .achievementsBoard
    max-height 500px
    flex 1
    block-dark-bg()
    width 100%
    border 1px solid mix(borderColor, transparent, 80%)
    display flex
    flex-direction column
    margin 0
    padding 0
    .header
      block-dark-bg()
      font-large()
      padding 10px
      width 100%
      text-align center
      border-bottom-left-radius 0
      border-bottom-right-radius 0
      border-bottom 1px solid borderColor
      box-shadow 0 5px 10px colorShadowDark
    .container
      flex 1
      list-style none
      margin 0
      padding 0


  .newUsersBoard
    .newUser
      display flex
      align-items center
      width 100%
      padding 10px
      border-bottom 1px borderColorDark solid
      .username-container
        flex 1
        font-medium()
        color textColor1
        margin-right 10px
        white-space nowrap
        overflow hidden
        .email
        .telegram
          color textColor3
          font-small()
          display flex
          align-items center
          img
            width 20px
            height 20px
            margin-right 5px

      .button-accept
      .button-delete
        flex 0
        display flex
        align-items center
        img
          width 30px
          height 30px

      .button-accept
        button-submit()
        font-small()
        padding 6px 6px 6px 10px
        margin-right 10px
        @media ({mobile})
          font-small-extra()
      .button-delete
        button-danger()
        padding 6px

  //.participationsBoard
  .achievementsBoard
  .searchUsersBoard
    max-height 500px
    .header
      .search-input
        margin-top 5px

    .user
      padding 10px 10px
      display flex
      font-medium()
      transition all 0.2s ease
      &:hover
        background blocksBgColorHover
      .avatar
        border-radius 50%
        width 30px
        height 30px
        margin-right 5px
        border 1px solid empColor1_2
      .text
        .name
          font-middle()
          color textColor1
          line-height 0.8
          white-space nowrap
        .title
          font-small-extra()
          color textColor3
  .achievementsBoard
    .user
      .avatar
        border-color empColor2_2
    .add-button
      button-dashed()
      margin-bottom 10px
      img
        margin-right 5px
        width 30px
        min-width 30px
        height 30px

  .setupPositionsBoard
  .setupPlacesBoard
    max-height 300px
    .addable-list
      height 100%
    .container
      overflow-y auto

.overlay-loading
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
</style>

<template>
  <CircleLoading v-if="loading" class="loading"></CircleLoading>
  <div v-else class="allBoards" css-fullheight>
    <div class="column">
      <div class="newUsersBoard">
        <header class="header">Подтверждение новых пользователей</header>
        <div v-if="newUsers.length === 0" class="not-found-info">Новых пользователей нет</div>
        <ul v-else class="container scrollable">
          <li class="newUser" v-for="(user, listIdx) in newUsers">
            <div class="username-container">
              <div class="username">{{ user.name }}</div>
              <div class="email">
                <img src="../res/email-logo.svg" alt="email">
                <span>{{ user.email }}</span>
              </div>
              <div class="telegram" v-if="user.telegram">
                <img src="../res/telegram-logo.svg" alt="tg">
                <span>{{ user.telegram }}</span>
              </div>
            </div>
            <div class="button-accept" @click="confirmByAdmin(user.id, listIdx)"><span class="text">Подтвердить</span><img src="../res/ok.svg" alt="accept"></div>
            <div class="button-delete" @click="deleteUnconfirmedAccount(user.id, listIdx)"><img src="../res/trash.svg" alt="delete"></div>
          </li>
        </ul>
      </div>

      <div class="setupPlacesBoard">
        <header class="header">Возможные места проведения</header>
        <div class="container">
          <AddableList class="addable-list scrollable"
                       v-model="places"
                       placeholder="название места"
                       add-text="Добавить"
                       locked
                       @save="savePlaces"
                       unlock-title="Изменить список мест"
                       unlock-description="Уже установленные места проведения мероприятий могут быть потеряны! Вы уверены, что хотите изменить список возможных мест проведения?"
          ></AddableList>
        </div>
      </div>
    </div>

    <div class="column">
      <div class="participationsBoard">
        <header class="header">Раздача баллов за мероприятия</header>
        <UsersTable :users-lists="participations" v-if="participations.length"></UsersTable>
        <div v-else class="not-found-info">Неоцененных участий нет</div>
      </div>

      <div class="setupPositionsBoard">
        <header class="header">Возможные направления работы</header>
        <div class="container">
          <AddableList class="addable-list scrollable"
                       v-model="positions"
                       placeholder="направление"
                       add-text="Добавить"
                       locked
                       @save="savePositions"
                       unlock-title="Изменить список направлений"
                       unlock-description="Выбранные пользователями направления работы на мероприятиях могут быть потеряны! Вы уверены, что хотите изменить список возможных направлений работы?"
          ></AddableList>
        </div>
      </div>
    </div>

    <div class="column">
      <div class="searchUsersBoard">
        <header class="header">
          Поиск пользователей
          <FloatingInput placeholder="Имя пользователя" no-info class="search-input" v-model="searchText" @input="getUsersBySearch"></FloatingInput>
        </header>

        <CircleLoading v-if="searchLoading" class="loading"></CircleLoading>
        <div v-else-if="searchUsers.length === 0" class="not-found-info">Пользователей не найдено</div>
        <ul v-else class="container scrollable">
          <router-link v-for="user in searchUsers" :to="{name: 'userProfile', params: {userId: user.id}}" class="user">
            <UserAvatar :image-id="user.avatarimageid" class="avatar"></UserAvatar>
            <div class="text">
              <div class="name">{{ $cropText(user.name, 30) }}</div>
              <div class="title">{{ $cropText(user.title, 30) }}</div>
            </div>
          </router-link>
        </ul>
      </div>

      <div class="achievementsBoard">
        <header class="header">Достижения</header>

        <CircleLoading v-if="achievementsLoading" class="loading"></CircleLoading>
        <ul v-else class="container scrollable">
          <li v-if="achievements.length === 0" class="not-found-info">Достижений нет</li>
          <router-link v-else v-for="achievement in achievements" :to="{name: 'achievement', params: {achievementId: achievement.id}}" class="user">
            <AchievementAvatar :image-id="achievement.imageid" class="avatar"></AchievementAvatar>
            <div class="text">
              <div class="name">{{ $cropText(achievement.name, 30) }}</div>
              <div class="title">{{ $cropText(cleanupMarkdownPreview(achievement.description), 30) }}</div>
            </div>
          </router-link>
          <router-link class="add-button" :to="{name: 'createAchievement'}">
            <img src="../res/plus.svg" alt="add"> Создать
          </router-link>
        </ul>
      </div>
    </div>
    <CircleLoading v-if="overlayLoading" class="overlay-loading"></CircleLoading>
  </div>
</template>

<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";
import UsersTable from "../components/UsersTable.vue";
import UserAvatar from "../components/UserAvatar.vue";
import AchievementAvatar from "../components/AchievementAvatar.vue";
import AddableList from "../components/AddableList/AddableList.vue";
import {cleanupMarkdownPreview} from "../utils/utils";

export default {
  components: {AchievementAvatar, AddableList, UserAvatar, CircleLoading, Form, FloatingInput, UsersTable},

  data () {
	  return {
      newUsers: [],
      participations: [],
      searchUsers: [],

      places: [],
      positions: [],
      achievements: [],

      searchText: "",

      loading: false,
      searchLoading: false,
      achievementsLoading: false,
      overlayLoading: false,
    }
  },

  mounted () {
    this.getNewUsers();
    this.getUnvotedParticipations();
    this.getUsersBySearch();
    this.getPlaces();
    this.getPositions();
    this.getAchievements();
  },

  methods: {
    async getNewUsers() {
      this.loading = true;
      const res = await this.$api.getUnconfirmedUsers();
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список новых пользователей');
        return;
      }

      this.newUsers = res.users;
    },

    async getUnvotedParticipations() {
      this.loading = true;
      const res = await this.$api.getUnvotedParticipations();
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список неоцененных участников мероприятий');
        return;
      }

      // Создаем объект, где каждое свойство - id события, а значение - участники в нём
      const participationsList = {};
      for (const participation of res.participations) {
        if (participationsList[participation.eventid] === undefined)
          participationsList[participation.eventid] = []

        participationsList[participation.eventid].push(participation)
      }
      // Преобразуем этот объект в массив с объектами с нужными полями
      this.participations = [];
      for (const eventId in participationsList) {
        this.participations.push({
          eventId: eventId,
          eventName: participationsList[eventId][0].eventname,
          eventDate: participationsList[eventId][0].eventdate,
          participations: participationsList[eventId],
        })
      }
    },

    async getUsersBySearch() {
      this.searchLoading = true;
      const res = await this.$api.getUsersBySearch(this.searchText);
      this.searchLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список всех пользователей');
        return;
      }

      this.searchUsers = res.users;
    },

    async getPlaces() {
      this.loading = true;
      const res = await this.$api.getPlaces();
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список мест проведения');
        return;
      }

      this.places = res.places.map((place) => ({id: place.id, title: place.name}));
    },

    async getPositions() {
      this.loading = true;
      const res = await this.$api.getPositions();
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список направлений работы');
        return;
      }

      this.positions = res.positions.map((position) => ({id: position.id, title: position.name}));
    },

    async getAchievements() {
      this.achievementsLoading = true;
      const res = await this.$api.getAchievements();
      this.achievementsLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить список достижений');
        return;
      }

      this.achievements = res.achievements;
    },

    async savePlaces(toCreate, toEdit, toDelete) {
      let withError = false;

      for (const place of toCreate) {
        const res = await this.$api.addPlace(place.title);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось добавить место "${place.title}"`);
          withError = true;
          continue;
        }
        place.id = res.id;
      }

      for (const place of toEdit) {
        const res = await this.$api.editPlace(place.id, place.title);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось изменить название места на "${place.title}"`);
          withError = true;
          continue;
        }
      }

      for (const place of toDelete) {
        const res = await this.$api.deletePlace(place.id);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось удалить место "${place.title}"`);
          withError = true;
          continue;
        }
      }

      if (withError) {
        this.$modal.alert("Ошибка при изменениии мест", "Не все изменения сохранены корректно. Попробуйте перезагрузить страницу и заново изменить список");
        return;
      }
      this.$popups.success("Изменено", "Список мест успешно обновлен");
    },

    async savePositions(toCreate, toEdit, toDelete) {
      let withError = false;

      for (const position of toCreate) {
        const res = await this.$api.addPosition(position.title);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось добавить направвление "${position.title}"`);
          withError = true;
          continue;
        }
        position.id = res.id;
      }

      for (const position of toEdit) {
        const res = await this.$api.editPosition(position.id, position.title);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось изменить название направления на "${position.title}"`);
          withError = true;
          continue;
        }
      }

      for (const position of toDelete) {
        const res = await this.$api.deletePosition(position.id);
        if (!res.ok_) {
          this.$popups.error("Ошибка", `Не удалось удалить направление "${position.title}"`);
          withError = true;
          continue;
        }
      }

      if (withError) {
        this.$modal.alert("Ошибка при изменениии направлений", "Не все изменения сохранены корректно. Попробуйте перезагрузить страницу и заново изменить список");
        return;
      }
      this.$popups.success("Изменено", "Список направлений успешно обновлен");
    },

    async confirmByAdmin(userId, listIdx) {
      if (!await this.$modal.confirm("Подтверждение аккаунта", "Вы точно знаете этого человека, и подтверждаете, что он готов к техподским утехам?"))
        return;
      this.overlayLoading = true;
      const res = await this.$api.setAdminConfirmation(userId, true);
      this.overlayLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось подтвердить аккаунт');
        return;
      }
      this.$popups.success('Подтверждено', 'Теперь пользователь может пользоваться сервисом');
      this.newUsers.splice(listIdx, 1);
    },

    async deleteUnconfirmedAccount(userId, listIdx) {
      if (!await this.$modal.confirm("Удаление неподтвержденного аккаунта", "Если вдруг вы удалите аккаунт случайно, человеку просто придётся зарегестрироваться заново"))
        return;
      this.overlayLoading = true;
      const res = await this.$api.deleteUser(userId);
      this.overlayLoading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить аккаунт');
        return;
      }
      this.$popups.success('Аккаунт удален', 'Туда его');
      this.newUsers.splice(listIdx, 1);
    },

    cleanupMarkdownPreview: cleanupMarkdownPreview,
  }
}
</script>


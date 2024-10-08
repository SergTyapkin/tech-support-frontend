<style lang="stylus" scoped>
@require '../../styles/constants.styl'
@require '../../styles/buttons.styl'
@require '../../styles/fonts.styl'
@require '../../styles/utils.styl'


hr
  margin 0

.profile-plate
  margin-top 30px
  margin-bottom 100px
  padding 10px 30px 30px 30px
  border-radius(unquote("150px 150px 10px 10px / 100px 100px 10px 10px"))

  .info-container
    .top-container
      display flex
      justify-content space-between
      align-items flex-end
      width 100%
      text-align center

    .rating
    .position
      flex 1
      font-large()

      .info
        font-small()
      transition all 0.2s ease

      &:hover
        transform scale(1.1)

    .username
      margin-top 20px
      padding 5px
      padding-top 2px

    .title
      margin-top 5px
      margin-bottom 15px
      width 100%
      text-align center
      font-medium()
      color textColor3

  .quest-statistics
    padding 10px
    background #00000033

    .quest
      height 30px
      line-height 30px

  .achievements
    block()
    padding 20px
    display flex
    flex-wrap wrap
    justify-content space-evenly
    overflow-x hidden
    gap 30px

    &.closed
      min-height 60px

    .achievement-container
      position relative
      transition all 0.2s ease

      &:hover
        filter brightness(1.2)

      .delete-achievement
        position absolute
        left 50%
        top 0
        opacity 0
        pointer-events none
        transform translateX(-50%)
        transition all 0.2s ease
        z-index 999
        padding-bottom 10px

        img
          width 40px
          height 40px

      .delete-achievement:hover
      .achievement:hover + .delete-achievement
        top -50px
        opacity 1
        pointer-events auto
        @media ({mobile})
          top 10px
          pointer-events none

      .delete-achievement:hover
        transform translateX(-50%) scale(1.1)

    .info
      font-small()
      color textColor5

  .see-all-achievements
    block()
    button-dashed()
    border-bottom-left-radius 0
    border-bottom-right-radius 0

    img
      width 30px
      height 30px
    width 100%

  .add-achievement
  .achievements-list
  .select-achievement-level
    max-height 400px
    transition all 0.5s ease
    overflow hidden

    &.hidden
      max-height 0
      transition all 0.5s cubic-bezier(0, 1, 0, 1)
      opacity 0
      pointer-events none

  .add-achievement
    button-dashed()
    margin-top 5px

  .achievements-list
    overflow-y scroll

  .select-achievement-level
    display flex
    align-items center
    flex-direction column

    .avatar
      margin-top 10px
      margin-bottom 10px

    .range
      margin-bottom 20px

    .button-select-achievement
      button-submit()
      width min-content

      img
        width 20px
        height 20px
        margin-right 10px

  .confirm-email-input
    margin-bottom 20px
    color empColor2_1
    font-weight bold

  .password-form-container
    margin-bottom 0

  .button-get-extract
  .password-change-button
  .see-all-sessions-button
    button-submit()
    margin-top 30px

  .all-sessions-form-container
    .sessions-container
      .session
        block-clickable()
        padding 20px
        .ip
          font-large()
          font-bold()
        .expires
          font-small()
          color textColor4
        .info
          font-small()
          font-bold()
          color textColor2
        &.current-session
          border 1px empColor1_1 solid
          position relative
          &::after
            position absolute
            content "Текущая сессия"
            font-small()
            color textColor4
            right 10px
            top 7px

    .close-all-sessions-button
      button-danger()


.logout
  width 100%

.another-user-info
  margin-top 5px
  text-align center
  font-large()
  margin-bottom -10px

.avatar-div
  position relative

.avatar-container
  position relative

  .delete-avatar
    position absolute
    right -40px
    top 20px
    cursor pointer
    transition all 0.2s ease
    width 40px
    opacity 0
    pointer-events none

  .delete-avatar:hover
    transform scale(1.1)

.avatar-container:hover
  .delete-avatar
    opacity 1
    pointer-events auto

.avatar-container
  .avatar-div::before
  .avatar-div::after
    content 'Изменить'
    border-radius(50%)
    overflow hidden
    font-family Arial
    padding-left 5px
    font-size 15px
    text-align center
    display flex
    align-items center
    position absolute
    inset 0
    background #000000AA
    z-index 1
    opacity 0
    transition opacity 0.3s ease
    cursor pointer

  .avatar-div::after
    content 'Отпустите, чтобы загрузить'

  .avatar-div:hover::before
    opacity 1

  .image-loader.in-drag
    .avatar-div::after
      opacity 1

.button-logout
  button()
</style>

<style lang="stylus">
@require '../../styles/constants.styl'

.__text-success
  color colorYes

.__text-error
  color colorNo

</style>

<template>
  <div>
    <div class="profile-page">
      <Form class="profile-plate">
        <div>
          <div class="info-container">
            <div class="top-container">
              <router-link :to="{name: 'ratings'}" class="rating">
                <div>★{{ user.rating }}</div>
                <div class="info ">рейтинг</div>
              </router-link>

              <CircleLoading v-if="loading" size="80px"></CircleLoading>

              <div v-else-if="yours" class="avatar-container">
                <DragNDropLoader class="image-loader"
                                 @load="updateAvatar"
                                 @error="(errText) => $popups.error('Не удалось загрузить', errText)"
                                 :crop-to-square="true"
                                 :compress-size="IMAGE_PROFILE_MAX_RES"
                >
                  <div class="avatar-div" @click.stop="updateAvatar(undefined)">
                    <UserAvatar :image-id="user.avatarImageId" size="80px" :user-id="user.id"></UserAvatar>
                  </div>
                </DragNDropLoader>
                <img v-if="user.avatarImageId" class="delete-avatar" src="../../res/trash.svg" alt="delete"
                     @click.stop="deleteAvatarClick">
              </div>
              <div v-else class="avatar-div">
                <UserAvatar :image-id="user.avatarImageId" size="80px" border-offset="0px" border-width="1px"
                            :user-id="user.id"></UserAvatar>
              </div>

              <router-link :to="{name: 'ratings'}" class="position">
                <div>{{ user.position }}</div>
                <div class="info ">позиция</div>
              </router-link>
            </div>
            <div v-if="!yours" class="username">
              <div class="another-user-info">{{ $usernameFull(user) }}</div>
            </div>
            <input v-if="$user.canEditUsersTitles && !yours" type="text" class="title" v-model="user.title"
                   @change="saveAnotherUserTitle" @keydown.enter="(event) => event.target.blur()">
            <div v-else class="title">{{ user.title }}</div>

            <a v-if="!yours && user.telegram" :href="`https://t.me/${user.telegram}`" target="_blank" class="user-link">
              <FloatingInput :model-value="`@${user.telegram}`" title="Telegram" readonly no-info
                             class="input"></FloatingInput>
            </a>
          </div>

          <hr>

          <div class="quest-statistics">
            <ArrowListElement :title="`Мероприятий: ${completedEvents.length}`"
                              closed
                              :elements="completedEvents"
                              @click-inside="(eventData) => $router.push({name: 'event', params: {eventId: eventData.id}})"
            ></ArrowListElement>
          </div>

          <!-- ACHIEVEMENTS -->
          <router-link v-if="yours" :to="{name: 'achievements'}" class="see-all-achievements"><img
            src="../../res/ratings.svg" alt="all achievements">Все достижения
          </router-link>

          <div class="achievements roll-active closed" ref="achievementsList">
            <CircleLoading v-if="loadingAchievements" size="30px"></CircleLoading>
            <div v-else-if="achievements.length === 0" class="info">Достижений пока что нет</div>
            <router-link v-else
                         v-for="achievement in achievements"
                         :to="{name: 'achievement', params: {achievementId: achievement.achievementid}}"
                         class="achievement-container"
                         @contextmenu.prevent="deleteAchievement(achievement.id)"
            >
              <Achievement class="achievement"
                           :level="achievement.level"
                           :max-levels="achievement.levels"
                           :image-id="achievement.imageid"
                           :special="achievement.special"
              ></Achievement>
              <div v-if="$user.canAssignAchievements" class="delete-achievement"
                   @click.stop.prevent="deleteAchievement(achievement.id)"><img src="../../res/trash.svg" alt="delete">
              </div>
            </router-link>
          </div>
          <div class="add-achievement" @click="inSelectingAchievement = true"
               :class="{hidden: !$user.canAssignAchievements || inSelectingAchievement || selectedAchievement}"><img
            src="../../res/plus.svg" alt="add achievement">Добавить достижение
          </div>

          <AchievementsList :class="{hidden: !inSelectingAchievement}"
                            class="achievements-list scrollable"
                            @select="(achievement) => { inSelectingAchievement = false; selectedAchievement = deepClone(achievement); selectedAchievement.level = 1 }"
          ></AchievementsList>
          <div class="select-achievement-level" :class="{hidden: !selectedAchievement}">
            <Achievement :max-levels="selectedAchievement?.levels" :level="selectedAchievement?.level"
                         :image-id="selectedAchievement?.imageid" :special="selectedAchievement?.special"
                         class="avatar"></Achievement>
            <Range v-if="selectedAchievement" class="range" :min="1" :max="selectedAchievement.levels" :step="1"
                   no-value v-model="selectedAchievement.level"></Range>
            <div class="button-select-achievement" @click="addAchievement()"><img src="../../res/save.svg" alt="save">Добавить
            </div>
          </div>
          <!-- ACHIEVEMENTS (END) -->

          <div v-if="yours">
            <FormExtended ref="form" no-bg
                          :fields="[
                            { title: 'ТВОЯ ФАМИЛИЯ', jsonName: 'secondName' },
                            { title: 'ТВОЁ ИМЯ', jsonName: 'firstName' },
                            { title: 'ТВОЁ ОТЧЕСТВО', jsonName: 'thirdName' },
                            { title: 'ТВОЙ Telegram', jsonName: 'telegram', type: 'telegram', info: 'всё что после @'},
                            { title: 'ТВОЙ E-mail', jsonName: 'email', type: 'email', info: user.isConfirmedEmail ? `<span class='__text-success'>Email подтвержден</span>` : `<b class='__text-error'>E-MAIL НЕ ПОДТВЕРЖДЕН. ВОССТАНОВИТЬ ПАРОЛЬ НЕ УДАСТСЯ</b>`},
                          ]"
                          :no-submit="true"
                          @input="onChange"
            ></FormExtended>
            <input v-if="!user.isConfirmedEmail && !loadingConfirmEmail" type="submit" value="Подтвердить E-mail"
                   class="confirm-email-input" @click="confirmEmailSendMessage">
            <CircleLoading v-if="loadingConfirmEmail"></CircleLoading>
          </div>
        </div>

        <div v-if="yours" ref="passwordFormContainer" class="roll-active closed password-form-container">
          <FormExtended ref="passwordForm" no-bg no-submit
                        :fields="[
                          { title: 'Старый пароль', jsonName: 'oldPassword', type: 'password'},
                          { title: 'Новый пароль', jsonName: 'newPassword', type: 'password'},
                          { title: 'Новый пароль ещё раз', jsonName: 'newPasswordConfirm', type: 'password'},
                        ]"
                        submit-text="Сменить пароль"
                        @submit="changePassword"
          ></FormExtended>
        </div>

        <div v-if="yours" class="password-change-button" @click.prevent="clickOnChangePassword">Сменить пароль</div>
        <router-link v-if="yours" class="button-get-extract" :to="{name: 'participationsExtract'}">Выписка по мероприятиям</router-link>
        <div v-if="yours" class="see-all-sessions-button" @click.prevent="openAllSessions">Посмотреть все сессии</div>
        <div v-if="yours" ref="allSessionsContainer" class="roll-active closed all-sessions-form-container">
          <div class="sessions-container">
            <div v-for="session in sessions" class="session" :class="{'current-session': session.isCurrent}">
              <div class="ip">{{ session.ip }}</div>
              <div class="expires">До {{ session.expires }}</div>
              <div class="info">{{ session.browser }}, {{ session.os }}, {{ session.geolocation }}</div>
            </div>
          </div>
          <div class="close-all-sessions-button" @click.prevent="terminateAllSessions">
            <CircleLoading v-if="loadingTerminateSessions"></CircleLoading>
            <span v-else>Завершить все сессии</span>
          </div>
        </div>

        <button v-if="yours" class="button-logout" @click="logOut">Выйти</button>
      </Form>
    </div>

    <FloatingButton v-if="isEdited" title="Сохранить" green @click="changeData"><img src="../../res/save.svg"
                                                                                     alt="save"></FloatingButton>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import FormExtended from "/src/components/FormExtended.vue";
import FloatingInput from "../../components/FloatingInput.vue";
import {closeRoll, isClosedRoll, openRoll, openRollList} from "../../utils/show-hide";
import CircleLoading from "../../components/loaders/CircleLoading.vue";
import {nextTick} from "vue";
import {BASE_URL_PATH, IMAGE_MAX_RES, IMAGE_PROFILE_MAX_RES} from "../../constants";
import {DragNDropLoader} from "@sergtyapkin/image-uploader";
import ArrowListElement from "../../components/ArrowListElement.vue";
import TopBar from "../../components/TopBar.vue";
import UserAvatar from "../../components/UserAvatar.vue";
import Achievement from "../../components/Achievement.vue";
import AchievementAvatar from "../../components/AchievementAvatar.vue";
import Range from "../../components/Range.vue";
import {cleanupMarkdownPreview, dateToStr, deepClone, timeToStr} from "../../utils/utils";
import FloatingButton from "../../components/FloatingButton.vue";
import AchievementsList from "../../components/AchievementsList.vue";


export default {
  components: {
    AchievementsList,
    FloatingButton,
    Range,
    AchievementAvatar,
    Achievement,
    UserAvatar, TopBar, ArrowListElement, DragNDropLoader, CircleLoading, FloatingInput, FormExtended, Form
  },

  data() {
    return {
      IMAGE_PROFILE_MAX_RES,

      userId: this.$route.params.userId,
      yours: this.$route.params.userId === undefined,

      user: {},
      completedEvents: [],
      achievements: [],
      loading: false,
      loadingConfirmEmail: false,
      loadingAchievements: false,
      loadingTerminateSessions: false,

      buttons: [],
      sessions: [],

      base_url_path: this.$base_url_path,
      api_url: this.$api.apiUrl,

      inSelectingAchievement: false,
      selectedAchievement: undefined,

      isEdited: false,
    }
  },

  async mounted() {
    await this.init();
  },

  methods: {
    async init() {
      if (this.yours) {
        this.$refs.form.values = this.$user;
        this.user = this.$user;
      } else {
        await this.getAnotherUser();
      }

      this.addTitlesToArrowListings();
      this.getAchievements();
    },

    addTitlesToArrowListings() {
      this.completedEvents = this.user.completedEvents.map((eventData) => ({
        title: `${eventData.name} | ★${eventData.score}`,
        id: eventData.id,
        arrow: true,
        noClose: true,
      }));
    },

    validate(firstName, secondName, thirdName, email, telegram) {
      let ok = true;
      if (firstName.length === 0) {
        this.$refs.form.errors.firstName = 'Имя не может быть пустым';
        ok = false;
      }
      if (secondName.length === 0) {
        this.$refs.form.errors.secondName = 'Фамилия не может быть пустой';
        ok = false;
      }
      if (thirdName.length === 0) {
        this.$refs.form.errors.thirdName = 'Отчество не может быть пустым';
        ok = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'Email не может быть пустым';
        ok = false;
      }
      if (telegram.length === 0) {
        this.$refs.form.errors.telegram = 'Telegram не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async changeData() {
      if (!await this.$modal.confirm("Изменение данных", "Если вы изменили E-mail, он станет неподтверждённым. Придётся подтверждать заново"))
        return;

      const firstName = this.$refs.form.values.firstName;
      const secondName = this.$refs.form.values.secondName;
      const thirdName = this.$refs.form.values.thirdName;
      const email = this.$refs.form.values.email;
      const telegram = this.$refs.form.values.telegram;
      if (!this.validate(firstName, secondName, thirdName, email, telegram))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.updateUser(this.user.id, email, firstName, secondName, thirdName, telegram);
      this.$refs.form.loading = false;

      if (response.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$popups.success('Данные обновлены');
        this.$refs.form.errors = {};
        window.onbeforeunload = null;
        this.isEdited = false;
        return;
      }

      if (response.status_ === 409) {
        this.$refs.form.errors.email = 'Такой email уже занят';
      } else {
        this.$popups.error("Не удалось обновить данные", 'Произошла неизвестная ошибка!');
      }
    },

    clickOnChangePassword() {
      if (isClosedRoll(this.$refs.passwordFormContainer)) {
        openRoll(this.$refs.passwordFormContainer);
        return;
      }
      this.changePassword(this.$refs.passwordForm.values);
    },

    async openAllSessions() {
      this.loading = true;
      const res = await this.$api.getAllSessions();
      this.loading = false;
      if (!res.ok_) {
        this.$popups.error('Неизвестная ошибка', 'Не удалось получить сессии');
        return;
      }
      this.sessions = res.sessions;
      this.sessions.forEach(session => {
        session.expires = dateToStr(session.expires);
      })
      openRoll(this.$refs.allSessionsContainer);
    },
    async terminateAllSessions() {
      this.loadingTerminateSessions = true;
      const res = await this.$api.deleteAnotherSessions();
      this.loadingTerminateSessions = false;
      if (!res.ok_) {
        this.$popups.error('Неизвестная ошибка', 'Не удалось завершить сессии');
        return;
      }
      this.$popups.success('Успех', 'Все другие сессии завершены');
      closeRoll(this.$refs.allSessionsContainer);
    },

    async changePassword({oldPassword, newPassword, newPasswordConfirm}) {
      if (newPassword !== newPasswordConfirm) {
        this.$refs.passwordForm.info = this.$refs.passwordForm.errors.newPasswordConfirm = this.$refs.passwordForm.errors.newPassword = 'Пароли не совпадают';
        this.$refs.passwordForm.showError();
        return;
      }
      if (newPassword?.length === 0) {
        this.$refs.passwordForm.info = 'Пароль не может быть пустым'
        this.$refs.passwordForm.errors.newPassword = 'Пароль не может быть пустым';
        this.$refs.passwordForm.showError();
        return;
      }

      this.$refs.passwordForm.loading = true;
      const response = await this.$api.updatePassword(oldPassword, newPassword);
      this.$refs.passwordForm.loading = false;

      if (response.ok_) {
        this.$popups.success('Изменено', 'Пароль успешно изменён');
        this.$refs.passwordForm.errors = {};
        return;
      }

      if (response.status_ === 401) {
        this.$refs.passwordForm.info = 'Пароль не подходит';
        this.$refs.passwordForm.errors.oldPassword = 'Старый пароль не такой';
        this.$refs.passwordForm.showError();
        return;
      }

      this.$popups.error('Не получилось сменить пароль', 'Неизвестная ошибка');
    },

    async logOut() {
      const response = await this.$api.signOut();
      if (!response.ok_) {
        this.$popups.error('Не получилось выйти из аккаунта', 'Неизвестная ошибка');
        return;
      }
      this.$user.setDefault();
      this.$router.push({name: 'signin'});
    },

    async getAnotherUser() {
      this.loading = true;
      const user = await this.$api.getAnotherUser(this.userId);
      this.loading = false;

      if (!user.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о пользователе");
        return;
      }
      this.user = {
        avatarImageId: user.avatarimageid,
        completedEvents: user.completedevents,
        id: user.id,
        joinedDate: user.joineddate,
        firstName: user.firstname,
        secondName: user.secondname,
        thirdName: user.thirdname,
        position: user.position,
        rating: user.rating,
        telegram: user.telegram,
        title: user.title,
      };
    },

    async getAchievements() {
      this.loadingAchievements = true;
      const achievements = await this.$api.getUserAchievements(this.user.id);
      this.loadingAchievements = false;

      if (!achievements.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список достижений");
        return;
      }
      this.achievements = achievements.achievements;
      await nextTick();
      openRollList(this.$refs.achievementsList);
    },

    async updateAvatar(dataURL) {
      this.loading = true;
      const response = await this.$api.uploadImage(dataURL);
      this.loading = false;
      if (!response.ok_) {
        this.$popups.error(`Ошибка ${response.status_}!`, `Не удалось загрузить картинку на сервер: ${response.info}`);
        return;
      }
      this.$popups.success('Загружено', 'Картинка загружена');
      const imageId = response.id;

      if (imageId === undefined)
        return;

      await this.deleteAvatar();

      this.user.avatarImageId = imageId;
      await this.saveAvatar();
    },
    async deleteAvatarClick() {
      if (!await this.$modal.confirm('Удаляем аватарку?', 'Восстановить не получится'))
        return;

      await this.deleteAvatar();

      this.user.avatarImageId = null;
      await this.saveAvatar();
    },
    async deleteAvatar() {
      if (!this.user.avatarImageId)
        return;

      this.loading = true;
      const res = await this.$api.deleteImage(this.user.avatarImageId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить изображение');
        return;
      }
    },
    async saveAvatar() {
      this.loading = true;
      const res = await this.$api.updateUserAvatarImageId(this.user.id, this.user.avatarImageId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось сохранить изображение');
        return;
      }
      this.$popups.success('Сохранено', 'Аватарка обновлена');
    },

    async confirmEmailSendMessage() {
      this.loadingConfirmEmail = true;
      const response = await this.$api.confirmEmailSendMessage();
      this.loadingConfirmEmail = false;

      if (response.ok_) {
        this.$popups.success('Письмо выслано', 'Найдите ссылку для подтверждения на вашей почте');
        this.$refs.form.errors = {};
        return;
      }

      if (response.status_ === 404) {
        this.$refs.form.errors.email = 'Email не зарегистрирован';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    },

    async saveAnotherUserTitle() {
      this.loadingConfirmEmail = true;
      const response = await this.$api.updateUserTitle(this.userId, this.user.title);
      this.loadingConfirmEmail = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось сохранить титул');
        return;
      }
      this.$popups.success('Сохранено', 'Титул есть - можно поесть');
    },

    async addAchievement() {
      this.loading = true;
      const response = await this.$api.addUserAchievement(this.user.id, this.selectedAchievement.id, this.selectedAchievement.level);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось добавить достижение');
        return;
      }

      this.selectedAchievement.achievementid = this.selectedAchievement.id;
      this.selectedAchievement.id = response.id;

      // delete another achievement levels
      this.achievements = this.achievements.filter(ach => ach.achievementid !== this.selectedAchievement.achievementid);

      this.achievements.push(this.selectedAchievement);
      this.selectedAchievement = undefined;
      this.$popups.success('Сохранено', 'АААААЧИВКА!');

      await nextTick();
      openRoll(this.$refs.achievementsList);
    },

    async deleteAchievement(id) {
      if (!await this.$modal.confirm("Удаление достижения", "Вы уверены, что хотитие удалить это достижение?"))
        return;

      this.loading = true;
      const response = await this.$api.deleteUserAchievement(id);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить достижение');
        return;
      }

      this.achievements.splice(this.achievements.findIndex((a) => a.id === id), 1);
      this.$popups.success('Достижение удалено', 'Вы убили деда');
    },

    onChange() {
      window.onbeforeunload = () => true;
      this.isEdited = true;
    },

    deepClone: deepClone,
  },

  watch: {
    '$route.query.userId': {
      handler: async function (to, from) {
        if (this.$route.path !== BASE_URL_PATH + '/profile') // go to another page
          return;

        this.userId = to;
        this.yours = this.userId === undefined;
        await nextTick();
        await this.init();
      },
      deep: true,
    }
  }
}
</script>

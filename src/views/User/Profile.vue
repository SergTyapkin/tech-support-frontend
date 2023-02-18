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
    gap 30px
    .achievement-container
      position relative
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

  .add-achievement
  .select-achievement
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
  .select-achievement
    overflow-y scroll
    block-dark-bg()
    padding 0
    .achievement
      padding 10px 10px
      display flex
      font-medium()
      transition all 0.2s ease
      cursor pointer
      &:hover
        background blocksBgColorHover
      .avatar
        border-radius(50%)
        min-width 60px
        min-height 60px
        width 60px
        height 60px
        margin-right 5px
        border 1px solid empColor2_2
      .text
        padding 10px
        .name
          font-middle()
          color textColor1
          line-height 0.8
          white-space nowrap
        .description
          font-small-extra()
          color textColor3
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
  .password-form-submit-container
    margin-top 0

.logout
  width 100%

.another-user-info
  margin-top 5px
  text-align center
  font-large()
  margin-bottom -10px

.image
.avatar-div
  width 80px
  height 80px
  border mix(textColor2, transparent) 1px solid
  border-radius(50%)
  position relative
  overflow hidden

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

              <CircleLoading v-if="loading"></CircleLoading>

              <div v-else-if="yours" class="avatar-container">
                <DragNDropLoader class="image-loader" @load="updateAvatar"
                                 :crop-size="cropSize"
                                 :compress-size="compressSize"
                >
                  <div class="avatar-div" @click.stop="updateAvatar(undefined)">
                    <UserAvatar :image-id="user.avatarImageId"></UserAvatar>
                  </div>
                </DragNDropLoader>
                <img v-if="user.avatarImageId" class="delete-avatar" src="../../res/trash.svg" alt="delete" @click.stop="deleteAvatarClick">
              </div>
              <div v-else class="avatar-div">
                <UserAvatar :image-id="user.avatarImageId"></UserAvatar>
              </div>

              <router-link :to="{name: 'ratings'}" class="position">
                <div>{{ user.position }}</div>
                <div class="info ">позиция</div>
              </router-link>
            </div>
            <div v-if="!yours" class="username">
              <div class="another-user-info">{{ $username(user) }}</div>
            </div>
            <input v-if="$user.isAdmin && !yours" type="text" class="title" v-model="user.title" @change="saveAnotherUserTitle" @keydown.enter="(event) => event.target.blur()">
            <div v-else class="title">{{ user.title }}</div>
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
          <div class="achievements">
            <div v-if="achievements.length === 0" class="info">Достижений пока что нет</div>
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
              ></Achievement>
              <div v-if="$user.isAdmin" class="delete-achievement" @click.stop.prevent="deleteAchievement(achievement.id)"><img src="../../res/trash.svg" alt="delete"></div>
            </router-link>
          </div>
          <div class="add-achievement" @click="getAllAchievements(); inSelectingAchievement = true" :class="{hidden: !$user.isAdmin || inSelectingAchievement || selectedAchievement}"><img src="../../res/plus.svg" alt="add achievement">Добавить достижение</div>
          <div class="select-achievement scrollable" :class="{hidden: !inSelectingAchievement}">
            <div v-for="achievement in allAchievements" @click="inSelectingAchievement = false; selectedAchievement = deepClone(achievement); selectedAchievement.level = 1" class="achievement">
              <AchievementAvatar :image-id="achievement.imageid" class="avatar"></AchievementAvatar>
              <div class="text">
                <div class="name">{{ $cropText(achievement.name, 30) }}</div>
                <div class="description">{{ $cropText(cleanupMarkdownPreview(achievement.description), 60) }}</div>
              </div>
            </div>
          </div>
          <div class="select-achievement-level" :class="{hidden: !selectedAchievement}">
            <Achievement :max-levels="selectedAchievement?.levels" :level="selectedAchievement?.level" :image-id="selectedAchievement?.imageid" class="avatar"></Achievement>
            <Range v-if="selectedAchievement" class="range" :min="1" :max="selectedAchievement.levels" :step="1" no-value v-model="selectedAchievement.level"></Range>
            <div class="button-select-achievement" @click="addAchievement()"><img src="../../res/save.svg" alt="save">Добавить</div>
          </div>
          <!-- ACHIEVEMENTS (END) -->

          <div v-if="yours">
            <FormExtended ref="form" no-bg
                  :fields="[
                    { title: 'ТВОЁ ИМЯ', jsonName: 'firstName' },
                    { title: 'ТВОЯ ФАМИЛИЯ', jsonName: 'secondName' },
                    { title: 'ТВОЁ ОТЧЕСТВО', jsonName: 'thirdName' },
                    { title: 'ТВОЙ Telegram', jsonName: 'telegram', type: 'telegram', info: 'всё что после @'},
                    { title: 'ТВОЙ E-mail', jsonName: 'email', type: 'email', info: user.isConfirmedEmail ? `<span class='__text-success'>Email подтвержден</span>` : `<b class='__text-error'>E-MAIL НЕ ПОДТВЕРЖДЕН. ВОССТАНОВИТЬ ПАРОЛЬ НЕ УДАСТСЯ</b>`},
                  ]"
                  :no-submit="true"
                  @input="onChange"
            ></FormExtended>
            <input v-if="!user.isConfirmedEmail && !loadingConfirmEmail" type="submit" value="Подтвердить E-mail" class="confirm-email-input" @click="confirmEmailSendMessage">
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
        <div v-if="yours" class="password-form-submit-container" @click.prevent="clickOnChangePassword">
          <input type="submit" value="Сменить пароль">
        </div>

        <button v-if="yours" class="button-logout" @click="logOut">Выйти</button>
      </Form>
    </div>

    <FloatingButton v-if="isEdited" title="Сохранить" green @click="changeData"><img src="../../res/save.svg" alt="save"></FloatingButton>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import FormExtended from "/src/components/FormExtended.vue";
import FloatingInput from "../../components/FloatingInput.vue";
import {isClosedRoll, openRoll} from "../../utils/show-hide";
import CircleLoading from "../../components/loaders/CircleLoading.vue";
import {nextTick} from "vue";
import {BASE_URL_PATH, IMAGE_MAX_RES, IMAGE_PROFILE_MAX_RES} from "../../constants";
import ImageUploader from "../../utils/imageUploader";
import DragNDropLoader from "../../components/DragNDropLoader.vue";
import ArrowListElement from "../../components/ArrowListElement.vue";
import TopBar from "../../components/TopBar.vue";
import UserAvatar from "../../components/UserAvatar.vue";
import Achievement from "../../components/Achievement.vue";
import AchievementAvatar from "../../components/AchievementAvatar.vue";
import Range from "../../components/Range.vue";
import {cleanupMarkdownPreview, deepClone} from "../../utils/utils";
import FloatingButton from "../../components/FloatingButton.vue";

export default {
  components: {
    FloatingButton,
    Range,
    AchievementAvatar,
    Achievement,
    UserAvatar, TopBar, ArrowListElement, DragNDropLoader, CircleLoading, FloatingInput, FormExtended, Form},

  data() {
    return {
      cropSize: IMAGE_PROFILE_MAX_RES,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, IMAGE_PROFILE_MAX_RES, IMAGE_MAX_RES),

      userId: this.$route.params.userId,
      yours: this.$route.params.userId === undefined,

      user: {},
      completedEvents: [],
      achievements: [],
      allAchievements: undefined,
      loading: false,
      loadingConfirmEmail: false,
      allAchievementsLoading: false,

      buttons: [],

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
      await this.$router.push('/');
    },

    async getAnotherUser() {
      this.loading = true;
      const user = await this.$api.getAnotherUser(this.userId);
      this.loading = false;

      if (!user.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о пользователе");
        return;
      }
      console.log(this.userId);
      this.user = {
        avatarImageId: user.avatarimageid,
        completedEvents: user.completedevents,
        id: user.id,
        isAdmin: user.isAdmin,
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
      this.loading = true;
      const achievements = await this.$api.getUserAchievements(this.user.id);
      this.loading = false;

      if (!achievements.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список достижений");
        return;
      }
      this.achievements = achievements.achievements;
    },
    async getAllAchievements(force=false) {
      if (this.allAchievements && !force)
        return;

      this.allAchievementsLoading = true;
      const achievements = await this.$api.getAchievements();
      this.allAchievementsLoading = false;

      if (!achievements.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить список всех достижений");
        return;
      }
      this.allAchievements = achievements.achievements;
    },

    async updateAvatar(dataURL) {
      // this.loading = true;
      const imageId = await this.ImageUploader.upload(dataURL);
      // this.loading = false;
      if (imageId === undefined)
        return;

      const res = await this.deleteAvatar();

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
      console.log(this.selectedAchievement)

      this.loading = true;
      const response = await this.$api.addUserAchievement(this.user.id, this.selectedAchievement.id, this.selectedAchievement.level);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось добавить достижение');
        return;
      }

      this.selectedAchievement.achievementid = this.selectedAchievement.id;
      this.selectedAchievement.id = response.id;
      this.achievements.push(this.selectedAchievement);
      this.selectedAchievement = undefined;
      this.$popups.success('Сохранено', 'АААААЧИВКА!');

      console.log(this.achievements)
      console.log(this.selectedAchievement)
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

    cleanupMarkdownPreview: cleanupMarkdownPreview,
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

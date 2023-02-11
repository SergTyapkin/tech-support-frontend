<style lang="stylus" scoped>
@require '../../styles/constants.styl'
@require '../../styles/buttons.styl'
@require '../../styles/fonts.styl'
@require '../../styles/utils.styl'


hr
  margin 0

.profile-plate
  margin-top 100px
  margin-bottom 100px
  padding 10px 30px 30px 30px
  border-radius 150px 150px 10px 10px / 100px 100px 10px 10px

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

.now-playing
  margin-top 5px

.admin-button
  button()
  margin 0 auto
  margin-top 40px
  width 30%
  min-width 300px
  margin-bottom -60px


.image
.avatar-div
  width 80px
  height 80px
  border mix(textColor2, transparent) 1px solid
  border-radius 50%
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
      <router-link v-if="yours && user.isAdmin" :to="{name: 'admin'}" class="admin-button  button rounded outline">На админскую</router-link>
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
              <div class="another-user-info">{{ user.name }}</div>
            </div>
            <input v-if="$user.isAdmin && !yours" type="text" class="title" v-model="user.title" @change="saveAnotherUserTitle" @keydown.enter="(event) => event.target.blur()">
            <div v-else class="title">{{ user.title }}</div>
          </div>

          <hr>

          <div class="quest-statistics ">
            <ArrowListElement :title="`Завершено мероприятий: ${completedEvents.length}`"
                              closed
                              :elements="completedEvents"
                              @click-inside="(eventData) => $router.push({name: 'event', params: {eventId: eventData.id}})"
            ></ArrowListElement>
          </div>

          <div v-if="yours">
            <FormExtended ref="form" no-bg
                  :fields="[
                    { title: 'ТВОЁ ИМЯ', jsonName: 'name' },
                    { title: 'ТВОЙ E-mail', jsonName: 'email', type: 'email', info: user.isConfirmedEmail ? `<span class='__text-success'>Email подтвержден</span>` : `<b class='__text-error'>E-MAIL НЕ ПОДТВЕРЖДЕН. ВОССТАНОВИТЬ ПАРОЛЬ НЕ УДАСТСЯ</b>`},
                  ]"
                  :no-submit="true"
            ></FormExtended>
            <input v-if="!user.isConfirmedEmail && !loadingConfirmEmail" type="submit" value="Подтвердить E-mail" class="confirm-email-input" @click="confirmEmailSendMessage">
            <CircleLoading v-if="loadingConfirmEmail"></CircleLoading>

            <input v-if="!$refs?.form?.loading" type="submit" value="Изменить данные" @click="changeData">
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

export default {
  components: {UserAvatar, TopBar, ArrowListElement, DragNDropLoader, CircleLoading, FloatingInput, FormExtended, Form},

  data() {
    return {
      cropSize: IMAGE_PROFILE_MAX_RES,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, IMAGE_PROFILE_MAX_RES, IMAGE_MAX_RES),

      userId: this.$route.params.userId,
      yours: this.$route.params.userId === undefined,

      user: {},
      completedEvents: [],
      loading: false,
      loadingConfirmEmail: false,

      buttons: [],

      base_url_path: this.$base_url_path,
      api_url: this.$api.apiUrl,
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

        this.buttons = [
          {name: 'В игру', to: this.base_url_path + '/play'},
          {name: 'Мои квесты', to: this.base_url_path + '/quests/my'},
          {name: 'Рейтинги', to: this.base_url_path + '/ratings'},
        ];
        this.addTitlesToArrowListings();
        return;
      }

      await this.getAnotherUser();
      this.addTitlesToArrowListings();
    },

    addTitlesToArrowListings() {
      this.completedEvents = this.user.completedEvents.map((eventData) => ({
        title: `${eventData.name} | ★${eventData.score}`,
        id: eventData.id,
        arrow: true,
        noClose: true,
      }));
    },

    validate(name, email) {
      let ok = true;
      if (name.length === 0) {
        this.$refs.form.errors.name = 'Имя не может быть пустым';
        ok = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'Email не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async changeData() {
      if (!await this.$modal.confirm("Изменение данных", "Если вы изменили E-mail, он станет неподтверждённым. Придётся подтверждать заново"))
        return;

      const name = this.$refs.form.values.name;
      const email = this.$refs.form.values.email;
      if (!this.validate(name, email))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.updateUser(this.user.id, email, name);
      this.$refs.form.loading = false;

      if (response.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$popups.success('Данные обновлены');
        this.$refs.form.errors = {};
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
        name: user.name,
        position: user.position,
        rating: user.rating,
        telegram: user.telegram,
        title: user.title,
      };
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
    }
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

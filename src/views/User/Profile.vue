<style lang="stylus" scoped>
@require '../../styles/constants.styl'

hr
  margin 0

.profile-plate
  padding 5px 30px 30px 30px
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
      font-size 30px
    //  .info
    //    overflow hidden
    //    max-height 0
    //    transition all 0.3s ease
    //.rating:hover
    //.position:hover
    //  .info
    //    max-height 20px


    .username
      margin-top 20px
      padding 5px
      padding-top 2px

  .quest-statistics
    padding 10px
    background #00000033
    .quest
      height 30px
      line-height 30px

  .confirm-email-input
    margin-bottom 20px
    color empColor2
    font-weight bold
  .password-form-container
    margin-bottom 0
  .password-form-submit-container
    margin-top 0

.logout
  width 100%

.another-user-info
  margin-top 5px

.now-playing
  margin-top 5px

.admin-button
  margin 30px auto
  width 30%
  min-width 300px
  display block


.avatar
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
.avatar-container
  .avatar-div:hover::before
    opacity 1
.avatar-container
  .image-loader.in-drag
    .avatar-div::after
      opacity 1
</style>

<template>
  <div>
    <div class="profile-page">
      <TopButtons arrows clickable :buttons="buttons"></TopButtons>

      <Form class="profile-plate">
        <div>
          <div class="info-container">
            <div class="top-container">
              <div class="rating">
                <div>★{{ user.rating }}</div>
                <div class="info text-small-x">рейтинг</div>
              </div>

              <CircleLoading v-if="loading"></CircleLoading>

              <div v-else-if="yours" class="avatar-container">
                <DragNDropLoader class="image-loader" @load="updateAvatar"
                                 :crop-size="cropSize"
                                 :compress-size="compressSize"
                >
                  <div class="avatar-div" @click.stop="updateAvatar(undefined)">
                    <img v-if="user.avatarimageid" class="avatar" :src="api_url + '/image/' + user.avatarimageid" alt="avatar">
                    <img v-else class="avatar" src="../../res/favicon.ico" alt="avatar">
                  </div>
                </DragNDropLoader>
                <img v-if="user.avatarimageid" class="delete-avatar" src="../../res/trash.svg" alt="delete" @click.stop="deleteAvatarClick">
              </div>
              <div v-else class="avatar-div">
                <img v-if="user.avatarimageid" class="avatar" :src="api_url + '/image/' + user.avatarimageid" alt="avatar">
                <img v-else class="avatar" src="../../res/favicon.ico" alt="avatar">
              </div>

              <div class="position">
                <div>{{ user.position }}</div>
                <div class="info text-small-x">позиция</div>
              </div>
            </div>
            <input v-if="yours" class="username text-big" v-model="username">
            <div v-else class="username text-big">
              <div>{{username}}</div>
              <div class="text-small another-user-info">{{ user.name }}</div>
            </div>
          </div>

          <hr>

          <div class="quest-statistics text-middle">
            <ArrowListElement :title="`Пройдено веток: ${completedBranches.length}`"
                              closed
                              :elements="completedBranches"
                              @click-inside="(branchInfo) => $router.push(`/quest?id=${branchInfo.id}`)"
            ></ArrowListElement>
            <ArrowListElement v-if="createdQuests.length"
                              :title="`Создано квестов: ${createdQuests.length}`"
                              closed
                              :elements="createdQuests"
                              @click-inside="(quest) => $router.push(`/quest?id=${quest.id}`)"
            ></ArrowListElement>
          </div>

          <hr>

          <div class="now-playing text-small link" v-if="user.chosenquest && user.chosenbranch">
            Сейчас играет в: <br>
            Квест: <router-link :to="base_url_path + `/quest?id=${user.chosenquestid}`">{{ user.chosenquest }}</router-link> <br>
            Ветка: <router-link :to="base_url_path + `/quest?id=${user.chosenquestid}`">{{ user.chosenbranch }}</router-link>
          </div>

          <div v-if="yours">
            <FormExtended ref="form" no-bg
                  :fields="[
                    { title: 'ТВОЁ ИМЯ', jsonName: 'name' },
                    { title: 'ТВОЙ E-mail', jsonName: 'email', type: 'email', info: user.isConfirmed ? `<span style='color: #448c30'>E-mail подтвержден</span>` : `<b style='color: #ff5b5b'>ТВОЙ EMAIL НЕ ПОДТВЕРЖДЕН. ИЗ-ЗА ЭТОГО НЕДОСТУПНЫ МНОГИЕ ФУНКЦИИ СЕРВИСА. ТЫ НЕ МОЖЕШЬ:</b><div style='color: #c46f6f'><div>Быть в рейтингах</div><div>Создавать квесты</div><div>Создавать команды</div><div>Оценивать квесты</div></div>`},
                  ]"
                  :no-submit="true"
            ></FormExtended>
            <input v-if="!user.isConfirmed && !loadingConfirmEmail" type="submit" value="Подтвердить E-mail" class="confirm-email-input" @click="confirmEmailSendMessage">
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

        <button v-if="yours" class="text-middle button bg outline rounded logout" @click="logOut">Выйти</button>
      </Form>

      <router-link v-if="yours && user.isAdmin" :to="base_url_path + `/admin`" class="admin-button text-big-x button rounded outline">На админскую</router-link>
    </div>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import FormExtended from "/src/components/FormExtended.vue";
import FloatingInput from "../../components/FloatingInput.vue";
import {isClosedRoll, openRoll} from "../../utils/show-hide";
import TopButtons from "../../components/TopButtons.vue";
import CircleLoading from "../../components/loaders/CircleLoading.vue";
import {nextTick} from "vue";
import {BASE_URL_PATH, IMAGE_MAX_RES, IMAGE_PROFILE_MAX_RES} from "../../constants";
import ImageUploader from "../../utils/imageUploader";
import DragNDropLoader from "../../components/DragNDropLoader.vue";
import ArrowListElement from "../../components/ArrowListElement.vue";

export default {
  components: {ArrowListElement, DragNDropLoader, CircleLoading, TopButtons, FloatingInput, FormExtended, Form},

  data() {
    return {
      cropSize: IMAGE_PROFILE_MAX_RES,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, IMAGE_PROFILE_MAX_RES, IMAGE_MAX_RES),

      username: '',

      id: this.$route.query.id,
      yours: this.$route.query.id === undefined,

      user: {},
      completedBranches: [],
      createdQuests: [],
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
        this.username = this.$user.username;
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
      this.username = this.user.username;
      const prevPage = this.$router.options.history.state.back;
      if (prevPage && prevPage !== this.base_url_path + '/ratings') {
        this.buttons = [
          {name: 'Назад', to: prevPage},
          {name: 'Рейтинги', to: this.base_url_path + '/ratings'},
        ];
      } else {
        this.buttons = [
          {name: 'Рейтинги', to: this.base_url_path + '/ratings'},
        ];
      }
      this.addTitlesToArrowListings();
    },

    addTitlesToArrowListings() {
      this.completedBranches = this.user.completedbranches.map((branchInfo) => {
        return {
          title: branchInfo.questtitle + ' | ' + branchInfo.branchtitle,
          id: branchInfo.questid,
          arrow: true,
          noClose: true,
        };
      });
      this.createdQuests = this.user.createdquests.map((quest) => {
        return {
          title: quest.title,
          id: quest.id,
          arrow: true,
          noClose: true,
        };
      });
    },

    validate(username, name, email) {
      let ok = true;
      if (username.length === 0) {
        this.$refs.form.errors.username = 'Логин не может быть пустым';
        ok = false;
      }
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
      if (!await this.$modal.confirm("Изменение данных", "Если вы изменили E-mail, он станет неподтверждённым. Придётся подтвердать заново"))
        return;

      const name = this.$refs.form.values.name;
      const email = this.$refs.form.values.email;
      const username = this.username;
      if (!this.validate(username, name, email))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.updateUser(email, username, name);
      this.$refs.form.loading = false;

      if (response.ok_) {
        await this.$store.dispatch('GET_USER');
        this.$popups.success('Данные обновлены');
        this.$refs.form.errors = {};
        return;
      }

      if (response.status_ === 409) {
        this.$refs.form.errors.username = 'Такой логин уже занят';
        this.$refs.form.errors.email = 'Или e-mail уже занят';
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
        this.$refs.passwordForm.errors.newPasswordConfirm = this.errors.newPassword = 'Пароли не совпадают';
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
      const user = await this.$api.getAnotherUser(this.id);
      this.loading = false;

      if (!user.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацио о пользователе");
        return;
      }

      this.user = user;
    },


    async updateAvatar(dataURL) {
      // this.loading = true;
      const imageId = await this.ImageUploader.upload(dataURL);
      // this.loading = false;
      if (imageId === undefined)
        return;

      const res = await this.deleteAvatar();

      this.user.avatarimageid = imageId;
      await this.saveAvatar();
    },
    async deleteAvatarClick() {
      if (!await this.$modal.confirm('Удаляем аватарку?', 'Восстановить не получится'))
        return;

      await this.deleteAvatar();

      this.user.avatarimageid = null;
      await this.saveAvatar();
    },
    async deleteAvatar() {
      if (!this.user.avatarimageid)
        return;

      this.loading = true;
      const res = await this.$api.deleteImage(this.user.avatarimageid);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить изображение');
        return;
      }
    },
    async saveAvatar() {
      this.loading = true;
      const res = await this.$api.updateUserAvatarImageId(this.user.avatarimageid);
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
    }
  },

  watch: {
    '$route.query.id': {
      handler: async function (to, from) {
        if (this.$route.path !== BASE_URL_PATH + '/profile') // go to another page
          return;

        this.id = to;
        this.yours = this.id === undefined
        await nextTick();
        await this.init();
      },
      deep: true,
    }
  }
}
</script>

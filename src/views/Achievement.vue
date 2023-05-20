<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/utils.styl'
@require '../styles/fonts.styl'


.root
  width 100%
  display flex
  align-items center
  .form-achievement
    margin 20px auto
    width 100%
    max-width 1400px
    @media ({mobile})
      padding 10px

    .row-description
    .row-levels
    .row-contacts
    .row-buttons
    .row-users-achieved
      display flex
      width 100%

    .row-description
      @media ({mobile})
        flex-direction column
        gap 10px
      .image-loader
        position relative
        width 128px
        height 128px
        margin-right 15px
        .achievement-image
          --border-color empColor2_4
        .avatar-div::before
        .avatar-div::after
        .image-overlay
          content 'Изменить'
          border-radius(50%)
          overflow hidden
          font-family Arial
          padding-left 5px
          font-size 15px
          text-align center
          display flex
          align-items center
          justify-content center
          position absolute
          inset 0
          background #000000AA
          z-index 1
          opacity 0
          transition opacity 0.3s ease
          cursor pointer
          user-select none
        .avatar-div::after
          content 'Отпустите, чтобы загрузить'
        .avatar-div:hover::before
          opacity 1
        .image-overlay
          opacity 1
          cursor not-allowed
      .image-loader.in-drag
        .avatar-div::after
          opacity 1

      .markdown-container
        flex 1
        .info
          font-small()
          color textColor4

    .row-levels
    .row-users-achieved
      &:not(.is-admin)
        flex-direction column
      @media ({mobile})
        flex-direction column
      .levels-container
      .avatar-examples
      .users-achieved
        .info
          font-small()
          color textColor4
          margin-bottom 5px

      .levels-container
        min-width 250px
        padding 10px 0
      .special-container
        .filters
          padding 10px

      .avatar-examples
      .users-achieved
        flex 1
        overflow-x scroll
        block-dark-bg()
        padding 10px
        .images-container
          display flex
          gap 40px
          padding 5px
          .image
            min-width 60px

    .row-contacts
      .user-link
        text-decoration underline
        cursor pointer
        pointer-events all
        &:hover
          transition all 0.2s ease
          filter brightness(2)

    .row-users-achieved
      .user-icon-container
        text-align center
        .user-avatar
          margin-left auto
          margin-right auto
          margin-bottom 4px
        .username
          font-small()
          color textColor4

    .row-buttons
      .button-delete
        button-danger()
        display flex
        align-items center
        justify-content center
        width min-content
        padding 10px 20px
        img
          width 30px
      .button-create
        button-submit()
        margin-left 20px
        img
          width 26px
          margin-right 10px

    .auto-info
      text-align center
      .auto-title
        font-large()
        color empColor1_1
        display flex
        align-items center
        justify-content center
        img
          height 20px
          width 20px
      .auto-description
        font-small()
        color textColor4
        margin-bottom 50px
</style>

<template>
  <div class="root" css-fullheight @input="onChange">
    <Form :noSubmit="!$user.canEditAchievements" class="form-achievement" :class="{'is-admin': $user.canEditAchievements}" @submit="updateAchievementData">
      <FloatingInput v-model="achievement.name" title="Название" :readonly="!$user.canEditAchievements" no-info class="input"></FloatingInput>

      <div class="row-description">
        <DragNDropLoader v-if="$user.canEditAchievements && achievementId !== undefined"
                         class="image-loader"
                         @load="updateAvatar"
                         :crop-size="cropSize"
                         :compress-size="compressSize"
        >
          <div class="avatar-div" @click.stop="updateAvatar(undefined)">
            <AchievementAvatar class="achievement-image" :image-id="achievement.imageid" size="128px" border-offset="2px" border-width="2px"></AchievementAvatar>
          </div>
        </DragNDropLoader>
        <div v-else class="image-loader">
          <AchievementAvatar class="achievement-image" :image-id="achievement.imageid" size="128px" border-offset="2px" border-width="2px"></AchievementAvatar>
          <div class="image-overlay" v-if="$user.canEditAchievements">Изображение можно будет изменить после создания</div>
        </div>

        <div class="markdown-container">
          <RedactorAndRenderer info="Описание" @input="onChange" v-model="achievement.description" placeholder="Описание" :show-initial-preview="achievementId !== undefined" :can-edit="$user.canEditAchievements"></RedactorAndRenderer>
        </div>
      </div>

      <div v-if="achievement.auto" class="auto-info">
        <div class="auto-title">Авто-достижение <img src="../res/locked.svg" alt="locked"></div>
        <div class="auto-description">Выставляется автоматически при выполнении каких-то критериев</div>
      </div>

      <div class="row-levels" :class="{'is-admin': $user.canEditAchievements}">
        <div class="column-settings">
          <div class="levels-container" v-if="$user.canEditAchievements">
            <div class="info">Количество уровней</div>
            <Range
              no-value
              :min="1"
              :max="5"
              :step="1"
              v-model="achievement.levels"
              class="range"
              :disabled="achievement.special || achievement.auto"
              @change="() => {
                onChange();
                this.lastLevelsCount = this.achievement.levels
              }"
            ></Range>
          </div>
          <div class="special-container">
            <Filters v-if="$user.canEditAchievements || achievement.special"
                     class="filters"
                     :filters="filters"
                     can-be-none
                     :disabled="!$user.canEditAchievements || achievement.auto"
                     @change="(filter) => {
                       onChange();
                       achievement.special = filter.value;
                       filter.value ? achievement.levels = 1 : achievement.levels = lastLevelsCount
                     }"
            ></Filters>
          </div>
        </div>
        <div class="avatar-examples scrollable">
          <div class="info">Изображения по уровням</div>
          <div class="images-container">
            <Achievement class="image" v-if="achievement.levels" v-for="i in Number(achievement.levels)" :image-id="achievement.imageid" :level="i" :special="achievement.special" :max-levels="Number(achievement.levels)"></Achievement>
          </div>
        </div>
      </div>

      <div v-if="achievementId !== undefined" class="row-contacts">
        <FloatingInput v-model="achievement.authorname" title="Автор достижения" readonly no-info class="input"></FloatingInput>
        <a v-if="achievement.authortelegram" :href="`https://t.me/${achievement.authortelegram}`" target="_blank" class="user-link">
          <FloatingInput :model-value="`@${achievement.authortelegram}`" title="Связь с автором" readonly no-info class="input"></FloatingInput>
        </a>
      </div>

      <div class="row-users-achieved">
        <div class="users-achieved scrollable">
          <div class="info">Достижение получили</div>
          <div class="images-container">
            <router-link v-for="user in achievement.usersachieved" :to="{name: 'profile', params: {userId: user.id}}" class="user-icon-container">
              <UserAvatar class="user-avatar" :image-id="user.avatarimageid" size="80px"></UserAvatar>
              <div class="username">{{ user.username }}</div>
            </router-link>
          </div>
        </div>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>
      <div v-else-if="$user.canEditAchievements" class="row-buttons">
        <div v-if="achievementId === undefined" class="button-create" @click="createAchievement"><img src="../res/save.svg" alt="">Создать достижение</div>
        <div v-else-if="!achievement.auto" class="button-delete" @click="deleteAchievement"><img src="../res/trash.svg" alt="delete">Удалить</div>
      </div>
    </Form>

    <FloatingButton v-if="isEdited && achievementId !== undefined" title="Сохранить" green @click="updateAchievementData">
      <img src="../res/save.svg" alt="save">
    </FloatingButton>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";
import FloatingButton from "../components/FloatingButton.vue";
import AchievementAvatar from "../components/AchievementAvatar.vue";
import Achievement from "../components/Achievement.vue";
import Range from "../components/Range.vue";
import DragNDropLoader from "../components/DragNDropLoader.vue";
import {IMAGE_MAX_RES, IMAGE_ACHIEVEMENT_MAX_RES} from "../constants";
import ImageUploader from "../utils/imageUploader";
import RedactorAndRenderer from "../components/Markdown/RedactorAndRenderer.vue";
import UserAvatar from "../components/UserAvatar.vue";
import Filters from "../components/Filters.vue";


export default {
  components: {
    Filters,
    UserAvatar,
    RedactorAndRenderer,
    Achievement,
    DragNDropLoader,
    Range, AchievementAvatar, FloatingButton, CircleLoading, Form, FloatingInput},

  data() {
    return {
      cropSize: IMAGE_ACHIEVEMENT_MAX_RES,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, IMAGE_ACHIEVEMENT_MAX_RES, IMAGE_MAX_RES),

      achievementId: this.$route.params.achievementId,

      achievement: {},

      filters: [{name: 'Редкое'}],
      lastLevelsCount: undefined,

      loading: false,
      isEdited: false,
    }
  },

  async mounted() {
    if (this.achievementId === undefined) {
      this.achievement.levels = 3;
      this.achievement.special = false;
      return;
    }
    await this.getAchievementData();
  },


  methods: {
    async getAchievementData() {
      this.loading = true;
      let response = await this.$api.getAchievementById(this.achievementId);
      this.loading = false;
      if (!response.ok_) {
        this.$popups.error("Ошибка", "Не удалось получить информацию о достижении. " + (response.info || ""));
        return;
      }
      this.achievement = response;
      this.filters[0].value = this.achievement.special;
      this.lastLevelsCount = this.achievement.levels;
    },

    async updateAchievementData() {
      this.loading = true;
      const res = await this.$api.editAchievement(this.achievementId, this.achievement.name, this.achievement.description, this.achievement.levels, this.achievement.special);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось изменить достижение. " + (res.info || ""));
        return;
      }
      window.onbeforeunload = null;
      this.isEdited = false;
      this.$popups.success("Обновлено", "Данные достижения сохранены");
    },

    async createAchievement() {
      if (!this.achievement.name || !this.achievement.description || !this.achievement.levels) {
        this.$modal.alert("Заполните все поля", "Название или описание не заполнены");
        return;
      }

      this.loading = true;
      const res = await this.$api.createAchievement(this.achievement.name, this.achievement.description, this.achievement.levels, this.achievement.special);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось создать достижение. " + (res.info || ""));
        return;
      }
      window.onbeforeunload = null;
      this.isEdited = false;
      this.$popups.success("Создано", "Достижение создано");

      this.$router.push({name: "achievement", params: {achievementId: res.id}});
      this.achievementId = res.id;
      await this.getAchievementData();
    },

    onChange() {
      window.onbeforeunload = () => true;
      this.isEdited = true;
    },

    async deleteAchievement() {
      if (!await this.$modal.confirm("Удаление достижения", "Восстановить не получится! Оно удалится у всех пользователей, получивших это достижение. Вы уверены?"))
        return;

      this.loading = true;
      await this.deleteAvatar();
      const res = await this.$api.deleteAchievement(this.achievementId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось удалить достижение");
        return;
      }
      this.$popups.success("Удалено", "Удалено и у всех пользователей, получивших это достижение");
      this.$router.push({name: "admin"});
    },

    async updateAvatar(dataURL) {
      // this.loading = true;
      const imageId = await this.ImageUploader.upload(dataURL);
      // this.loading = false;
      if (imageId === undefined)
        return;

      const res = await this.deleteAvatar();

      this.achievement.imageid = imageId;
      await this.saveAvatar();
    },
    async deleteAvatar() {
      if (!this.achievement.imageid)
        return;

      this.loading = true;
      const res = await this.$api.deleteImage(this.achievement.imageid);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить изображение');
        return;
      }
    },
    async saveAvatar() {
      this.loading = true;
      const res = await this.$api.updateAchievementImage(this.achievement.id, this.achievement.imageid);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error('Ошибка', 'Не удалось сохранить изображение');
        return;
      }
      this.$popups.success('Сохранено', 'Картинка обновлена');
    },
  },
}
</script>

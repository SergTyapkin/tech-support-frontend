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
      display flex
      width 100%

    .row-description
      .image-loader
        position relative
        border-radius 50%
        overflow hidden
        outline 2px solid empColor2_4
        width 128px
        height 128px
        margin-right 15px
        .image
          width 128px
          height 128px
          outline-offset 2px
        .avatar-div::before
        .avatar-div::after
        .image-overlay
          content 'Изменить'
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

      .textarea
        flex 1
        textarea()
        resize none

    .row-levels
      .levels-container
      .avatar-examples
        .info
          font-small()
          color textColor4
          margin-bottom 5px

      .levels-container
        min-width 250px
        padding 10px 0

      .avatar-examples
        flex 1
        overflow-x scroll
        block-dark-bg()
        padding 10px
        .images-container
          display flex
          gap 40px
          padding 5px
          .image-div
            position relative
            width 60px
            height 60px
            overflow visible
            .image
              border-radius 50%
              outline 2px solid empColor2_1
              outline-offset 2px
              width 60px
              height 60px
            &::before
              content ""
              position absolute
              bottom -5px
              left 50%
              transform translateX(-50%)
              font-medium()
              font-family monospace
              z-index 2
            &::after
              z-index 1

            &:nth-child(1)
              &::before
                content "I"
                color colorSilver
              .image
                outline-color colorSilver
            &:nth-child(2)
              &::before
                content "II"
                color colorBronze
              .image
                outline-color colorBronze
            &:nth-child(3)
              &::before
                content "III"
                color colorGold
              .image
                outline-color colorGold
            &:nth-child(4)
              &::before
                content "IV"
            &:nth-child(5)
              &::before
                content "V"
            &:nth-last-child(1)
              &::after
                content ""
                background url("../res/hearthstone_legendary_card.png") no-repeat
                background-size contain
                position absolute
                inset -15px
                right -30px
              &::before
                bottom -9px
                color colorGold
            &:nth-last-child(2)
              &::after
                content ""
                background url("../res/hearthstone_silver_legendary_card.png") no-repeat
                background-size contain
                position absolute
                top -10px
                left -18px
                right -27px
                bottom -10px
              &::before
                bottom -6px
                font-weight bold
                color mix(colorBronze, black, 30%)

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
</style>

<template>
  <div class="root" css-fullheight @input="onChange">
    <Form :noSubmit="!$user.isAdmin" class="form-achievement" :class="{'is-admin': $user.isAdmin}" @submit="updateAchievementData">
      <FloatingInput v-model="achievement.name" title="Название" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>

      <div class="row-description">
        <DragNDropLoader v-if="achievementId !== undefined"
                         class="image-loader"
                         @load="updateAvatar"
                         :crop-size="cropSize"
                         :compress-size="compressSize"
        >
          <div class="avatar-div" @click.stop="updateAvatar(undefined)">
            <AchievementAvatar :image-id="achievement.imageid"></AchievementAvatar>
          </div>
        </DragNDropLoader>
        <div v-else class="image-loader">
          <AchievementAvatar :image-id="achievement.imageid"></AchievementAvatar>
          <div class="image-overlay">Изображение можно будет изменить после создания</div>
        </div>

        <textarea class="textarea scrollable" :readonly="!$user.isAdmin" v-model="achievement.description" placeholder="Описание"></textarea>
      </div>

      <div class="row-levels">
        <div class="levels-container">
          <div class="info">Количество уровней</div>
          <Range no-value :min="1" :max="5" :step="1" v-model="achievement.levels" class="range" @change="onChange"></Range>
        </div>
        <div class="avatar-examples scrollable">
          <div class="info">Изображения по уровням</div>
          <div class="images-container">
            <div class="image-div" v-if="achievement.levels" v-for="i in Number(achievement.levels)">
              <AchievementAvatar :alt="`image-${i}`" :image-id="achievement.imageid"></AchievementAvatar>
            </div>
          </div>
        </div>
      </div>

      <div v-if="achievementId !== undefined" class="row-contacts">
        <FloatingInput v-model="achievement.authorname" title="Автор достижения" readonly no-info class="input"></FloatingInput>
        <FloatingInput v-model="achievement.authoremail" title="Связь с автором" readonly no-info class="input"></FloatingInput>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>
      <div v-else class="row-buttons">
        <div v-if="$user.isAdmin && achievementId !== undefined" class="button-delete" @click="deleteAchievement"><img src="../res/trash.svg" alt="delete">Удалить</div>
        <div v-if="achievementId === undefined" class="button-create" @click="createAchievement"><img src="../res/save.svg" alt="">Создать достижение</div>
      </div>
    </Form>

    <FloatingButton v-if="isEdited" title="Сохранить" green @click="updateAchievementData">
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
import Range from "../components/Range.vue";
import DragNDropLoader from "../components/DragNDropLoader.vue";
import {IMAGE_MAX_RES, IMAGE_ACHIEVEMENT_MAX_RES} from "../constants";
import ImageUploader from "../utils/imageUploader";


export default {
  components: {
    DragNDropLoader,
    Range, AchievementAvatar, FloatingButton, CircleLoading, Form, FloatingInput},

  data() {
    return {
      cropSize: IMAGE_ACHIEVEMENT_MAX_RES,
      compressSize: IMAGE_MAX_RES,

      ImageUploader: new ImageUploader(this.$popups, this.$api.uploadImage, IMAGE_ACHIEVEMENT_MAX_RES, IMAGE_MAX_RES),

      achievementId: this.$route.params.achievementId,

      achievement: {},

      loading: false,
      isEdited: false,
    }
  },

  async mounted() {
    if (this.achievementId === undefined) {
      this.achievement.levels = 3;
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
    },

    async updateAchievementData() {
      this.loading = true;
      const res = await this.$api.editAchievement(this.achievementId, this.achievement.name, this.achievement.description, this.achievement.levels, this.achievement.imageid);
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
      const res = await this.$api.createAchievement(this.achievement.name, this.achievement.description, this.achievement.levels);
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
      if (!await this.$modal.confirm("Удаление достижения", "Восстановить не получится! У всех пользователей, получивших это достижение, оно замменится на \"Неизвестное достижение\". Вы уверены?"))
        return;

      this.loading = true;
      const res = await this.$api.deleteAchievement(this.achievementId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось удалить достижение");
        return;
      }
      this.$popups.success("Удалено", "У всех пользователей, получивших это достижение, оно замменится на \"Неизвестное достижение\"");
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

<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/forms.styl'

.root
  padding 40px 60px
  display flex
  flex-direction column
  @media ({mobile})
    padding-bottom (header-height-mobile + 20px)
    padding-left 10px
    padding-right 10px

  .info-inputs
    margin-bottom 20px

  .title
    font-large()
    border-bottom 1px solid borderColor
    padding-bottom 10px
    margin-bottom 20px
    letter-spacing 2px
  .error-text
    color colorNo
    margin-top 10px
    font-small()
  .text.error
    color colorNo
    border 1px solid colorNo


  .input
    margin-top 10px
  .input.place
  .input.position
    width 100%
    max-width 400px
    display inline-block
  .input.place
    margin-right 20px

  .buttons-container
    > *
      display flex
      align-items center
      justify-content center
      margin-bottom 20px
      img
        width 26px
        height 26px
        margin-right 10px
    .save-button
      button-submit()
      margin-bottom 30px
    .delete-button
      button-danger()
      width min-content
      margin 0 auto
      padding 10px 20px

  .user-link
    text-decoration underline
    cursor pointer
    pointer-events all
    &:hover
      transition all 0.2s ease
      filter brightness(2)
</style>

<template>
  <div class="root" css-fullheight @input="onChange">
    <FloatingInput title="Название" ref="title" :readonly="!$user.isAdmin" v-model="title" no-info class="title input"></FloatingInput>
    <div class="info-inputs">
      <SelectList v-model="place" @input="onChange" :selected-id="placeId" :list="allPlaces" ref="place" title="Место" :readonly="!$user.isAdmin" class="place input" solid></SelectList>
      <SelectList v-model="position" @input="onChange" :selected-id="positionId" :list="allPositions" ref="position" title="Направленность" :readonly="!$user.isAdmin" class="position input" solid></SelectList>
    </div>
    <div class="error-text" v-if="errorText.length">{{ errorText }}</div>
    <RedactorAndRenderer info="Редактор" v-model="text" @input="errorText = ''; onChange()" :class="{error: errorText.length}" placeholder="Текст" :show-initial-preview="docId !== undefined"></RedactorAndRenderer>

    <FloatingInput v-model="authorname" title="Автор" readonly no-info class="input"></FloatingInput>
    <a v-if="authortelegram" :href="`https://t.me/${authortelegram}`" target="_blank" class="user-link">
      <FloatingInput :model-value="`@${authortelegram}`" title="Связь с автором" readonly no-info class="input"></FloatingInput>
    </a>

    <CircleLoading v-if="loading"></CircleLoading>
    <div class="buttons-container" v-else-if="$user.isAdmin && this.docId === undefined">
      <div class="save-button" @click="createDoc"><img src="../res/save.svg" alt="">Создать документ</div>
    </div>
    <div class="buttons-container" v-else-if="$user.isAdmin">
      <div class="delete-button" @click="deleteDoc"><img src="../res/trash.svg" alt="">Удалить</div>
    </div>

    <FloatingButton v-if="isEdited && this.docId !== undefined" title="Сохранить" green @click="updateDoc"><img src="../res/save.svg" alt="save"></FloatingButton>
  </div>
</template>


<script>
import FormExtended from "/src/components/FormExtended.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";
import SelectList from "../components/SelectList.vue";
import FloatingButton from "../components/FloatingButton.vue";
import RedactorAndRenderer from "../components/Markdown/RedactorAndRenderer.vue";


export default {
  components: {RedactorAndRenderer, FloatingButton, SelectList, FloatingInput, CircleLoading, FormExtended},

  data() {
    return {
      loading: true,

      title: undefined,
      text: undefined,
      placeId: undefined,
      place: undefined,
      positionId: undefined,
      position: undefined,
      authorname: undefined,
      authortelegram: undefined,
      allPlaces: [],
      allPositions: [],

      docId: this.$route.params.docId,

      errorText: '',
      isEdited: false,
    }
  },

  async mounted() {
    if (this.docId === undefined) {
      if (!this.$user.isAdmin) {
        this.$popups.error("Ошибка", "id документа нет в строке запроса");
        this.$router.push({name: "default"});
        return;
      }
    } else {
      this.loading = true;
      const response = await this.$api.getDocById(this.docId);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось получить документ');
        return;
      }

      this.title = response.title;
      this.text = response.text;
      this.placeId = response.placeid;
      this.positionId = response.positionid;
      this.authorname = response.authorname;
      this.authortelegram = response.authortelegram;
    }
    this.$scroll.restore();

    this.loading = true;
    const allPlaces = await this.$api.getPlaces();
    this.loading = false;

    if (!allPlaces.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мест проведения мероприятий');
      return;
    }
    this.allPlaces = allPlaces.places;


    this.loading = true;
    const allPositions = await this.$api.getPositions();
    this.loading = false;

    if (!allPositions.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить направленностей');
      return;
    }
    this.allPositions = allPositions.positions;
  },


  methods: {
    async createDoc() {
      this.placeId = this.place.id;
      this.positionId = this.position.id;

      this.loading = true;
      const res = await this.$api.createDoc(this.title, this.text, this.placeId, this.positionId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить изменения");
        return;
      }
      this.$popups.success("Сохранено", "документация обновлена");

      window.onbeforeunload = null;
      this.isEdited = false;
      this.$router.push({name: "docs"});
    },

    async updateDoc() {
      this.placeId = this.place.id;
      this.positionId = this.position.id;
      if (!this.title) {
        this.$refs.title.error = 'Название не может быть пустым';
        return;
      }
      if (!this.text) {
        this.errorText = 'Текст не может быть пустым';
        return;
      }

      this.loading = true;
      const res = await this.$api.editDoc(this.docId, this.title, this.text, this.placeId, this.positionId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить изменения");
        return;
      }
      this.$popups.success("Сохранено", "документация обновлена");

      window.onbeforeunload = null;
      this.isEdited = false;
    },

    async deleteDoc() {
      if (!await this.$modal.confirm("Удаление документа", "Вы уверены, что хотите безвозвратно удалить документ? Восстановить не получится"))
        return;

      this.loading = true;
      const res = await this.$api.deleteDoc(this.docId);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось удалить документ");
        return;
      }
      window.onbeforeunload = null;
      this.isEdited = false;
      this.$router.push({name: "docs"});
    },

    onChange() {
      window.onbeforeunload = () => true;
      this.isEdited = true;
    },
  }
}
</script>

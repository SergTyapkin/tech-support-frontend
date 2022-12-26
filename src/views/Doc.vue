<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/forms.styl'

.root
  padding 40px 60px
  width 100%
  display flex
  flex-direction column
  @media ({mobile})
    padding-left 10px
    padding-right 10px
  .title
    font-large()
    border-bottom 1px solid borderColor
    padding-bottom 10px
    margin-bottom 20px
    letter-spacing 2px
  .text
    textarea()
    font-medium()
    margin-top 10px
    color textColor2
    transition none
    resize none
    flex 1

  .input
    margin-top 10px

  .buttons-container
    > *
      display flex
      align-items center
      justify-content center
      margin-bottom 20px
      img
        width 26px
        margin-right 10px
    .save-button
      button-submit()
      margin-bottom 50px
    .delete-button
      button-danger()
      width 50%
      margin 0 auto
</style>

<template>
  <div class="root" css-fullheight>
    <CircleLoading v-if="loading"></CircleLoading>

    <FloatingInput class="title" title="Название" :readonly="!$user.isAdmin" v-model="title" no-info></FloatingInput>
    <FloatingInput v-model="placeName" list="places" title="Место проведения" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
    <datalist id="places">
      <option v-for="place in allPlaces">{{place.name}}</option>
    </datalist>
    <FloatingInput v-model="positionName" list="positions" title="Направленность" :readonly="!$user.isAdmin" no-info class="input"></FloatingInput>
    <datalist id="positions">
      <option v-for="position in allPositions">{{position.name}}</option>
    </datalist>
    <textarea class="text scrollable" :readonly="!$user.isAdmin" v-model="text"></textarea>

    <div class="buttons-container" v-if="$user.isAdmin">
      <div class="save-button" @click="saveDoc"><img src="../res/save.svg" alt="">Сохранить изменения</div>
      <div class="delete-button" @click="deleteDoc"><img src="../res/trash.svg" alt="">Удалить</div>
    </div>
  </div>
</template>


<script>
import FormExtended from "/src/components/FormExtended.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";

export default {
  components: {FloatingInput, CircleLoading, FormExtended},

  data() {
    return {
      loading: true,

      title: undefined,
      text: undefined,
      placeId: undefined,
      placeName: undefined,
      positionId: undefined,
      positionName: undefined,
      allPlaces: [],
      allPositions: [],

      docId: this.$route.params.docId,
    }
  },

  async mounted() {
    if (this.docId === undefined) {
      this.$popups.error("Ошибка", "id документа нет в строке запроса");
      this.$router.push({name: "default"});
      return;
    }
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
    this.placeName = response.placename;
    this.positionId = response.positionid;
    this.positionName = response.positionname;


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
    async saveDoc() {
      this.loading = true;
      const res = await this.$api.editDoc(this.docId, this.title, this.text);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить изменения");
        return;
      }
      this.title = res.title;
      this.text = res.text;
      this.placeId = res.placeid;
      this.positionId = res.positionid;
    },

    async notParticipate() {
      this.loading = true;
      const res = await this.$api.notParticipateInDoc(this.docId, this.$user.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось отказаться от мероприятия");
        return;
      }
      this.doc.isyouparticipate = false;
    }
  }
}
</script>

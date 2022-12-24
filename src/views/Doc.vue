<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'

.root
  margin-top 120px
  padding 0 70px
  width 100%
  height 100%
  .title
    font-large()
    border-bottom 1px solid borderColor
    padding-bottom 10px
    margin-bottom 20px
    letter-spacing 2px
  .text
    font-medium()
    margin-top 10px
    color textColor2
    resize vertical
    transition none
</style>

<template>
  <div class="root">
    <CircleLoading v-if="loading"></CircleLoading>

    <FloatingInput class="title" title="Название" :readonly="!$user.isAdmin" v-model="title"></FloatingInput>
    <textarea class="text scrollable" rows="10" :readonly="!$user.isAdmin" v-model="text"></textarea>

    <div class="buttons-container" v-if="$user.isAdmin">
      <div class="save-button" @click="saveDoc">Сохранить изменения</div>
      <div class="delete-button" @click="deleteDoc">Удалить</div>
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

      title: '',
      text: '',
      placeId: '',
      positionId: '',

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
    this.positionId = response.positionid;
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

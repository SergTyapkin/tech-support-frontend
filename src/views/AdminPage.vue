<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

adminBg1 = #D3D3D3
adminBg2 = #BABABA
adminBg3 = #A1A1A1
adminBg4 = #888888
adminBg5 = #6F6F6F


.allBoards
  width 100%
  height 90%
  justify-content center
  align-items center
  display flex

.aB1
  top 0
  margin-left 10%
  background adminBg5
.aB2
  top 30px
  margin-left 5%
  background adminBg4
.aB3
  top 60px
  margin-left 0
  background adminBg3
.aB4
  top 90px
  margin-left -5%
  background adminBg2
.aB5
  top 120px
  margin-left -10%
  background adminBg1
@media ({mobile})
  .aB1
    top 0
  .aB2
    top 60px
  .aB3
    top 120px
  .aB4
    top 180px
  .aB5
    top 240px

.adminBoard
  margin-top 20px
  position absolute
  width 800px
  height 600px
  z-index 0
  border 6px double #000
  block()
  backdrop-filter blur(10px)
  @media ({mobile})
    width 600px
    margin-left 0
    height 1050px

.panelTitle
  font-size 20px
  padding-left 25px
  width 100%
  color #000
  @media ({mobile})
    font-size 30px
.panelTitleBottom
  position absolute
  bottom 0

.newEventForm
  padding 15px
  margin-top 20px
  margin-bottom 20px
  background bgColor
  display flex
  max-width 90%
  @media ({mobile})
    flex-direction column

.info1
  resize none
  height 200px
  border-bottom 1px solid empColor1_1
.info1:focus
  border 1px solid empColor1_1

.timeNewEvent
  margin-top 10px
  display flex
  justify-content: space-between
.inputDT
  width 120px

.contentNewEvent
  padding 15px
</style>

<template>
  <div class="allBoards">
    <div class="adminBoard aB1" @click="atTop(1)">
      <div class="panelTitle">Создать новое мероприятие</div>
      <Form class="newEventForm" @submit="generateEvent">
        <div class="contentNewEvent">
          <FloatingInput title="Название" class="nameNewEvent" id="eventName" required></FloatingInput>
          <textarea placeholder="Описание" class="info1" id="eventDes"></textarea>
          <div class="timeNewEvent">
            <FloatingInput type="date" title="Дата" class="inputDT" id="eventDate" required></FloatingInput>
            <FloatingInput type="time" title="Начало в" class="inputDT" id="eventBegin"></FloatingInput>
            <FloatingInput type="time" title="Конец в" class="inputDT" id="eventEnd"></FloatingInput>
          </div>
        </div>
        <div class="contentNewEvent">
          <FloatingInput title="Приходить с" type="time" id="techBegin" required></FloatingInput>
          <FloatingInput title="Оставаться до" type="time" id="techEnd" required></FloatingInput>
          <FloatingInput title="Столько людей" type="number" id="peopleNeed"></FloatingInput>
          <FloatingInput list="placesL" title="Место проведения" id="eventPlace" required></FloatingInput>
          <datalist id="placesL">
            <option v-for="item in placesL">{{item.name}}</option>
          </datalist>
          <FloatingInput value="Создать" type="submit"></FloatingInput>
        </div>
      </Form>
      <div class="panelTitle panelTitleBottom">Создать новое мероприятие</div>
	  </div>
    <div class="adminBoard aB2" @click="atTop(2)"></div>
    <div class="adminBoard aB3" @click="atTop(3)"></div>
    <div class="adminBoard aB4" @click="atTop(4)"></div>
    <div class="adminBoard aB5" @click="atTop(5)"></div>
  </div>
</template>

<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";
import UsersTable from "../components/UsersTable.vue";

export default {
  components: {CircleLoading, Form, FloatingInput, UsersTable},

  data () {
	  return {
    }
  },

  async mounted () {
    this.loading = true;
    const placesList = await this.$api.getPlaces();
    this.loading = false;

    if (!placesList.ok_) {
      this.$popups.error('Ошибка', 'Что-то не то с местами проведения мероприятий');
      return;
    }

    this.placesL = placesList.places;
  },

  methods: {
    atTop (el) {
      el -= 1;
      for (let i = 0; i < 5; i++) {
        if (i >= el) {
          document.getElementsByClassName("adminBoard")[i].style.zIndex = 4 - i;
        } else {
          document.getElementsByClassName("adminBoard")[i].style.zIndex = 0;
        }
      }
    },

    async generateEvent () {
    }
  },
}
</script>


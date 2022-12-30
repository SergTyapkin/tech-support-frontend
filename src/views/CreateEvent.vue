<style lang="stylus" scoped>
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
</template>

<script>
import FloatingInput from "../components/FloatingInput.vue";


export default {
  components: {FloatingInput}
}
</script>


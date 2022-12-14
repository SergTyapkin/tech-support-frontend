<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/buttons.styl'

borderRadius = 5px
width = 200px
height = 300px

.root
  width width
  height height
  border solid 1px colorBorder
  border-radius borderRadius
  .header
    border-bottom solid 1px colorBorder
    .text
      text-large()
      color textColor1
    .time
      color textColor2

  .main
    > *
      font-small()
      color textColor3
      margin 10px 0

  .button-info
    button-submit()
</style>

<template>
  <div class="root">
    <Form>
      <header class="header">
        <div class="text">{{ name }}</div>
        <div class="time">{{ date }} ({{timeStart}} - {{timeEnd}})</div>
      </header>
      <main class="main">
        <div class="description">{{ description }}</div>
        <div class="place">Place: {{ placeName }}</div>
        <div class="time">Event time: {{eventTimeStart}} - {{eventTimeEnd}}</div>
        <div class="people">People needs: {{needPeopleTotal}}</div>
      </main>

      <router-link :to="$base_url_path + '/event/' + id" class="button-info">Подробнее</router-link>
    </Form>
  </div>
</template>

<script>
import Form from "./Form.vue";

export default {
  components: {Form},
  props: {
    id: Number,
    name: String,
    description: String,
    date: String,
    timeStart: String,
    timeEnd: String,
    eventTimeStart: String,
    eventTimeEnd: String,
    needPeople: Array,
    placeId: Number,
    placeName: String,
    authorId: Number,
    authorName: String,
  },

  data() {
    return {
      loading: false,
      needPeopleTotal: this.$props.needPeople?.reduce((count, curObj) => count + curObj.value),
    }
  },
};
</script>

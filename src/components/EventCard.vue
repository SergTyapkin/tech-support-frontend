<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/buttons.styl'
@require '../styles/utils.styl'

width = 300px
minHeight = 300px

.root
  width width
  min-height minHeight
  height 100%
  .form
    block-clickable()
    display flex
    flex-direction column
    padding-top 20px
    padding-bottom 20px
    transition all 0.2s ease
    height 100%
    .header
      border-bottom solid 1px borderColor
      .text
        font-large()
        color textColor1
        margin-bottom 10px
      .date
      .time
        display flex
        align-items center
        padding 3px 5px
        font-small()
        color textColor2
      padding-bottom 5px

  .main
    flex 1
    display flex
    flex-direction column
    .description
    .people
    .place
    .time
      display flex
      align-items center
      font-small()
      color textColor3
      margin 5px 0
    .description
      flex 1
      align-items baseline
      color textColor1
      letter-spacing 0.6px
      margin 20px 10px
      max-height 150px
      overflow hidden

  .button-info
    button-submit()

  .icon
    width 28px
    margin-right 10px
</style>

<template>
  <div class="root">
    <router-link :to="{name: 'event', params: {eventId: id}}">
      <div class="form">
        <header class="header">
          <div class="text">{{ name }}</div>
          <div class="date"><img class="icon" src="../res/date.svg" alt="Date:">{{ date }}</div>
          <div class="time"><img class="icon" src="../res/time.svg" alt="Date:">{{timeStart}} - {{timeEnd}}</div>
        </header>
        <main class="main">
          <div class="description">{{ description }}</div>
          <div class="place"><img class="icon" src="../res/place.svg" alt="Place:"> {{ placeName }}</div>
          <div class="time" v-if="eventTimeStart && eventTimeEnd"><img class="icon" src="../res/time_dashed.svg" alt="Time:"> {{eventTimeStart}} - {{eventTimeEnd}}</div>
          <div class="people"><img class="icon" src="../res/people.svg" alt="People:">{{ participationsCount }} / {{ needPeople }}</div>
        </main>
      </div>
    </router-link>
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
    needPeople: Number,
    participationsCount: Number,
    placeId: Number,
    placeName: String,
    authorId: Number,
    authorName: String,
  },

  data() {
    return {
      loading: false,
      description: this.$props.description.substring(0, 200),
    }
  },
};
</script>

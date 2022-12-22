<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/buttons.styl'

width = 300px
minHeight = 300px

.root
  width width
  min-height minHeight
  height 100%
  .form
    margin 0
    height 100%
    display flex
    flex-direction column
    padding-top 20px
    padding-bottom 20px
    transition all 0.2s ease
    &:hover
      background blocksBgColorHover
    .header
      border-bottom solid 1px borderColor
      .text
        font-large()
        color textColor1
      .datetime
        display flex
        align-items center
        padding 10px 5px
        .date
        .time
          font-small()
          color textColor2

  .main
    flex 1
    .description
    .people
    .place
    .time
      display flex
      align-items center
      font-small()
      color textColor3
      margin 10px 0
    .description
      color textColor1
      letter-spacing 0.6px
      margin 20px 10px

  .button-info
    button-submit()

  .icon
    width 28px
    margin-right 10px
</style>

<template>
  <div class="root">
    <router-link :to="$base_url_path + '/event/' + id">
      <Form class="form">
        <header class="header">
          <div class="text">{{ name }}</div>
          <div class="datetime">
            <img class="icon" src="../res/time.svg" alt="Date:">
            <span class="date">{{ date }},</span>
            <span class="date">{{timeStart}} - {{timeEnd}}</span>
          </div>
        </header>
        <main class="main">
          <div class="description">{{ description }}</div>
          <div class="place"><img class="icon" src="../res/place.svg" alt="Place:"> {{ placeName }}</div>
          <div class="time"><img class="icon" src="../res/time_dashed.svg" alt="Time:"> {{eventTimeStart}} - {{eventTimeEnd}}</div>
          <div class="people"><img class="icon" src="../res/people.svg" alt="People:"> {{needPeopleTotal || 0}}</div>
        </main>
      </Form>
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

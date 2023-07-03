<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/utils.styl'
@require '../styles/buttons.styl'
@require '../styles/constants.styl'

.root-extract
  padding 40px
  padding-bottom 200px

  .button
    button-submit()
    margin-bottom 50px

  .main-title
    font-large()
    font-size 1.5rem
    font-weight bold
    margin-bottom 15px

  .title
    font-large()
    margin-bottom 20px
    .username
    .period
      font-style italic

  .table
    max-width 700px
    display grid
    grid-template 1fr / 1fr 1fr 1fr
    .title
      font-large()
      font-weight bold
      display contents
      > *
        border-bottom 1px solid borderColor
        padding-bottom 5px
        margin-bottom 5px
    .string
      display contents
      font-medium()
      > *:not(:last-child)
        border-right 1px solid borderColor
        margin-right 5px
    .title
    .strong
      > *:not(:last-child)
        padding-right 10px

    margin-bottom 40px
  .info
    font-small()
    font-style italic
    a
      text-decoration underline
      color textColor3

  &.light-theme
    background white
    color black
    a
      color gray
</style>

<template>
  <div class="root-extract" :class="{'light-theme': lightTheme}">
    <button class="button" @click="lightTheme = !lightTheme">{{ lightTheme ? 'Вернуть красиво' : 'Сделать на белом' }}</button>

    <div class="main-title">Выписка по посещенным мероприятиям</div>

    <div class="title">
      Пользователь: <span class="username">{{ $usernameFull($user) }}</span>
      <br>
      Отчетный период: <span class="period">Зимний семестр 2023</span>
    </div>

    <div class="table">
      <div class="title">
        <div class="name">Мероприятие</div>
        <div class="datetime">Время начала</div>
        <div class="position">Род деятельности</div>
      </div>
      <div v-for="p in participations" class="string">
        <div class="name">{{ p.name }}</div>
        <div class="datetime">{{ p.date }} {{ p.timestart }}</div>
        <div class="position">{{ p.positionname }}</div>
      </div>
    </div>

    <div class="info">
      Отчет предоставлен сайтом техподдержки Art Club МГТУ им. Н.Э. Баумана
      <br>
      <a href="https://creativetechteam.bmstu.ru">creativetechteam.bmstu.ru</a>
    </div>
  </div>
</template>

<script>
import {dateToStr, timeToStr} from "../utils/utils";

export default {
  data() {
    return {
      participations: [],
      lightTheme: false,
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$api.getParticipationsExtract();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить рейтинги');
      return;
    }

    this.participations = response.participations;

    this.participations.forEach(par => {
      par.date = dateToStr(par.date, true);
      par.timestart = timeToStr(par.timestart);
    })
  }
}
</script>


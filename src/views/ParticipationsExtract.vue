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

  table
    max-width 700px
    border-spacing 0

    thead
      font-large()
      font-weight bold
      th
        border-bottom 1px solid borderColor
    tbody
      font-medium()
      th
        border 0px solid borderColor
        border-right-width 1px
        font-weight normal
        &:not(:last-child)
          margin-right 8px
        &.datetime
          white-space nowrap
      tr.filler
        th
          border none
          padding 3px
    th
      padding 6px 15px
      text-align left

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

    <table class="table">
      <thead>
          <tr class="title">
            <th class="name">Мероприятие</th>
            <th class="datetime">Время начала</th>
            <th class="position">Род деятельности</th>
          </tr>
      </thead>
      <tbody>
        <tr class="filler"><th></th><th></th><th></th></tr>
        <tr v-for="p in participations" class="string">
          <th class="name">{{ p.name }}</th>
          <th class="datetime">{{ p.date }} {{ p.timestart }}</th>
          <th class="position">{{ p.positionname }}</th>
        </tr>
      </tbody>
    </table>

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


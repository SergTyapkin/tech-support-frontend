<style lang="stylus" scoped>
@require '../styles/constants.styl'

footer
  flex 0 0 auto

  bottom 0
  width 100%

  margin 0
  margin-top 80px
  padding 0
  padding-bottom 10px

  background linear-gradient(20deg, rgba(84, 67, 24, 0) 0%, rgba(84, 67, 24, 0.6) 50%, rgba(84, 67, 24, 0) 100%) no-repeat
  border-top solid 2px
  border-color empColor2
  box-shadow rgba(231, 190, 28, 0.5) 0 0 8px 0
  list-style none

  a
    display inline-flex
    align-items center
    padding 10px 15px

    .title
      font-size 14px
      font-family Arial, monospace
      color textColor1
    img
      width 30px
      display compact
      margin-right 5px
      transition transform 0.2s ease
    .description
      font-size 12px
      font-family Arial, monospace
      color textColor4
      transition color 0.2s ease
  a:hover
    img
      transform scale(1.1)
    .description
      color textColor2
</style>

<template>
  <div>
    <footer>
      <a href="https://vk.com/squest_studio" target="_blank">
        <img src="../res/vk-logo.svg" alt="vk">
        <div>
          <div class="title">За подсказками: </div>
          <div class="description">vk.com/squest_studio</div>
        </div>
      </a>
      <a href="mailto:tyapkin2002@mail.ru" target="_blank">
        <img src="../res/email-logo.svg" alt="mail">
        <div class="description">Tyapkin2002@mail.ru</div>
      </a>
      <a href="https://t.me/tyapkin_s" target="_blank">
        <img src="../res/telegram-logo.svg" alt="tg">
        <div class="description">t.me/tyapkin_s</div>
      </a>
    </footer>
  </div>
</template>

<script>
export default {
}
</script>

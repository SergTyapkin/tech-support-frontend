<style lang="stylus" scoped>
@require '../styles/constants.styl'

counter-font = GothicE

side-items-font-size = 16px
side-item-gradient = "linear-gradient(%s, rgba(184, 134, 11, 0.3) 30%, rgba(218, 165, 32, 0) 100%) 0 100% no-repeat"

@font-face
  font-family counter-font
  src url(../res/fonts/GothicE.ttf)

.navbar
  font-family monospace
  font-size side-items-font-size

  width 80%
  height 60px
  margin 0 auto 10px auto

  border-bottom-left-radius 100px 60px
  border-bottom-right-radius 100px 60px
  overflow hidden
  background linear-gradient(25deg, #070505 10%, #543616 50%, #070505 100%)
  animation open-navbar 3s ease forwards
  position relative

  .side-item
    letter-spacing 2px
    color textColor3
    text-transform uppercase
    transition all 0.4s ease
    text-shadow none

  .side-item:hover
    letter-spacing 5px
    color textColor2
    padding-left 15px
    padding-right 15px
    text-shadow textLightingLow
    @media({mobile})
      text-shadow none

  .side-item
    padding 5px 10px
    position absolute
    top 0
    *
      pointer-events none
      padding 0 5px
    img
      width side-items-font-size
      min-width side-items-font-size
      height side-items-font-size
  .side-item.left
    background side-item-gradient % 90deg
    background-size 100% 1px
    left 0
  .side-item.right
    background side-item-gradient % -90deg
    background-size 100% 1px
    right 0

  .bottom
    margin-top 5px
    left 0
    width 100%
  // background linear-gradient(90deg,  rgba(218, 165, 32, 0) 0%, rgba(184, 134, 11, 0.3) 30%, rgba(184, 134, 11, 0.3) 70%, rgba(218, 165, 32, 0) 100%) 0 100% no-repeat
  // background-size 100% 1px

  .progress
    display block
    margin-top -5px
    font-size 30px
    font-family counter-font
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    background radial-gradient(#f54da199, transparent 70%);
    .progress-container
      display flex
      align-items center
      flex-direction column
      .info
        display block
        max-height 0
        text-align center
        overflow-y hidden
        transition all 0.3s ease
  .progress:hover
    .progress-container
      .info
        max-height 20px

  .progressbar // uses --progress
    position absolute
    bottom 10px
    width 100%
    height 5px
    background linear-gradient(90deg, rgba(218, 165, 32, 0.7) 50%, rgba(0, 0, 0, 0.5) 53%) 0 0 no-repeat
    background-position-x calc(100% - 100% * var(--progress))
    background-size 200%
    //box-shadow rgba(231, 190, 28, 0.7) 0 0 5px 0
    border mix(empColor1_1, transparent, 30%) 1px solid
    transition background-position-x ease 3s


@media ({mobile})
  .navbar linkbutton
    font-size 20px


.opacity-in
  opacity 0
  animation opacity-in 2s ease-in forwards

.opacity-in.delayedBig
  animation-delay 1s

.opacity-in.delayedSmall
  animation-delay 0.5s

@keyframes opacity-in
  from
    opacity 0
  to
    opacity 1


@keyframes open-navbar
  from
    width 0
    border-bottom-left-radius 200px 100px
    border-bottom-right-radius 200px 100px

  to
    width 80%
    border-bottom-left-radius 100px 60px
    border-bottom-right-radius 100px 60px

// until avatars comes
.avatar
  display none
</style>

<template>
  <div class="navbar absolute-wrapper">
    <div class="progressbar" :style="`--progress: ${newProgress / 100}`"></div>

    <router-link v-if="$store.state.user.isLogined && ($store.state.user.chosenquestid !== null) && ($store.state.user.chosenbranchid !== null)" class="center progress" :to="base_url_path + `/play`">
      <div class="progress-container">
        <vue3autocounter
            ref='counter'
            :startAmount='prevProgress'
            :endAmount='newProgress'
            :duration='2'
            prefix=''
            suffix='%'
            separator=''
            decimalSeparator=','
            :decimals='1'
            autoinit
        ></vue3autocounter>
        <span class=" info">Прогресс прохождения</span>
      </div>
    </router-link>
    <div class="center progress" v-else>
      <span>SQ</span>
    </div>

    <router-link :to="base_url_path + `/quests`" class="left side-item opacity-in delayedBig">Квесты</router-link>
    <router-link :to="base_url_path + `/profile`" class="right side-item opacity-in delayedBig">
      <span>
        <span v-if="!$store.state.user.isLogined">Войти</span>
        <span v-else>{{ $store.state.user.username }}</span>
      </span>
      <img class="avatar" src="../res/default_avatar.png" alt="">
    </router-link>
  </div>
</template>

<script>
import Vue3autocounter from 'vue3-autocounter';
import {BASE_URL_PATH} from "../constants";

export default {
  components: {Vue3autocounter},

  data() {
    return {
      prevProgress: 0,
      newProgress: 0,

      base_url_path: BASE_URL_PATH
    };
  },

  methods: {
    updateProgress() {
      this.prevProgress = this.newProgress;
      if (this.$store.state.user.progressMax === 0) {
        this.newProgress = 0;
        return;
      }
      this.newProgress = this.$store.state.user.progress / this.$store.state.user.progressMax * 100;
    }
  },

  watch: {
    '$store.state.user.progress': {
      handler: async function (to, from) {
        this.updateProgress();
      },
      deep: true,
    },
    '$store.state.user.progressMax': {
      handler: async function (to, from) {
        this.updateProgress();
      },
      deep: true,
    }
  }
};
</script>

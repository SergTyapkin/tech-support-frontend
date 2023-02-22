<style lang="stylus" scoped>
@require './styles/constants.styl'
@require './styles/fonts.styl'
@require './styles/buttons.styl'
@require './styles/utils.styl'

backgroundBorderColor = borderColor
animation-time-rule = cubic-bezier(0.29, 0.82, 0.36, 0.99)

.background
  z-index -1
  position fixed
  inset 0
  overflow hidden
  filter blur(5px)
  div
    opacity 0.3
    width 100%
    position absolute
    border solid 1px borderColor
    background black
    border-radius(20px)
    animation bg-move-top animation-time-rule
    @keyframes bg-move-top
      0%
        opacity 0
        top 0
        height 200%
        width 200%
      20%
        top 0
        height 200%
        width 200%
  div:nth-child(2n)
    animation bg-move-bottom animation-time-rule
    @keyframes bg-move-bottom
      0%
        opacity 0
        top 100%
        height 200%
        width 200%
      20%
        top 100%
        height 200%
        width 200%

  div:nth-child(4)
    animation bg-move-top-scale animation-time-rule
    @keyframes bg-move-top-scale
      0%
        opacity 0
        top 100%
        height 0%
        width 200%
      20%
        top 0%
        height 0%
        width 200%
  div:nth-child(1)
    top 50%
    left 50%
    height 100%
    width 100%
    transform rotate(70deg)
    animation-duration 0.3s
  div:nth-child(2)
    top 0%
    left 20%
    height 200%
    width 100%
    transform rotate(40deg)
    animation-duration 1.2s
  div:nth-child(3)
    top -40%
    left -50%
    height 100%
    width 100%
    transform rotate(20deg)
    animation-duration 0.6s
  div:nth-child(4)
    top -15%
    left 20%
    height 100%
    width 200%
    transform rotate(30deg)
    animation-duration 0.8s
  div:nth-child(5)
    top 90%
    left 30%
    height 100%
    width 100%
    transform rotate(20deg)
    animation-duration 1s


.top-bar
  @media ({mobile})
    position fixed
    bottom 0
    backdrop-filter blur(10px)

.wrapper
  width 100%
  min-height 'calc(100vh - %s)' % header-height
  overflow-y hidden
  > *
    position absolute
    width 100%
    @media ({mobile})
      padding-bottom header-height-mobile
      overflow-y hidden
  > *[css-fullheight]
    min-height 'calc(100vh - %s)' % header-height
  > *[css-fullheight-only]
    height 'calc(100vh - %s)' % header-height
  .loading
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 100px
    height 100px
  .overlay
    inset 0
    position fixed
    background #0009
    backdrop-filter blur(3px)
    display flex
    flex-direction column
    justify-content center
    align-items center
    font-large()
    text-align center
    .glitch
      flex 0.5
      width 80%
      display flex
      align-items center
      justify-content center
    .button-exit
      button-danger()
      width 40%
      opacity 0.9
      &:hover
        opacity 1


</style>

<template>
  <div class="background">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>

  <TopBar v-if="$store.state.user.isLogined" class="top-bar"></TopBar>
  <div class="wrapper">
    <CircleLoading v-if="!$store.state.user.isGotten" class="loading"></CircleLoading>
    <router-view v-else v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" class="main"/>
      </transition>
    </router-view>


    <div v-if="$store.state.user.isLogined && !$store.state.user.isConfirmedByAdmin" class="overlay">
      <div class="glitch stack activated" style="--stacks: 4;">
        <span style="--index: 0">Попросите администратора подтвердить вашу регистрацию<br>К сожалению, без этого пользоваться сервисом нельзя</span>
        <span style="--index: 1">Попросите администратора подтвердить вашу регистрацию<br>К сожалению, без этого пользоваться сервисом нельзя</span>
        <span style="--index: 2">Попросите администратора подтвердить вашу регистрацию<br>К сожалению, без этого пользоваться сервисом нельзя</span>
        <span style="--index: 3">Попросите администратора подтвердить вашу регистрацию<br>К сожалению, без этого пользоваться сервисом нельзя</span>
      </div>
      <div class="button-exit" @click="logOut">Выйти из аккаунта</div>
    </div>
  </div>

  <Modal ref="modal"></Modal>
  <Popups ref="popups"></Popups>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}
.slide-left-enter-to {
  left: 0;
}
.slide-left-enter-from {
  left: -100%;
}
.slide-left-leave-to {
  left: -100%;
  transform: scale(0.8);
}
.slide-left-leave-from {
  left: 0;
}


.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}
.slide-right-enter-to {
  left: 0;
}
.slide-right-enter-from {
  left: -100%;
}
.slide-right-leave-to {
  right: -100%;
  transform: scale(0.5);
}
.slide-right-leave-from {
  right: 0;
}


.scale-slide-left-enter-active,
.scale-slide-left-leave-active {
  transition: all 0.3s ease;
}
.scale-slide-left-enter-from {
  left: -30%;
  opacity: 0;
}
.scale-slide-left-enter-to {
  left: 0%;
  opacity: 1;
}
.scale-slide-left-leave-from {
  transform: scale(1);
}
.scale-slide-left-leave-to {
  transform: scale(0.8);
  opacity: 0;
}


.scale-slide-right-enter-active,
.scale-slide-right-leave-active {
  transition: all 0.4s ease;
}
.scale-slide-right-enter-from {
  right: -30%;
  opacity: 0;
}
.scale-slide-right-enter-to {
  right: 0%;
  opacity: 1;
}
.scale-slide-right-leave-from {
  transform: scale(1);
}
.scale-slide-right-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.scale-in-enter-active,
.scale-in-leave-active {
  transition: all 0.3s ease;
}
.scale-in-enter-from {
  transform: scale(1.2);
  opacity: 0;
}
.scale-in-enter-to {
  transform: scale(1);
  opacity: 1;
}
.scale-in-leave-from {
  transform: scale(1);
  opacity: 1;
}
.scale-in-leave-to {
  transform: scale(0.8);
  opacity: 0;
}



.rotate-around-enter-active {
  transition: all 0.2s linear;
  transition-delay: 0.2s;
}
.rotate-around-leave-active {
  transition: all 0.2s linear;
}
.rotate-around-enter-from {
  transform: rotateY(90deg) scale(1.2) rotateX(10deg);
}
.rotate-around-enter-to {
  transform: rotateY(0deg) scale(1) rotateX(0deg);
}
.rotate-around-leave-from {
  transform: rotateY(0deg) scale(1) rotateX(0deg);
}
.rotate-around-leave-to {
  transform: rotateY(90deg) scale(1.2) rotateX(10deg);
}

</style>

<script>
import {getCurrentInstance} from "vue";
import Modal from "/src/components/vue-plugins/Modal.vue";
import Popups from "/src/components/vue-plugins/Popups.vue";
import CircleLoading from "/src/components/loaders/CircleLoading.vue";
import {API_URL, BASE_URL_PATH} from "./constants";
import TopBar from "./components/TopBar.vue";
import {cropText} from "./utils/utils";

export default {
  components: {TopBar, CircleLoading, Modal, Popups},

  data() {
    return {
      transitionName: ""
    }
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path)
      // if (to.path === this.$base_url_path + '/profile')
      //   this.transitionName = 'scale-slide-left';
      // else if (from.path === this.$base_url_path + '/profile')
      //   this.transitionName = 'scale-slide-right';
      //
      // else if (from.path === this.$base_url_path + '/signin' && to.path === this.$base_url_path + '/signup')
      //   this.transitionName = 'slide-left';
      // else if (from.path === this.$base_url_path + '/signup' && to.path === this.$base_url_path + '/signin')
      //   this.transitionName = 'slide-left';
    }
  },

  async mounted() {
    const global = getCurrentInstance().appContext.config.globalProperties;

    global.$modal = this.$refs.modal;
    global.$popups = this.$refs.popups;

    global.$user = this.$store.state.user;
    global.$base_url_path = BASE_URL_PATH;

    global.$cropText = cropText;
    global.$username = (user) => user.firstName + ' ' + (user.thirdName || '');
    global.$usernameLow = (user) => user.firstname + ' ' + (user.thirdname || '');
  },

  methods: {
    async logOut() {
      const response = await this.$api.signOut();
      if (!response.ok_) {
        this.$popups.error('Не получилось выйти из аккаунта', 'Неизвестная ошибка');
        return;
      }
      this.$user.setDefault();
      await this.$router.push({name: "default"});
    },
  }
};
</script>

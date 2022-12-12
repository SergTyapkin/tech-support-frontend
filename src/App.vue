<style lang="stylus" scoped>
top-bar-height = 70px

.wrapper
  width 100%
  min-height 100vh

  > *
    position absolute
    width 100%
  .loading
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 100px
    height 100px
  .overlay
    inset 0
    background #0005
    display flex
    justify-content center
    align-items center
</style>

<template>
  <div class="wrapper">
    <CircleLoading v-if="!$store.state.user.isGotten" class="loading"></CircleLoading>
    <div v-else-if="!$store.state.user.isConfirmedByAdmin" class="overlay stack activated">
      <span style="--index: 1">Ваш аккаунт пока что не подтвержден администратором<br>К сожалению, без этого пользоваться сервисом нельзя</span>
      <span style="--index: 2">Ваш аккаунт пока что не подтвержден администратором<br>К сожалению, без этого пользоваться сервисом нельзя</span>
      <span style="--index: 3">Ваш аккаунт пока что не подтвержден администратором<br>К сожалению, без этого пользоваться сервисом нельзя</span>
    </div>
    <router-view v-else v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component"/>
      </transition>
    </router-view>
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
</style>

<script>
import {getCurrentInstance} from "vue";
import Modal from "/src/components/vue-plugins/Modal.vue";
import Popups from "/src/components/vue-plugins/Popups.vue";
import CircleLoading from "/src/components/loaders/CircleLoading.vue";
import Navbar from "./components/Navbar.vue";
import {API_URL, BASE_URL_PATH} from "./constants";


export default {
  components: {Navbar, CircleLoading, Modal, Popups},

  data() {
    return {
      transitionName: ""
    }
  },

  watch: {
    $route(to, from) {
      this.transitionName = 'scale-in';

      console.log(from.path, 'TO', to.path)

      if (to.path === '/profile')
        this.transitionName = 'scale-slide-left';
      else if (from.path === '/profile')
        this.transitionName = 'scale-slide-right';

      else if (from.path === '/signin' && to.path === '/signup')
        this.transitionName = 'slide-left';
      else if (from.path === '/signup' && to.path === '/signin')
        this.transitionName = 'slide-left';
    }
  },

  mounted() {
    const global = getCurrentInstance().appContext.config.globalProperties;

    global.$modal = this.$refs.modal;
    global.$popups = this.$refs.popups;

    global.$user = this.$store.state.user;
    global.$base_url_path = BASE_URL_PATH;
  },
};
</script>

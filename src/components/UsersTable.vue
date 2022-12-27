<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

avatar-size = 80px
user-padding-left = 20px

.usersList
  display block
  min-height 200px
  height 400px
  background borderColorDark
  border-radius 5px
  overflow scroll-y
  @media ({mobile})
    height 100%

  .eventUsersList
    border-radius 5px

    .eventName
      font-large()
      padding 0 15px
      margin 10px 0 5px 0
      width 100px
      white-space nowrap
    .nameHr
      background linear-gradient(90deg, textColor1 0%, textColor5 70%, transparent)
      width 100%
      height 1px
      margin 0

    .user
      position relative
      width 100%
      padding 15px 10px 15px user-padding-left
      display flex
      .userIcon
        align-self flex-end
        border-radius 50%
        outline 1px solid empColor1_1
        outline-offset 2px
        width (avatar-size - 4px)
        height (avatar-size - 4px)
        margin 2px
      .info
        padding 0 7px
        overflow hidden
        width 100%
        .userName
          font-medium()
          line-height 0.8em
          white-space nowrap
          overflow hidden
        .userTitle
          color textColor3
          font-small-extra()
          white-space nowrap

        .range
          w 1
        .comm
          display inline
          height 10px
          width 270px
          border none
          cursor text

      .hrUserL
        position absolute
        bottom 4px
        left (avatar-size / 2) + user-padding-left
        right 0
        height 1px
        background linear-gradient(90deg, empColor1_1 80%, transparent 100%)
</style>

<template>
  <div class="usersList scrollable" :class="{disabled: loading}">
    <div class="eventUsersList" v-for="usersList in usersLists">
      <div class="eventName">{{usersList.eventName}}</div>
      <hr class="nameHr">
      <div class="user" v-for="user in usersList.participations">
        <UserAvatar :image-id="user.imageId" class="userIcon"></UserAvatar>
        <div class="info">
          <div class="userName">{{user.name}}</div>
          <div class="userTitle">{{user.title}}</div>
          <Range class="range" :min="0.25" :max="2"></Range>
          <input class="comm" @change="saveComment" placeholder="Комментарий" v-model="user.comm">
        </div>
        <hr class="hrUserL">
      </div>
    </div>
  </div>
</template>

<script>
import {setTimedClass} from "../utils/utils";
import UserAvatar from "./UserAvatar.vue";
import Range from "./Range.vue";

export default {
  components: {Range, UserAvatar},
  emits: ['submit'],

  props: {
    usersLists: {
      type: Array,
      default: [
        {
          eventName: "Event",
          participations: [
            {
              id: 1,
              name: "Сергей Тяпкин",
              title: "Дроидекъ",
              imageId: null,
              comm: "",
              rating: null,
            },
          ],
        },
      ],
    },
  },

  data() {
    return {
      loading: false,
      info: '',
    };
  },

  methods: {
    showError() {
      setTimedClass([this.$refs.form], 'error');
    },
    showSuccess() {
      setTimedClass([this.$refs.form], 'success');
    },
  }
};
</script>

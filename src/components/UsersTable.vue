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
  height 100%
  background borderColorDark
  border-radius(5px)
  overflow-y auto
  @media ({mobile})
    height 100%

  .eventUsersList
    border-radius(5px)

    .eventName
      font-large()
      color mix(textColor1, empColor2_1, 60%)
      padding 0 15px
      margin 10px 0 5px 0
      width 100px
      white-space nowrap
      .date
        margin-left 20px
        color textColor5
        font-small()
    .nameHr
      background linear-gradient(90deg, empColor2_1 0%, empColor2_3 70%, transparent)
      width 100%
      height 1px
      margin 0
</style>

<template>
  <div class="usersList scrollable">
    <div class="eventUsersList" v-for="usersList in usersLists">
      <div class="eventName" v-if="usersList.eventName">
        <span class="name">{{usersList.eventName}}</span>
        <span class="date">{{dateToStr(usersList.eventDate)}}</span>
      </div>
      <hr class="nameHr" v-if="usersList.eventName">
      <User v-for="participation in usersList.participations"
            :event-id="participation.eventid"
            :user-id="participation.userid"
            :user-image-id="participation.userimageid"
            :user-name="participation.username"
            :user-title="participation.usertitle"
            :position-name="participation.positionname"
            :position-id="participation.positionid"
            :id="participation.id"
            :comment="participation.admincomment"
            :score="participation.score"
            :can-delete="canDelete"
            @delete="(id) => deleteUserFromList(0, id)"
      ></User>
    </div>

  </div>
</template>

<script>
import UserAvatar from "./UserAvatar.vue";
import Range from "./Range.vue";
import CircleLoading from "./loaders/CircleLoading.vue";
import User from "./UserTableItem.vue";
import {dateToStr} from "../utils/utils";

export default {
  components: {User, CircleLoading, Range, UserAvatar},

  props: {
    usersLists: [],

    canDelete: Boolean,
  },

  methods: {
    dateToStr: dateToStr,

    deleteUserFromList(listIdx, id) {
      const index = this.usersLists[listIdx]?.participations?.findIndex(u => u.id === id);
      console.log(index, this.usersLists[listIdx])
      this.usersLists[listIdx]?.participations?.splice(index, 1);
      console.log(this.usersLists[listIdx])
    }
  }
};
</script>

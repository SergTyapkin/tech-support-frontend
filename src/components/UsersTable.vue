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

  .edit-button
    button()
  .edit-button-save
    button-success()

  .eventUsersList
    border-radius(5px)

    .eventName
      font-large()
      color mix(textColor1, empColor2_1, 60%)
      padding 0 15px
      margin 10px 0 5px 0
      .date
        white-space nowrap
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
    <div class="edit-buttons-container" v-if="$user.canEditParticipations && (usersLists.reduce((total, cur) => cur.participations?.length || 0 + total, 0) > 0)">
      <button v-if="!canEditScores" class="edit-button" @click="canEditScores = true">Изменить баллы</button>
      <button v-else class="edit-button-save" @click="canEditScores = false">Не изменять баллы</button>
    </div>

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
            :can-edit="($user.canEditParticipations) || (participation.userid === $user.id)"
            :can-edit-score="canEditScores"
            @delete="(id) => deleteUserFromList(0, id)"
      ></User>
    </div>

    <slot></slot>
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
    canEditSelf: Boolean,
  },

  data() {
    return {
      canEditScores: false,
    }
  },

  methods: {
    dateToStr: dateToStr,

    deleteUserFromList(listIdx, id) {
      const index = this.usersLists[listIdx]?.participations?.findIndex(u => u.id === id);
      this.usersLists[listIdx]?.participations?.splice(index, 1);
    }
  },
};
</script>

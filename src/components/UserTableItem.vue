<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/forms.styl'
@require '../styles/utils.styl'

avatar-size = 80px
avatar-size-mobile = 50px
user-padding-left = 20px
user-padding-left-mobile = 5px

.user
  position relative
  width 100%
  padding 15px 10px 15px user-padding-left
  display flex
  @media ({mobile})
    padding-left user-padding-left-mobile
  .user-icon-container
  .user-icon
    border none
    width (avatar-size - 4px)
    height (avatar-size - 4px)
    min-width (avatar-size - 4px)
    min-height (avatar-size - 4px)
    border-radius(50%)
    @media ({mobile})
      width (avatar-size-mobile - 4px)
      height (avatar-size-mobile - 4px)
      min-width (avatar-size-mobile - 4px)
      min-height (avatar-size-mobile - 4px)
  .user-icon
    overflow hidden

  .user-icon-container
    position relative
    align-self flex-end
    border-radius(50%)
    outline 1px solid empColor1_1
    outline-offset 2px
    margin 2px
    .delete-user
      position absolute
      left 50%
      top 0
      opacity 0
      pointer-events none
      transform translateX(-50%)
      transition all 0.2s ease
      z-index 999
      padding-bottom 10px
      img
        width 40px
        height 40px
    .delete-user:hover
    .user-icon:hover + .delete-user
      top -50px
      opacity 1
      pointer-events auto
      @media ({mobile})
        top 10px
        pointer-events none
    .delete-user:hover
      transform translateX(-50%) scale(1.1)

  .info.isAdmin
    .userName
      @media ({mobile})
        margin-left (- avatar-size-mobile)
    .userTitle
      @media ({mobile})
        margin-left (- avatar-size-mobile)
  .info:not(.isAdmin)
    .range
      position absolute
      right 20px
  .info
    padding 0 7px
    width 100%
    .userName
      font-medium()
      line-height 0.8em
      white-space nowrap
      .position
        font-small()
        color textColor4
        margin-left 5px
    .userTitle
      color textColor3
      font-small-extra()
      white-space nowrap

    .range-input-container
      display flex
      flex-direction column
      &.in-row
        flex-direction row
        margin-top 10px
      .range
        margin-top 4px

      .comm
        input()
        font-small()
        color mix(empColor2_1, textColor1)
        padding 2px 5px
        margin-top 4px
        display inline
        max-width 270px
        width 100%
        border none
        cursor text
        &:not([readonly]):focus
          color textColor1
        &.success
          color colorYes
        &.error
          color colorNo
        &[readonly]::placeholder
          opacity 0

  .hrUserL
    position absolute
    bottom 6px
    left (avatar-size / 2) + user-padding-left
    @media ({mobile})
      left (avatar-size-mobile / 2) + user-padding-left-mobile
    right 0
    height 1px
    background linear-gradient(90deg, empColor1_1 80%, transparent 100%)

  .status-icon
    position absolute
    right 10px
    top 10px
    width 30px
    height 30px

</style>

<template>
  <div class="user">
    <router-link :to="{name: 'profile', params: {userId: userId}}" class="user-icon-container" @contextmenu.prevent="deleteParticipation">
      <UserAvatar :image-id="userImageId" class="user-icon" size="80px" size-mobile="50px"></UserAvatar>
      <div v-if="$user.canEditParticipations && canDelete" class="delete-user" @click.stop.prevent="deleteParticipation"><img src="../res/trash.svg" alt="delete"></div>
    </router-link>
    <div class="info" :class="{canEditParticipations: $user.canEditParticipations}">
      <div class="userName">{{ $cropText(userName, 30) }} <span class="position">{{ positionName }}</span></div>
      <div class="userTitle">{{ $cropText(userTitle, 50) }}</div>
      <div class="range-input-container" :class="{'in-row': !$user.canEditParticipations}">
        <Range class="range" :min="0.25" :max="2" :step="0.25" v-model="score" @change="saveRating" :readonly="!$user.canEditParticipations" :with-delete="$user.canEditParticipations" :disabled="!canEditScore"></Range>
        <input class="comm" ref="comment" placeholder="Комментарий" v-model="comment" @change="saveComment" @keydown.enter="$refs.comment.blur()" :readonly="!canEdit">
      </div>
    </div>
    <hr class="hrUserL">

    <CircleLoading v-if="state === States.edited" size="30px" class="status-icon"></CircleLoading>
    <img src="../res/ok.svg" v-else-if="state === States.saved" alt="ok" class="status-icon">
    <img src="../res/error.svg" v-else-if="state === States.error" alt="ok" class="status-icon">
  </div>
</template>

<script>
import UserAvatar from "./UserAvatar.vue";
import Range from "./Range.vue";
import CircleLoading from "./loaders/CircleLoading.vue";
import {setTimedClass} from "../utils/utils";


export default {
  components: {CircleLoading, Range, UserAvatar},

  emits: ['delete'],

  props: {
    id: Number,
    eventId: Number,
    userId: Number,
    userName: String,
    userTitle: String,
    userImageId: String,
    positionId: Number,
    positionName: String,
    comment: String,
    score: Number,
    canEditScore: Boolean,

    canDelete: Boolean,
    canEdit: Boolean,
  },

  data() {
    return {
      States: {
        initial: 0,
        edited: 1,
        saved: 2,
        error: 3,
      },
      state: 0,

      score: this.$props.score,
    };
  },

  methods: {
    async saveRating() {
      this.state = this.States.edited;
      const res = await this.$api.updateParticipationScore(this.id, this.score);

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить рейтинг");
        this.state = this.States.error;
        return;
      }
      this.state = this.States.saved;
    },
    async saveComment() {
      this.state = this.States.edited;
      let res;
      if (this.$user.canEditParticipations) {
        res = await this.$api.updateParticipationCommentAdmin(this.id, this.comment);
      } else {
        res = await this.$api.updateParticipationCommentSelf(this.id, this.comment);
      }

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить комментарий");
        setTimedClass([this.$refs.comment], 'error');
        this.state = this.States.error;
        return;
      }

      this.state = this.States.saved;
      setTimedClass([this.$refs.comment], 'success');
    },

    async deleteParticipation() {
      if (!this.canDelete)
        return;

      if (!await this.$modal.confirm("Удаление участника", "Вы уверены, что хотитие отменить участие этого человека в событии?"))
        return;

      this.loading = true;
      const response = await this.$api.notParticipateInEvent(this.eventId, this.userId);
      this.loading = false;

      if (!response.ok_) {
        this.$popups.error('Ошибка', 'Не удалось удалить участника');
        return;
      }

      this.$emit('delete', this.id);
      this.$popups.success('Участие удалено', 'Ещё можно сжечь его на костре...');
    }
  },
};
</script>

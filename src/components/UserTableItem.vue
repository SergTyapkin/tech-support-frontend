<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'
@require '../styles/forms.styl'
@require '../styles/utils.styl'

avatar-size = 80px
user-padding-left = 20px

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
      margin-top 4px

    .comm
      input()
      font-small()
      color mix(empColor2_1, textColor1)
      padding 2px 5px
      margin-top 4px
      display inline
      width 270px
      border none
      cursor text
      &:focus
        color textColor1
      &.success
        color colorYes
      &.error
        color colorNo

  .hrUserL
    position absolute
    bottom 4px
    left (avatar-size / 2) + user-padding-left
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
    <UserAvatar :image-id="userImageId" class="userIcon"></UserAvatar>
    <div class="info">
      <div class="userName">{{userName}}</div>
      <div class="userTitle">{{userTitle}}</div>
      <Range class="range" :min="0.25" :max="2" :step="0.25" v-model="score" @change="saveRating"></Range>
      <input class="comm" ref="comment" placeholder="Комментарий" v-model="comment" @change="saveComment" @keydown.enter="$refs.comment.blur()">
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

  props: {
    id: Number,
    userName: String,
    userTitle: String,
    userImageId: Number,
    positionId: Number,
    positionName: String,
    comment: String,
    score: Number,
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
      console.log("ASDASD")
      this.state = this.States.edited;
      const res = await this.$api.updateParticipationComment(this.id, this.comment);

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось сохранить комментарий");
        setTimedClass([this.$refs.comment], 'error');
        this.state = this.States.error;
        return;
      }

      this.state = this.States.saved;
      setTimedClass([this.$refs.comment], 'success');
    }
  }
};
</script>

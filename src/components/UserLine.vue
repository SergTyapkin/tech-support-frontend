<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'
@require '../styles/utils.styl'

.user
  padding 10px 10px
  display flex
  font-medium()
  transition all 0.2s ease
  &.clickable
    cursor pointer
  &.clickable:hover
    background blocksBgColorHover
  .avatar
    border-radius(50%)
    width 30px
    height 30px
    margin-right 5px
    border 1px solid empColor1_2
  .text
    .name
      font-middle()
      color textColor1
      line-height 0.8
      white-space nowrap
    .title
      font-small-extra()
      color textColor3
</style>

<template>
  <router-link v-if="link" :to="{name: 'userProfile', params: {userId: id}}" class="user" :class="{clickable}">
    <UserAvatar :image-id="avatarImageId" class="avatar"></UserAvatar>
    <div class="text">
      <div class="name">{{ $cropText(name, 30) }}</div>
      <div class="title">{{ $cropText(title, 30) }}</div>
    </div>
  </router-link>

  <div v-else class="user" :class="{clickable}">
    <UserAvatar :image-id="avatarImageId" class="avatar"></UserAvatar>
    <div class="text">
      <div class="name">{{ $cropText(name, 30) }}</div>
      <div class="title">{{ $cropText(title, 30) }}</div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "./UserAvatar.vue";


export default {
  components: {UserAvatar},
  props: {
    id: {
      type: Number,
      required: true,
    },
    avatarImageId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    clickable: Boolean,
    link: Boolean,
  },
}
</script>

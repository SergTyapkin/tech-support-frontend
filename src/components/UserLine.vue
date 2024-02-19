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
    margin-right 5px
    border-color empColor1_2
  .text
    .name
      font-middle()
      color textColor1
      line-height 0.8
      white-space nowrap
      .thirdname
        color textColor4
        font-small()
    .title
      font-small-extra()
      color textColor3
</style>

<template>
  <router-link v-if="link" :to="{name: 'userProfile', params: {userId: id}}" class="user" :class="{clickable}">
    <UserAvatar :image-id="avatarimageid" class="avatar" size="30px" border-offset="0px" border-width="1px" :user-id="id"></UserAvatar>
    <div class="text">
      <div class="name">{{ $cropText(name, 30) }} <span class="thirdname" v-if="withThirdname">{{ secondname }}</span></div>
      <div class="title">{{ $cropText(title, 30) }}</div>
    </div>
  </router-link>

  <div v-else class="user" :class="{clickable}">
    <UserAvatar :image-id="avatarimageid" class="avatar" size="30px" border-offset="0px" border-width="1px" :user-id="id"></UserAvatar>
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
    avatarimageid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    firstname: {
      type: String,
    },
    secondname: {
      type: String,
    },
    thirdname: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    clickable: Boolean,
    link: Boolean,
    withThirdname: Boolean,
  },

  data() {
    return {
      name: this.$props.name || (this.$usernameLow(this.$props)),
    }
  },
}
</script>

<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/utils.styl'
@require '../styles/constants.styl'

.top-3
  margin-top 30px
  display flex
  justify-content center
  height 250px
  .place-1
  .place-2
  .place-3
    text-align center
    margin 0 40px
    transition transform 0.2s ease
    &:hover
      transform scale(1.1)
    .avatar
      border-radius 50%
      outline-width 2px
      outline-style solid
      outline-offset 2px
    .position
      font-medium()
      margin-bottom 5px
      width 100%
    .name
      font-medium()
      margin-top 10px
      line-height 0.9
    .title
      font-small-x()
      color textColor3
      .rating
        color textColor1


  .place-1
    align-self flex-start
    .position
      color gold
    .avatar
      width 100px
      outline-color gold
  .place-2
    align-self flex-end
    margin-bottom 20px
    .position
      color silver
    .avatar
      width 80px
      outline-color silver
  .place-3
    align-self flex-end
    .position
      color #ff9f7b
    .avatar
      width 70px
      outline-color #ff9f7b

.users-list
  width 100%
  margin-top 40px
  .list
    margin 0 auto
    list-style none
    width min-content
    block()
    padding 15px 0
    .user
      padding 10px 50px
      display flex
      font-medium()
      transition all 0.2s ease
      &:hover
        background blocksBgColorHover
      .counter
        color empColor2_1
        min-width 25px
      .rating
        color textColor2
        min-width 50px
      .avatar
        border-radius 50%
        width 30px
        height 30px
        border 1px solid empColor1_2
        margin-right 5px
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
  <div>
    <header class="top-3">
      <router-link :to="{name: 'userProfile', params: {userId: users[1].id}}" class="place-2" v-if="users[1] !== undefined">
        <div class="position">#2</div>
        <UserAvatar class="avatar" :image-id="users[1].imageId"></UserAvatar>
        <div class="name">{{ users[1].name }}</div>
        <div class="title">
          {{ users[1].title }}
          <span class="rating">???{{ users[1].rating }}</span>
        </div>
      </router-link>
      <router-link :to="{name: 'userProfile', params: {userId: users[0].id}}" class="place-1" v-if="users[0] !== undefined">
        <div class="position">#1</div>
        <UserAvatar class="avatar" :image-id="users[0].avatarimageid"></UserAvatar>
        <div class="name">{{ users[0].name }}</div>
        <div class="title">
          {{ users[0].title }}
          <span class="rating">???{{ users[0].rating }}</span>
        </div>
      </router-link>
      <router-link :to="{name: 'userProfile', params: {userId: users[2].id}}" class="place-3" v-if="users[2] !== undefined">
        <div class="position">#3</div>
        <UserAvatar class="avatar" :image-id="users[2].avatarimageid"></UserAvatar>
        <div class="name">{{ users[2].name }}</div>
        <div class="title">
          {{ users[2].title }}
          <span class="rating">???{{ users[2].rating }}</span>
        </div>
      </router-link>
    </header>

    <main class="users-list">
      <div class="list">
        <router-link v-for="(user, idx) in users.slice(3)" :to="{name: 'userProfile', params: {userId: user.id}}" class="user">
          <div class="counter">{{ idx + 3 }}</div>
          <div class="rating">???{{ user.rating }}</div>
          <UserAvatar :image-id="user.avatarimageid" class="avatar"></UserAvatar>
          <div class="text">
            <div class="name">{{ user.name }}</div>
            <div class="title">{{ user.title }}</div>
          </div>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import UserAvatar from "../components/UserAvatar.vue";


export default {
  components: {UserAvatar},

  data() {
    return {
      users: [],
    }
  },

  async mounted() {
    this.loading = true;
    const response = await this.$api.getParticipationRating();
    this.loading = false;

    if (!response.ok_) {
      this.$popups.error('????????????', '???? ?????????????? ???????????????? ????????????????');
      return;
    }

    this.users = response.ratings;
  }
}
</script>


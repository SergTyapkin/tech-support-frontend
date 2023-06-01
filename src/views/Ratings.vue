<style lang="stylus" scoped>
@require '../styles/fonts.styl'
@require '../styles/utils.styl'
@require '../styles/constants.styl'

.top-3
  display flex
  justify-content space-between
  height 250px
  max-width 500px
  margin 30px auto 0 auto
  padding-right 10px
  .place-1
  .place-2
  .place-3
    text-align center
    margin 0
    transition transform 0.2s ease
    flex (1/3)
    &:hover
      transform scale(1.1)
    .avatar
      --border-width 2px
      --border-offset 2px
      display flex
      justify-content center
      width 100%

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
    position relative
    .position
      color colorGold
    .avatar
      --border-color-user colorGold
    .info-big-bg
      position absolute
      inset 0
      top -10px
      font-size 30px
      font-weight bold
      text-align center
      text-transform uppercase
      line-height 80px
      color mix(textColor4, transparent, 50%)
  .place-2
    align-self flex-end
    margin-bottom 20px
    .position
      color colorSilver
    .avatar
      --border-color-user colorSilver
  .place-3
    align-self flex-end
    .position
      color colorBronze
    .avatar
      --border-color-user colorBronze

.users-list
  width 100%
  margin-top 40px
  margin-bottom 40px
  .list
    margin 0 auto
    list-style none
    width min-content
    block()
    padding 15px 0
    .user
      padding 10px 50px
      display flex
      align-items center
      font-medium()
      transition all 0.2s ease
      @media ({mobile})
        padding 10px 20px
      &:hover
        background blocksBgColorHover
      .counter
        color empColor2_1
        min-width 25px
      .rating
        color textColor2
        min-width 60px
      .avatar
        --border-width 1px
        --border-offset unquote('0px')
        --border-color-user empColor1_2
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
        <UserAvatar class="avatar" :image-id="users[1].avatarimageid" size="85px" :user-id="users[1].id"></UserAvatar>
        <div class="name">{{ users[1].name }}</div>
        <div class="title">
          {{ users[1].title }}
          <span class="rating">★{{ users[1].rating }}</span>
        </div>
      </router-link>
      <router-link :to="{name: 'userProfile', params: {userId: users[0].id}}" class="place-1" v-if="users[0] !== undefined">
        <div class="info-big-bg">Жизнь потрепала</div>
        <div class="position">#1</div>
        <UserAvatar class="avatar" :image-id="users[0].avatarimageid" size="100px" :user-id="users[0].id"></UserAvatar>
        <div class="name">{{ users[0].name }}</div>
        <div class="title">
          {{ users[0].title }}
          <span class="rating">★{{ users[0].rating }}</span>
        </div>
      </router-link>
      <router-link :to="{name: 'userProfile', params: {userId: users[2].id}}" class="place-3" v-if="users[2] !== undefined">
        <div class="position">#3</div>
        <UserAvatar class="avatar" :image-id="users[2].avatarimageid" size="70px" :user-id="users[2].id"></UserAvatar>
        <div class="name">{{ users[2].name }}</div>
        <div class="title">
          {{ users[2].title }}
          <span class="rating">★{{ users[2].rating }}</span>
        </div>
      </router-link>
    </header>

    <main class="users-list">
      <div class="list">
        <router-link v-for="(user, idx) in users.slice(3)" :to="{name: 'userProfile', params: {userId: user.id}}" class="user">
          <div class="counter">{{ idx + 4 }}</div>
          <div class="rating">★{{ user.rating }}</div>
          <UserAvatar :image-id="user.avatarimageid" class="avatar" size="30px" :user-id="user.id"></UserAvatar>
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
      this.$popups.error('Ошибка', 'Не удалось получить рейтинги');
      return;
    }

    this.users = response.ratings;

    this.$scroll.restore();
  }
}
</script>


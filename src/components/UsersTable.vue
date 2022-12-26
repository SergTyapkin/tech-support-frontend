<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'

.usersList
  display block
  max-width 420px
  min-height 140px
  background bgColor
  border-radius 5px
  overflow scroll-y
  height 360px
  @media ({mobile})
    height 100%

.allUsers
  background colorShadowLight
  border-radius 5px
  margin-bottom 10px
  padding-bottom 10px

.user
  width 100%
  height 120px
  border-radius 5px
  padding 10px
  padding-left 20px
  display flex
  border 1px solid #0000
.user:hover
  background colorShadowLight

.userIcon
  border-radius 50%
  outline 3px solid empColor1_3
  outline-offset 2px
  width 90px
  min-width 90px
  height 90px
  min-height 90px
  margin 2px
  overflow hidden

.info
  padding 7px

.userName
  font-size 20px
  height 24px
  width 270px
  white-space nowrap
  overflow hidden
  margin-top -7px
/*.userName:before
  position absolute
  display block
  width 270px
  height 20px
  content ""
  background linear-gradient(-90deg, #131313, #13131300 30%)
.user:hover .userName:before
  background linear-gradient(-90deg, #0f0f0f, #0f0f0f00 30%)*/

.ratingButtons
  display flex
  justify-content center
  margin 7px

.ratingBut
  width 30px
  height 20px
  border 1px solid empColor2_2
  background empColor2_4
  border-radius 3px
  margin 1px
  text-align center
  color empColor2_1
  font-size 10px
  cursor pointer
  overflow hidden
  white-space nowrap

.handVal
  margin-right 7px

.comm
  display inline
  height 10px
  width 270px
  border none
  cursor text

.hrUserL
  background linear-gradient(-90deg, #def5f000, empColor1_3 20%)
  margin-right -5px
  margin-left -50px
  margin-top 1px
  height 3px

.eventName
  height 40px
  font-size 30px
  padding-top 10px
  badding-bottom 7px
  padding-left 15px
  width 400px
  white-space nowrap
  overflow hidden
  margin-bottom 10px
/*.eventName::before
  position absolute
  height 40px
  width 375px
  content ""
  background linear-gradient(-90deg, #131313, #13131300 40%)*/

.userDes
  color textColor3
  font-size 10px
  height 10px
  width 240px
  padding-left 15px
  white-space nowrap
  overflow hidden
/*.userDes::before
  position absolute
  width 240px
  height 10px
  content ""
  background linear-gradient(-90deg, #131313, #13131300 30%)
.user:hover .userDes::before
  background linear-gradient(-90deg, #0f0f0f, #0f0f0f00 30%)*/

.nameHr
  background linear-gradient(90deg, #0000, textColor5 5%, textColor5 95%, #0000)
  width 407px
  height 3px
  margin-left 7px
  margin-bottom 20px
</style>

<template>
  <div class="usersList scrollable" :class="{disabled: loading}">
	<div class="allUsers" v-for="usersList in usersLists">
	  <div class="eventName">{{usersList.eventName}}</div>
	  <hr class="nameHr">
	  <div class="user" v-for="user in usersList.people">
		<img v-if="user.imageId !== null" :src="getImageUrlById(user.imageId, this.$api.apiUrl)" class="userIcon">
		<img v-else src="../res/default_avatar.png" class="userIcon">
		<div class="info">
			<div class="userName">{{user.name}}</div>
			<div class="userDes">{{user.description}}</div>
			<div class="ratingButtons">
			  <div class="ratingBut handVal">{{user.rating === null ? "?" : user.rating}}</div>
			  <div class="ratingBut">0</div>
			  <div class="ratingBut">0.25</div>
			  <div class="ratingBut">0.5</div>
			  <div class="ratingBut">0.75</div>
			  <div class="ratingBut">1</div>
			  <div class="ratingBut">2</div>
			</div>
			<form>
			  <input class="comm" placeholder="Комментарий" :value="user.comm">
			</form>
			<hr class="hrUserL">
		</div>
	  </div>
	</div>
  </div>
</template>

<script>
import {setTimedClass} from "../utils/utils";
import {getImageUrlById} from "../utils/utils";

export default {
  emits: ['submit'],
  
  props: {
	usersLists: {
		type: Array,
		default: [
			{
				eventName: "Event",
				people: [
					{
						id: 0,
						name: "User",
						description: "",
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
	getImageUrlById(id, api_url) {
	  return getImageUrlById(id, api_url);
    },
  }
};
</script>

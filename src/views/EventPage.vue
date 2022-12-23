<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/fonts.styl'

.button-participate
  button-submit()
.button-not-participate
  button-danger()

.input-info
  font-small()
  color textColor4
  margin-bottom 0
.name_input
  margin-bottom 0
  margin-top 20px
.d_rename
  margin-top 10px
  resize none
  height 300px
  white-space: pre-line

.form .submit_button
  display none

.mero_info
  display flex

.buttons
  display flex

.form_event
  max-width 800px

.form_event.is-admin
  .submit_button
    display inline
    width 49%
    margin-right 5px
  .input-info:not(.des)
    display none
  .d_rename:focus
    border 2px solid empColor1_4
  .main_info
    padding 5px
    border-radius 7px
    background colorShadowLight
    margin-bottom 5px

.left_description
  border-right 2px solid bgColor
  padding-right 10px
.right_description
  padding-left 10px
  width 100%
</style>

<template>
  <div>
    <Form :noSubmit="!$user.isAdmin" class="form_event" :class="{'is-admin': $user.isAdmin}">
	  <div class="mero_info">
		  <div class="discription left_description">
			  <div class="main_info">
				  <div class="input-info">Что?</div>
				  <FloatingInput v-model="event.name" title="Название" :readonly="!$user.isAdmin" class="name_input" info="Что?"></FloatingInput>
			  </div>
			  <div class="main_info">
				  <div class="input-info">А где?</div>
				  <FloatingInput v-model="event.placename" list="places" title="Место проведения" :readonly="!$user.isAdmin" class="name_input"></FloatingInput>
				  <datalist id="places">
					<option v-for="item in places_l">{{item.name}}</option>
				  </datalist>
			  </div>
			  <div class="main_info">
				  <div class="input-info">И когда?</div>
				  <FloatingInput v-model="event.date" type="date" title="Дата проведения" :readonly="!$user.isAdmin" class="name_input"></FloatingInput>
				  <FloatingInput v-model="event.timestart" type="time" title="Приходить c" :readonly="!$user.isAdmin" class="name_input"></FloatingInput>
				  <FloatingInput v-model="event.timeend" type="time" title="Оставаться до" :readonly="!$user.isAdmin" class="name_input"></FloatingInput>
			  </div>
			  <div class="input-info">Кто вообще такое придумал?</div>
			  <FloatingInput v-model="user.name" title="Автор мероприятия" readonly class="name_input"></FloatingInput>
			  <div class="input-info">Дайте-ка мне его номерочек!</div>
			  <FloatingInput v-model="user.email" title="Ну на" readonly class="name_input"></FloatingInput>
		  </div>
		  <div class="discription right_description">
			  <div class="input-info des">А чё надо то??</div>
			  <textarea class="d_rename" :readonly="!$user.isAdmin">{{event.description}}</textarea>
		  </div>
	  </div>
			  <div class="buttons">
				  <input type="submit" value="Применить" class="submit_button" :class="{hidden: !$user.isAdmin}">

				  <CircleLoading v-if="loading"></CircleLoading>
				  <div v-else-if="!event.isyouparticipate" class="button-participate" @click="participate">Пойду</div>
				  <div v-else class="button-not-participate" @click="notParticipate">Не пойду</div>
			  </div>
    </Form>
  </div>
</template>


<script>
import Form from "/src/components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";
import FloatingInput from "../components/FloatingInput.vue";

export default {
  components: {CircleLoading, Form, FloatingInput, },

  data() {
    return {
      loading: true,

      event: {},
	  
	  places: {},

      eventId: this.$route.params.eventId,
	  
	  user: {},
    }
  },

  async mounted() {
    if (this.eventId === undefined) {
      this.$popups.error("Ошибка", "id события нет в строке запроса");
      this.$router.push({name: "default"});
      return;
    }
    this.loading = true;
    const response = await this.$api.getEventById(this.eventId);

    if (!response.ok_) {
      this.$popups.error('Ошибка', 'Не удалось получить список мероприятий');
      return;
    }

    this.event = response;
	
	const userResponse = await this.$api.getUser(this.authorId);
	const places_list = await this.$api.getPlaces();
    this.loading = false;
	
	if (!userResponse.ok_) {
	  this.$popups.error('Ошибка', 'Не удалось получить пользователя');
      return;
	}
	if (!places_list.ok_) {
	  this.$popups.error('Ошибка', 'Что-то не то с местами проведения мероприятий');
      return;
	}
	
	this.user = userResponse;
	this.places_l = places_list.places;
  },


  methods: {
    async participate() {
      this.loading = true;
      const res = await this.$api.participateInEvent(this.eventId, this.$user.id, 1);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось записаться на мероприятие");
        return;
      }
      this.event.isyouparticipate = true;
    },

    async notParticipate() {
      this.loading = true;
      const res = await this.$api.notParticipateInEvent(this.eventId, this.$user.id);
      this.loading = false;

      if (!res.ok_) {
        this.$popups.error("Ошибка", "Не удалось отказаться от мероприятия");
        return;
      }
      this.event.isyouparticipate = false;
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '../../styles/utils.styl'

.form
  margin-top 100px
  margin-bottom 100px

</style>

<template>
  <div>
    <Form class="from"
          ref="form"
          title="Регистрация" description="Ну давай, покажи всю свою оригинальность"
          :fields="[
            { title: 'ИМЯ', autocomplete: 'on', jsonName: 'firstName', name: 'firstname', info: 'Давай знакомиться'},
            { title: 'ФАМИЛИЯ', autocomplete: 'on', jsonName: 'secondName', name: 'secondname'},
            { title: 'ОТЧЕСТВО', autocomplete: 'on', jsonName: 'thirdName', name: 'thirdname', info: 'Ну надо'},
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', name: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки'},
            { title: 'ПАРОЛЬ ЕЩЁ РАЗ', jsonName: 'passwordConfirm', name: 'password confirm', type: 'password', info: 'Не ошибись - это будет фиаско'},
            { title: 'E-mail', autocomplete: 'on', jsonName: 'email', name: 'email', type: 'email', info: 'Когда-нибудь пароль придётся восстанавливать'},
            { title: 'Telegram', autocomplete: 'on', jsonName: 'telegram', name: 'telegram', type: 'text', info: 'Всё, что после @'},
          ]"
          submit-text="Погнали"
          @submit="signUp"
    >Уже есть аккаунт? <router-link :to="base_url_path + `/signin`" class="link">Войти</router-link>
    </Form>
  </div>
</template>


<script>
import Form from "../../components/FormExtended.vue";

export default {
  components: {Form},

  data() {
    return {
      base_url_path: this.$base_url_path,
    }
  },

  methods: {
    validate(firstName, secondName, thirdName, password, passwordConfirm, email, telegram) {
      let funcRes = true;
      if (firstName.length === 0) {
        this.$refs.form.errors.firstName = 'Имя не может быть пустым';
        funcRes = false;
      }
      if (secondName.length === 0) {
        this.$refs.form.errors.secondName = 'Фамилия не может быть пустой';
        funcRes = false;
      }
      if (thirdName.length === 0) {
        this.$refs.form.errors.thirdName = 'Отчество не может быть пустым';
        funcRes = false;
      }
      // TODO: проверка на пробелы
      // if (firstName.length === 0) {
      //   this.$refs.form.errors.firstName = 'Имя не может быть пустым';
      //   funcRes = false;
      // }
      // if (secondName.length === 0) {
      //   this.$refs.form.errors.secondName = 'Фамилия не может быть пустой';
      //   funcRes = false;
      // }
      // if (thirdName.length === 0) {
      //   this.$refs.form.errors.thirdName = 'Отчество не может быть пустым';
      //   funcRes = false;
      // }
      if (password.length === 0) {
        this.$refs.form.errors.password = 'Пароль не может быть пустым';
        funcRes = false;
      }
      if (password !== passwordConfirm) {
        this.$refs.form.errors.password = 'Пароли не совпадают';
        this.$refs.form.errors.passwordConfirm = 'Это фиаско, братан';
        funcRes = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'E-mail не может быть пустым';
        funcRes = false;
      }
      if (telegram.length === 0) {
        this.$refs.form.errors.telegram = 'Telegram не может быть пустым';
        funcRes = false;
      }
      return funcRes;
    },

    async signUp({firstName, secondName, thirdName, password, passwordConfirm, email, telegram}) {
      if (!this.validate(firstName, secondName, thirdName, password, passwordConfirm, email, telegram))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.signUp(password, email, firstName, secondName, thirdName, telegram);
      this.$refs.form.loading = false;

      if (response.ok_) {
        this.$refs.form.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.form.loading = false;
        this.$popups.success('Аккаунт создан!');
        this.$refs.form.errors = {};
        this.$router.push('/profile');
        return;
      }

      if (response.status_ === 409) {
        this.$refs.form.info = 'E-mail уже занят';
        this.$refs.form.errors.email = 'Такой логин или E-mail уже занят';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error("Не удалось войти в аккаунт", 'Произошла неизвестная ошибка!');
    },
  }
}
</script>

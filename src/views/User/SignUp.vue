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
            { title: 'ИМЯ', autocomplete: 'on', jsonName: 'name', name: 'firstname', info: 'Давай знакомиться'},
            { title: 'ФАМИЛИЯ', autocomplete: 'on', jsonName: 'secondName', name: 'lastname', info: 'Ну надо'},
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', name: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки'},
            { title: 'ПАРОЛЬ ЕЩЁ РАЗ', jsonName: 'passwordConfirm', name: 'password confirm', type: 'password', info: 'Не ошибись'},
            { title: 'E-mail', autocomplete: 'on', jsonName: 'email', name: 'email', type: 'email', info: 'Когда-нибудь пароль придётся восстанавливать'},
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
    validate(name, secondName, password, passwordConfirm, email) {
      let funcRes = true;
      if (name.length === 0) {
        this.$refs.form.errors.name = 'Имя не может быть пустым';
        funcRes = false;
      }
      if (secondName.length === 0) {
        this.$refs.form.errors.secondName = 'Фамилия не может быть пустой';
        funcRes = false;
      }
      if (password.length === 0) {
        this.$refs.form.errors.password = 'Пароль не может быть пустым';
        funcRes = false;
      }
      if (password !== passwordConfirm) {
        this.$refs.form.errors.password = 'Пароли не совпадают';
        this.$refs.form.errors.passwordConfirm = 'Пароли не совпадают';
        funcRes = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'E-mail не может быть пустым';
        funcRes = false;
      }
      return funcRes;
    },

    async signUp({name, secondName, password, passwordConfirm, email}) {
      if (!this.validate(name, secondName, password, passwordConfirm, email))
        return;

      const fullname = name + ' ' + secondName;

      this.$refs.form.loading = true;
      const response = await this.$api.signUp(password, email, fullname);
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

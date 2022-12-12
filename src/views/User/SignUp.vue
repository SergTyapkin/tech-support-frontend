<style lang="stylus" scoped>
.loading
  margin-left auto
  margin-right auto
</style>

<template>
  <div>
    <Form ref="form"
          title="Регистрация" description="Ну давай, покажи всю свою оригинальность"
          :fields="[
            { title: 'ЛОГИН', autocomplete: 'on', jsonName: 'username' },
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки'},
            { title: 'ПАРОЛЬ ЕЩЁ РАЗ', jsonName: 'passwordConfirm', type: 'password', info: 'Не ошибись'},
            { title: 'E-mail', autocomplete: 'on', jsonName: 'email', type: 'email', info: 'Когда-нибудь пароль придётся восстанавливать'},
            { title: 'ИМЯ', autocomplete: 'on', jsonName: 'name', info: 'Ну надо'},
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
    validate(username, password, passwordConfirm, email, name) {
      let ok = true;
      if (username.length === 0) {
        this.$refs.form.errors.username = 'Логин не может быть пустым';
        ok = false;
      }
      if (password.length === 0) {
        this.$refs.form.errors.password = 'Пароль не может быть пустым';
        ok = false;
      }
      if (password !== passwordConfirm) {
        this.$refs.form.errors.password = 'Пароли не совпадают';
        this.$refs.form.errors.passwordConfirm = 'Пароли не совпадают';
        ok = false;
      }
      if (email.length === 0) {
        this.$refs.form.errors.email = 'E-mail не может быть пустым';
        ok = false;
      }
      if (name.length === 0) {
        this.$refs.form.errors.name = 'Имя не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async signUp({username, password, passwordConfirm, email, name}) {
      if (!this.validate(username, password, passwordConfirm, email, name))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.signUp(username, password, email, name);
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
        this.$refs.form.info = 'Логин или e-mail уже заняты';
        this.$refs.form.errors.username = 'Такой логин или E-mail уже занят';
        this.$refs.form.errors.email = 'Такой логин или E-mail уже занят';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error("Не удалось войти в аккаунт", 'Произошла неизвестная ошибка!');
    },
  }
}
</script>

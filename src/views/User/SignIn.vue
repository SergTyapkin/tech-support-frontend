<style lang="stylus" scoped>
@require '../../styles/buttons.styl'

.form
  margin-top 100px
  margin-bottom 100px
  .form-code
    margin 0

.text-centered
  text-align center
  margin 10px 0
  color textColor4

.button
  button()
</style>


<template>
  <div>
    <FormExtended class="form"
          v-if="!loginByCode"
          ref="form"
          title="Вход" description="Ну давай, вспомни пароль, войди в меня"
          :fields="[
            { title: 'E-MAIL', autocomplete: 'on', jsonName: 'email', name: 'email' },
            { title: 'ПАРОЛЬ', autocomplete: 'on', jsonName: 'password', name: 'password', type: 'password', info: 'Забыл пароль? - пей таблетки', infoHref: base_url_path + `/password/restore`},
          ]"
          submit-text="Погнали"
          @submit="signIn"
    >
      Нужен аккаунт? <router-link :to="base_url_path + `/signup`" class="link">Создать</router-link>

      <div class=" text-centered">или</div>
      <div class="button" @click="loginByCode = true">Войти по коду</div>
    </FormExtended>

    <FormExtended v-else
          ref="formEmail"
          title="Вход по коду" description="Можно не вспоминать пароль, а просто открыть почту"
          :fields="[
            { title: 'E-mail', autocomplete: 'on', jsonName: 'email'},
          ]"
          submit-text="Выслать код"
          @submit="signInByEmailCodeSendEmail"
    >
      <FormExtended :no-bg="true"
            ref="formCode"
            :fields="[
              { title: 'Одноразовый код', jsonName: 'code'},
            ]"
            submit-text="Войти"
            @submit="signInByEmailCode"
            class="form-code"
      ></FormExtended>
      <div class="text-centered">или</div>
      <div class="button" @click="loginByCode = false">Войти по паролю</div>
    </FormExtended>
  </div>
</template>


<script>
import FormExtended from "../../components/FormExtended.vue";
import FloatingInput from "../../components/FloatingInput.vue";

export default {
  components: {FloatingInput, FormExtended},

  data() {
    return {
      loginByCode: false,

      base_url_path: this.$base_url_path,
    }
  },

  methods: {
    validate(email, password) {
      let ok = true;
      if (email.length === 0) {
        this.$refs.form.errors.email = 'Email не может быть пустым';
        ok = false;
      }
      if (password.length === 0) {
        this.$refs.form.errors.password = 'Пароль не может быть пустым';
        ok = false;
      }
      return ok;
    },
    validateEmail(email) {
      let ok = true;
      if (email.length === 0) {
        this.$refs.formEmail.errors.email = 'E-mail не может быть пустым';
        ok = false;
      }
      return ok;
    },

    async signIn({email, password}) {
      if (!this.validate(email, password))
        return;

      this.$refs.form.loading = true;
      const response = await this.$api.signIn(email, password);
      this.$refs.form.loading = false;

      if (response.ok_) {
        this.$refs.form.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.form.loading = false;
        // this.$popups.success('Отличный вход!', 'Ну привет...');
        this.$refs.form.errors = {};
        this.$router.push({name: 'profile'});
        return;
      }

      if (response.status_ === 401) {
        this.$refs.form.info = 'Неверный логин или пароль';
        this.$refs.form.errors.email = 'Неверный логин или пароль';
        this.$refs.form.errors.password = 'Неверный логин или пароль';
        this.$refs.form.showError();
        return;
      }

      this.$popups.error("Не удалось войти в аккаунт", response.info || 'Произошла неизвестная ошибка!');
    },

    async signInByEmailCodeSendEmail({email}) {
      if (!this.validateEmail(email)) {
        this.$refs.form.showError();
        return;
      }

      this.$refs.formEmail.loading = true;
      const response = await this.$api.sendSignInEmail(email);
      this.$refs.formEmail.loading = false;

      if (response.ok_) {
        this.$popups.success('Письмо выслано', 'Найдите одноразовый код на вашей почте');
        this.$refs.formEmail.errors = {};
        return;
      }

      if (response.status_ === 404) {
        this.$refs.formEmail.errors.email = 'E-mail не зарегистрирован';
        this.$refs.formEmail.showError();
        return;
      }

      if (response.status_ === 403) {
        this.$refs.formEmail.errors.email = 'E-mail не подтвержден в аккаунте';
        this.$refs.formEmail.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    },

    async signInByEmailCode({code}) {
      const email = this.$refs.formEmail.values.email
      if (!this.validateEmail(email))
        return;

      this.$refs.formCode.loading = true;
      const response = await this.$api.signInByEmailCode(email, code);
      this.$refs.formCode.loading = false;

      if (response.ok_) {
        this.$refs.formCode.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.formCode.loading = false;
        this.$popups.success('Отличный вход!', 'Ну привет...');
        this.$refs.formCode.errors = {};
        this.$router.push({name: 'profile'});
        return;
      }

      if (response.status_ === 401) {
        this.$refs.formCode.errors.code = 'Неверный одноразовый код';
        this.$refs.formCode.showError();
        return;
      }

      this.$popups.error('Не удалось выслать код', response.info || 'Неизвестная ошибка');
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>

<template>
  <div>
    <FormExtended ref="form" :no-submit="true" description="Подтверждаем ваш E-mail...">
    </FormExtended>
  </div>
</template>


<script>
import CircleLoading from "../../components/loaders/CircleLoading.vue";
import FormExtended from "../../components/FormExtended.vue";

export default {
  components: {FormExtended, CircleLoading},

  data() {
    return {
      code: this.$route.query.code,

      base_url_path: this.$base_url_path,
    }
  },

  async mounted() {
    await this.confirmEmail();
    this.$router.push({name: 'profile'});
  },

  methods: {
    async confirmEmail() {
      if (!this.code) {
        this.$popups.error('Ошибка', 'Код для подтверждения не был передан в url');
        return;
      }

      this.$refs.form.loading = true;
      const response = await this.$api.confirmEmailByCode(this.code);
      this.$refs.form.loading = false;

      if (response.ok_) {
        this.$popups.success('Подтверждено', 'Теперь ваш E-mail подтверждён');

        this.$refs.form.loading = true;
        await this.$store.dispatch('GET_USER');
        this.$refs.form.loading = false;
        return;
      }

      this.$popups.error("Не удалось подтвердить E-mail", response.info || "Произошла неизвестная ошибка");
    }
  }
}
</script>

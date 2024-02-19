<style lang="stylus" scoped>
@require '../styles/constants.styl'
@require '../styles/fonts.styl'

.form
  margin-top 50px
  max-width unset

.textarea
  white-space pre-wrap
  font-medium()

.header
  font-large()
.header-small
  font-small()
  color textColor4
</style>

<template>
  <div>
    <Form class="form" ref="form" @submit="execute">
      <div class="info-container">
        <div class="header">Выполнение произвольного SQL-запроса</div>
      </div>

      <CircleLoading v-if="loading"></CircleLoading>

      <div class="fields-container">
        <div id="sql-fields">
          <div class="header-small">Вот сейчас спокойно, дыши, без DROP, DELETE и TRUNCATE, пожалуйста</div>
          <textarea rows=4 class="textarea scrollable" v-model="sql" @keydown.ctrl.enter="execute"></textarea>

          <label class="header-small">Результат</label>
          <textarea rows=12 class="textarea scrollable" :value="result" disabled></textarea>
          <input type="submit" value="Выполнить">
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "../components/Form.vue";
import CircleLoading from "../components/loaders/CircleLoading.vue";


export default {
  components: { CircleLoading, Form },

  data() {
    return {
      sql: '',
      result: '',

      loading: false,

      base_url_path: this.$base_url_path,
    }
  },

  mounted() {
    if (!this.$user.canExecuteSQL) {
      this.$popups.error("Тебе сюда низя", "Не влезай, убьёт");
      this.$router.push({name: 'profile'});
    }
  },

  methods: {
    async execute() {
      console.log(this.result);
      console.log(this.sql);
      this.loading = true;
      const res = await this.$api.executeAdminSql(this.sql);
      this.loading = false;

      console.log(res);
      if (res.ok_) {
        this.$popups.success(res.status_, res.info);
        this.$refs.form.showSuccess();

        this.result = '[';
        res.response.forEach(row => {
          this.result += '\r\n\t{';
          for (const key in row) {
            this.result += `\r\n\t\t${key}: ${row[key]},`;
          }
          this.result += '\r\n\t},';
        });
        this.result += '\r\n]';
        return;
      }

      if (res.status_ === 500) {
        this.$popups.error(`Ошибка ${res.status_}!`, res.info, 10000);
        this.$refs.form.showError();
        return;
      }
      this.$popups.error(`Ошибка ${res.status_}!`, res.info, 10000);
    },
  }
};
</script>

<style lang="stylus" scoped>
.root
  width 100%
  margin-left auto
  margin-right auto
</style>

<template>
  <div class="root">
    <Form class="form">
      <div>Страница не найдена</div>
      <router-link to="/" class="link">На главную</router-link>
    </Form>
  </div>
</template>

<script>
import Form from "../components/Form.vue";
export default {
  components: {Form}
}
</script>


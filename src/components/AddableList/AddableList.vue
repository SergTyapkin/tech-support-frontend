<style lang="stylus" scoped>
@require '../../styles/constants.styl'

.addable-list
  padding 0
  list-style none
  overflow-x hidden

.button
  display flex
  align-items center
  justify-content center
  padding 0
  img
    width 40px
</style>

<template>
  <div>
    <label class="text-big">{{ title }} <span></span></label>
    <div class="info text-small" v-html="description"></div>

    <ul class="addable-list roll-active closed" ref="list">
      <ListItem v-for="(item, idx) in modelValue"
                v-model="modelValue[idx]"
                :idx="idx"
                :action-text="this.$props.actionText"
                @delete="deleteItem"
                @move="moveItem"
                :action-to="actionTo"
                :can-delete="canDelete"
                :placeholder="placeholder"
                :class="{'last-child': (item.confirmed) && ((idx + 1 >= modelValue.length) || (!modelValue[idx + 1].confirmed))}"
                @keydown.tab="() => {if (idx === modelValue.length - 1) addItem();}"
      ></ListItem>
    </ul>

    <div class="button rounded" @click="addItem">
      <img src="../../res/plus.svg" alt="add"> {{ addText }}
    </div>
  </div>
</template>

<script>
  import ListItem from "./ListItem.vue";
  import {closeRollList, openRollList} from "../../utils/show-hide";
  import {nextTick} from "vue";

  export default {
    components: {ListItem},

    emits: ['add', 'delete', 'update:modelValue', 'input'],

    props: {
      modelValue: Array, // aka "items"
      title: String,
      description: String,
      addText: String,
      actionText: String,
      actionTo: Function,
      placeholder: String,
      canDelete: {
        type: Boolean,
        default: true,
      }
    },

    async mounted() {
    },

    methods: {
      addItem() {
        this.$emit('add');
        this.$emit('input');

        this.modelValue.push({
          title: ''
        });
        this.updateVModel();
      },

      deleteItem(idx) {
        this.$emit('delete', this.modelValue[idx]);
        this.$emit('input');

        closeRollList(this.$refs.list);

        this.modelValue.splice(idx, 1);
        this.updateVModel();
      },

      moveItem({idx, to}) {
        if ((idx < 0 || idx >= this.modelValue.length) ||
            (to < 0 || to >= this.modelValue.length))
          return;

        this.$emit('input');
        const buff = this.modelValue[idx];
        this.modelValue[idx] = this.modelValue[to];
        this.modelValue[to] = buff;

        this.updateVModel();
      },

      updateVModel() {
        this.$emit('update:modelValue', this.modelValue);
        this.rollOpenList();
      },

      async rollOpenList() {
        await nextTick();
        openRollList(this.$refs.list);
      }
    },

    watch: {
      modelValue: function (to, from) {
        this.rollOpenList();
      }
    }
  }
</script>

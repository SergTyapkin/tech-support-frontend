<style lang="stylus" scoped>
@require '../../styles/constants.styl'
@require '../../styles/utils.styl'
@require '../../styles/buttons.styl'

//.addable-list-root

.addable-list
  padding 10px 0
  margin 0
  list-style none
  overflow-x hidden
  &.locked
    overflow-y hidden

.buttons
  position relative
  display flex
  align-items center
  justify-content center
  padding 20px
  .add-button
    button-dashed()
  .save-button
    position absolute
    right 20px
    bottom 18px
    button-success()
    border-radius 50%
    width min-content
    img
      width 30px
      min-width 30px
      height 30px

.addable-list-root
  position relative
  .lock-plate
    position absolute
    inset 0
    background #0009
    backdrop-filter blur(5px)
    border-bottom-left-radius 7px
    border-bottom-right-radius 7px
    .unlock-button
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      display flex
      align-items center
      border 1px dashed textColor3
      border-radius 1000px
      padding 5px 10px
      opacity 0.7
      transition all 0.2s ease
      cursor pointer
      &:hover
        opacity 1
      img
        width 30px
        min-width 30px
        height 30px
        margin-right 10px
</style>

<template>
  <div class="addable-list-root" :class="{locked}">
    <ul class="addable-list roll-active closed" ref="list">
      <ListItem v-for="(item, idx) in modelValue"
                v-model="modelValue[idx]"
                :idx="idx"
                @delete="deleteItem"
                @move="moveItem"
                :can-delete="canDelete"
                :placeholder="placeholder"
                :class="{'last-child': (item.confirmed) && ((idx + 1 >= modelValue.length) || (!modelValue[idx + 1].confirmed))}"
                @keydown.tab="() => {if (idx === modelValue.length - 1) addItem();}"
                @input="setEdited(item)"
      ></ListItem>
    </ul>

    <div class="buttons">
      <div class="add-button" @click="addItem">
        <img src="../../res/plus.svg" alt="add"> {{ addText }}
      </div>
      <div v-if="isEdited" class="save-button" @click="saveItems">
        <img src="../../res/save.svg" alt="save">
      </div>
    </div>

    <div v-if="locked" class="lock-plate">
      <div class="unlock-button" @click="unlock"><img src="../../res/edit.svg" alt="edit">Изменить</div>
    </div>
  </div>
</template>

<script>
  import ListItem from "./ListItem.vue";
  import {closeRollList, openRollList} from "../../utils/show-hide";
  import {nextTick} from "vue";

  export default {
    components: {ListItem},

    emits: ['add', 'delete', 'update:modelValue', 'input', 'save'],

    props: {
      modelValue: Array, // aka "items"
      addText: String,
      placeholder: String,
      unlockTitle: String,
      unlockDescription: String,
      canDelete: {
        type: Boolean,
        default: true,
      },
      locked: Boolean,
    },

    data() {
      return {
        isEdited: false,

        locked: this.$props.locked,

        toCreate: new Set(),
        toEdit: new Set(),
        toDelete: new Set(),
      }
    },

    methods: {
      addItem() {
        this.$emit('add');
        this.$emit('input');

        const newElement = {
          title: ''
        };

        this.modelValue.push(newElement);
        this.toCreate.add(newElement);
        this.updateVModel();
      },

      deleteItem(idx) {
        this.$emit('delete', this.modelValue[idx]);
        this.$emit('input');

        closeRollList(this.$refs.list);

        const deletedElement = this.modelValue[idx];
        this.modelValue.splice(idx, 1);

        if (this.toCreate.has(deletedElement)) {
          this.toCreate.delete(deletedElement);
        } else {
          if (this.toEdit.has(deletedElement))
            this.toEdit.delete(deletedElement);
          this.toDelete.add(deletedElement);
        }

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
        this.setEdited()
        this.$emit('update:modelValue', this.modelValue);
        this.rollOpenList();
      },

      async rollOpenList() {
        await nextTick();
        openRollList(this.$refs.list);
      },

      saveItems() {
        this.$emit('save', this.toCreate, this.toEdit, this.toDelete);
        this.toCreate = new Set();
        this.toEdit = new Set();
        this.toDelete = new Set();
        window.onbeforeunload = null;
        this.isEdited = false;
      },

      setEdited(element) {
        if (element !== undefined && !this.toCreate.has(element))
          this.toEdit.add(element);
        window.onbeforeunload = () => true;
        this.isEdited = true;
      },

      async unlock() {
        if (!await this.$modal.confirm(this.unlockTitle, this.unlockDescription))
          return;

        this.locked = false;
      }
    },

    watch: {
      modelValue: function (to, from) {
        this.rollOpenList();
      }
    }
  }
</script>

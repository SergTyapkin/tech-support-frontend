<style lang="stylus" scoped>
@require '../styles/constants.styl'

input-box-shadow = 0 0 15px 0 rgb(24, 19, 3) inset, 0 0 10px 0 rgba(162, 116, 14, 0.7)
input-bg = linear-gradient(20deg, rgba(45, 36, 13, 0.4) 0%, rgba(62, 39, 17, 0.6) 50%, rgba(38, 30, 11, 0.4) 100%) 50% 50% no-repeat


.floating-input-fields
  position relative
  input:not([type=checkbox]) + label
    position absolute
    top 22px
    left 8px
    transition all 0.2s ease
    font-size 16px
    pointer-events none
  input:not([type=checkbox]):focus + label
  input:not([type=checkbox]):not(:placeholder-shown) + label
    top -6px
    left 4px
    font-size 14px
  input
    margin-top 10px
    text-align center
  input:not([type=checkbox]).left
    text-align left
    border-left none
  input:not([type=checkbox]).right
    text-align right
    border-right none
.floating-input-fields.error
  .input-like
  input
    border-color error-color
    border-right none
  .error-text
    font-size 14px
    position absolute
    top -6px
    left 80px

.floating-input-fields
  > div
    margin 20px 0
    transition all 0.3s ease
    > label
      font-family Arial, monospace
    > textarea,
    > input[type=text]
    > input[type=password],
    > input[type=email],
      display block
      width 100%
      padding 10px
    .info
      margin 5px 0


@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  input[type=checkbox] {
    --active: colorYes;
    --active-inner: textColor1;
    --focus: 2px white;
    --border: textColor2;
    --border-hover: textColor1;
    --background: colorNo;
    --disabled: empColor1_3;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
    box-shadow: 0 0 5px 0 black inset
  }
  input[type=checkbox]:after {
    content: "";
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);
  }
  input[type=checkbox]:checked {
    --b: var(--active);
    --d-o: .3s;
    --d-t: .6s;
    --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
  }
  input[type=checkbox]:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: 0.9;
  }
  input[type=checkbox]:disabled:checked {
    --b: var(--disabled-inner);
  }
  input[type=checkbox]:disabled + label {
    cursor: not-allowed;
  }
  input[type=checkbox]:hover:not(:checked):not(:disabled) {
    --bc: var(--border-hover);
  }
  input[type=checkbox]:focus {
    //box-shadow: 0 0 0 var(--focus);
  }
  input[type=checkbox]:not(.switch) {
    width: 21px;
  }
  input[type=checkbox]:not(.switch):after {
    opacity: var(--o, 0);
  }
  input[type=checkbox]:not(.switch):checked {
    --o: 1;
  }
  input[type=checkbox] + label {
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }

  input[type=checkbox]:not(.switch) {
    border-radius: 7px;
  }
  input[type=checkbox]:not(.switch):after {
    width: 5px;
    height: 9px;
    border: 2px solid var(--active-inner);
    border-top: 0;
    border-left: 0;
    left: 7px;
    top: 4px;
    transform: rotate(var(--r, 20deg));
  }
  input[type=checkbox]:not(.switch):checked {
    --r: 43deg;
  }
  input[type=checkbox].switch {
    width: 38px;
    border-radius: 11px;
  }
  input[type=checkbox].switch:after {
    left: 2px;
    top: 2px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: var(--ab, var(--border));
    transform: translateX(var(--x, 0));
  }
  input[type=checkbox].switch:checked {
    --ab: var(--active-inner);
    --x: 17px;
  }
  input[type=checkbox].switch:disabled:not(:checked):after {
    opacity: 0.6;
  }

  //input[type=radio] {
  //    border-radius: 50%;
  //}
  //input[type=radio]:after {
  //    width: 19px;
  //    height: 19px;
  //    border-radius: 50%;
  //    background: var(--active-inner);
  //    opacity: 0;
  //    transform: scale(var(--s, 0.7));
  //}
  //input[type=radio]:checked {
  //    --s: .5;
  //}
  //
  //.radio {
  //  padding: 4px;
  //  border-radius: 3px;
  //  box-shadow: input-box-shadow;
  //  background: input-bg;
  //  position: relative;
  //}
  //
  //.radio input {
  //  margin-left 0
  //  margin-right 0
  //  width 45%
  //  box-sizing border-box
  //  color textColor3
  //  transition all 0.3s ease
  //  appearance: none;
  //  outline: none;
  //  border: none;
  //  cursor: pointer;
  //  border-radius: 2px;
  //  padding: 3px 8px;
  //  background: linear-gradient(colorNo 0%, empColor1_1 50%, colorYes 90%) no-repeat;
  //  background-size 100% 200%
  //  background-position-y 0
  //  box-shadow inset 0 0 5px colorShadow
  //}
  //
  //.radio input:checked {
  //  color textColor1
  //  background-position-y 100%
  //}
  //
  //.radio input:before {
  //  content: attr(label);
  //  display: inline-block;
  //  text-align: center;
  //  width: 100%;
  //}

}
</style>

<template>
  <div :class="{error: error?.length}" class="floating-input-fields">
    <span class="error-text">{{ error }}</span>
    <input ref="input" :type="type" :autocomplete="autocomplete" :name="name" placeholder=" " @input="updateVModel" :value="modelValue" :checked="this.modelValue" :disabled="disabled"
      :class="{
        left: textAlign === 'left',
        right: textAlign === 'right',
        switch: type === 'checkbox',
      }"
    >
    <label class="">{{ title }}</label>
    <div class="info">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['change', 'update:modelValue'],

  props: {
    title: String,
    type: {
      default: "text"
    },
    name: {
      default: ""
    },
    autocomplete: {
      default: "off"
    },
    textAlign: {
      default: "left"
    },
    disabled: Boolean,
    info: String,

    modelValue: null,
    error: String,
  },

  methods: {
    updateVModel(event) {
      let value = event.target.value;
      if (this.type === 'checkbox')
        value = event.target.checked;
      this.$emit('update:modelValue', value);
      this.$emit('change');
    },

    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>

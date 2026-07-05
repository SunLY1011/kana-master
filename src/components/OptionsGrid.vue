<template>
  <div class="options-grid">
    <button v-for="(opt, idx) in options" :key="idx" class="option-btn"
      :class="{
        correct: isCorrect(opt),
        wrong: isWrong(opt),
        'show-correct': showCorrect(opt)
      }"
      :disabled="disabled"
      @click="select(opt)">
      {{ opt }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  options: Array,
  correct: String,
  selected: { type: String, default: '' },
  disabled: Boolean
})
const emit = defineEmits(['select'])
const select = (val) => emit('select', val)

const isCorrect = (opt) => props.selected && opt === props.correct && props.selected === props.correct
const isWrong = (opt) => props.selected && opt === props.selected && opt !== props.correct
const showCorrect = (opt) => props.selected && opt === props.correct
</script>
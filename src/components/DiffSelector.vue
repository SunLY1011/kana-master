<template>
  <div class="difficulty-selector">
    <button v-for="l in levels" :key="l.value" class="diff-btn"
      :class="{ 'active-diff': store.difficulty === l.value }"
      @click="store.setDifficulty(l.value)">
      {{ l.label }}
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app'
const store = useAppStore()
const levels = [
  { value: 'basic', label: '初级(清音)' },
  { value: 'intermediate', label: '中级(+浊音)' },
  { value: 'advanced', label: '高级(全部)' }
]
</script>
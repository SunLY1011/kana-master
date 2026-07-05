<template>
  <div class="question-char-wrap">
    <span class="question-char" @click="$emit('speak')" :title="'点击听发音'">{{ char }}</span>
    <p class="question-romaji" v-if="romaji">发音：{{ romaji }}</p>
    <button class="btn-speaker" @click="$emit('speak')">🔊</button>
  </div>
</template>

<script setup>
defineProps({ char: String, romaji: String })
defineEmits(['speak'])
</script>
<template>
  <p class="feedback-text" v-if="status === 'correct'">✅ 正确！</p>
  <p class="feedback-text feedback-wrong" v-else-if="status === 'wrong'">❌ 正确答案：{{ correctAnswer }}</p>
</template>

<script setup>
defineProps({ status: String, correctAnswer: String })
</script>
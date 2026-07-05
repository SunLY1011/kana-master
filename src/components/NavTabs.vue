<template>
  <nav class="nav-tabs">
    <router-link v-for="tab in tabs" :key="tab.to" :to="tab.to"
      class="nav-tab" active-class="active" exact-active-class="active">
      {{ tab.label }}
    </router-link>
  </nav>
</template>

<script setup>
const tabs = [
  { to: '/practice/hira-to-kata', label: '📝 平→片' },
  { to: '/practice/kata-to-hira', label: '📝 片→平' },
  { to: '/kana-chart', label: '📋 五十音图' },
  { to: '/flashcard', label: '🃏 闪卡' },
  { to: '/study-cards', label: '📚 卡片学习' },
  { to: '/listening', label: '🎧 听写练习' },
  { to: '/mixed-quiz', label: '🎲 综合测验' }
]
</script>
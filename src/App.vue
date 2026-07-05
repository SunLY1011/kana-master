<template>
  <div class="container">
    <header class="header">
      <div class="logo">🎌</div>
      <h1>假名大师 Kana Master</h1>
      <p class="subtitle">平假名・片假名学习工具</p>
    </header>

    <VolumeControl />
    <StatsBar />
    <NavTabs />

    <main class="main-card">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavTabs from './components/NavTabs.vue'
import StatsBar from './components/StatsBar.vue'
import VolumeControl from './components/VolumeControl.vue'
</script>
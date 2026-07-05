<template>
  <div class="volume-control">
    <label>🔈 音量</label>
    <input type="range" min="0" max="100" :value="volPercent" @input="updateVolume" />
    <span class="volume-value">{{ volPercent }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTTS } from '../composables/useTTS'
const { volume, setVolume } = useTTS()
const volPercent = computed(() => Math.round(volume.value * 100))
const updateVolume = (e) => setVolume(e.target.value / 100)
</script>

<style scoped>
.volume-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 10px 0;
}
.volume-control input { width: 120px; accent-color: var(--primary); }
.volume-value { font-weight: 700; color: var(--primary); min-width: 45px; text-align: right; }
</style>
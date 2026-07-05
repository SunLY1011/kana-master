<template>
  <div class="study-card">
    <p style="color:#888; font-size:0.8rem;">📚 假名卡片学习 ({{ idx+1 }}/{{ total }})</p>
    <div class="study-char">{{ current?.hira }}</div>
    <div class="study-kana-sub">{{ current?.kata }}</div>
    <div class="study-romaji">[ {{ current?.romaji }} ]</div>
    <div class="mnemonic-box"><strong>🧠 记忆方法：</strong>{{ current?.mnemonic || '暂无' }}</div>
    <div class="word-box"><strong>📖 单词：</strong>{{ current?.word || '暂无' }}</div>
    <div style="margin-top:16px; display:flex; gap:10px; justify-content:center;">
      <button class="btn btn-outline btn-sm" @click="prev">◀ 上一个</button>
      <button class="btn btn-primary btn-sm" @click="next">下一个 ▶</button>
      <button class="btn-speaker" @click="speak">🔊</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { basicData } from '../data/kanaData'
import { useTTS } from '../composables/useTTS'

const { playPronunciation } = useTTS()
const dataset = basicData
const idx = ref(0)
const total = dataset.length
const current = computed(() => dataset[idx.value % total])
function next() { idx.value++ }
function prev() { if (idx.value > 0) idx.value-- }
function speak() { playPronunciation(current.value.hira) }
onMounted(() => idx.value = 0)
</script>

<style scoped>
.study-card { /* 样式可从全局复用 */ }
.mnemonic-box, .word-box { /* 同上 */ }
</style>
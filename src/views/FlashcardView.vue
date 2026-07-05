<template>
  <div>
    <DiffSelector />
    <div class="flashcard-container">
      <Flashcard 
        :flipped="flipped"
        :front="frontChar"
        :back="backChar"
        :romaji="currentItem?.romaji"
        :frontLabel="isHiraToKata ? '平假名' : '片假名'"
        :backLabel="isHiraToKata ? '片假名' : '平假名'"
        @flip="flipped = !flipped"
      />
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
        <button class="btn btn-outline btn-sm" @click="prev">◀</button>
        <button class="btn btn-primary btn-sm" @click="next">▶</button>
        <button class="btn btn-outline btn-sm" @click="toggleMode">🔄 切换方向</button>
        <button class="btn-speaker" @click="speak">🔊</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { getDataset } from '../data/kanaData'
import { useTTS } from '../composables/useTTS'
import DiffSelector from '../components/DiffSelector.vue'
import Flashcard from '../components/Flashcard.vue'

const store = useAppStore()
const { playPronunciation } = useTTS()
const dataset = computed(() => getDataset(store.difficulty))
const flashcardIndex = ref(0)
const flipped = ref(false)
const flashcardMode = ref('hira-to-kata') // 'hira-to-kata' or 'kata-to-hira'
const isHiraToKata = computed(() => flashcardMode.value === 'hira-to-kata')

const currentItem = computed(() => dataset.value[flashcardIndex.value % dataset.value.length])
const frontChar = computed(() => isHiraToKata.value ? currentItem.value.hira : currentItem.value.kata)
const backChar = computed(() => isHiraToKata.value ? currentItem.value.kata : currentItem.value.hira)

function next() { flashcardIndex.value++; flipped.value = false; }
function prev() { if (flashcardIndex.value > 0) flashcardIndex.value--; flipped.value = false; }
function toggleMode() { flashcardMode.value = flashcardMode.value === 'hira-to-kata' ? 'kata-to-hira' : 'hira-to-kata'; flipped.value = false; }
function speak() { playPronunciation(frontChar.value) }

watch(() => store.difficulty, () => { flashcardIndex.value = 0; flipped.value = false; })
onMounted(() => flashcardIndex.value = 0)
</script>
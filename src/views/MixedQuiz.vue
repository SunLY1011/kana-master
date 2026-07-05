<template>
  <div class="practice-area">
    <DiffSelector />
    <p class="question-label">🎲 综合测验 · {{ isHiraToKata ? '平→片' : '片→平' }}</p>
    <QuestionChar :char="currentChar" :romaji="currentItem?.romaji" @speak="play(currentChar)" />
    <OptionsGrid :options="optionDisplay" :correct="correctAnswer" :selected="selectedAnswer" :disabled="isAnswered" @select="handleSelect" />
    <FeedbackText :status="feedback" :correctAnswer="correctAnswer" />
    <button class="btn btn-outline btn-sm" @click="nextQuestion">⏭ 换一题</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { getDataset } from '../data/kanaData'
import { generateOptions } from '../utils/helpers'
import { useTTS } from '../composables/useTTS'
import DiffSelector from '../components/DiffSelector.vue'
import QuestionChar from '../components/QuestionChar.vue'
import OptionsGrid from '../components/OptionsGrid.vue'
import FeedbackText from '../components/FeedbackText.vue'

const store = useAppStore()
const { playPronunciation } = useTTS()

const isHiraToKata = ref(true)
const currentItem = ref(null)
const correctAnswer = ref('')
const optionDisplay = ref([])
const isAnswered = ref(false)
const selectedAnswer = ref('')
const feedback = ref('')
const questionKey = computed(() => isHiraToKata.value ? 'hira' : 'kata')
const answerKey = computed(() => isHiraToKata.value ? 'kata' : 'hira')
const currentChar = computed(() => currentItem.value?.[questionKey.value])

function generateQuestion() {
  const dataset = getDataset(store.difficulty)
  isHiraToKata.value = Math.random() > 0.5
  const item = dataset[Math.floor(Math.random() * dataset.length)]
  currentItem.value = item
  correctAnswer.value = item[answerKey.value]
  optionDisplay.value = generateOptions(correctAnswer.value, dataset, answerKey.value).map(opt => opt[answerKey.value])
  isAnswered.value = false
  selectedAnswer.value = ''
  feedback.value = ''
}

function handleSelect(answer) {
  if (isAnswered.value) return
  isAnswered.value = true
  selectedAnswer.value = answer
  const correct = answer === correctAnswer.value
  feedback.value = correct ? 'correct' : 'wrong'
  store.recordAnswer(correct)
  setTimeout(nextQuestion, 1500)
}

function nextQuestion() { generateQuestion() }

function play(char) { if (char) playPronunciation(char) }

watch(() => store.difficulty, generateQuestion)
onMounted(generateQuestion)
</script>
<template>
    <div class="practice-area">
        <DiffSelector />
        <p class="question-label">🎧 听写练习 · {{ optionType === 'hira' ? '平假名' : '片假名' }} · {{ diffLabel }}</p>
        <div style="font-size:4rem;">🔊</div>
        <p>请听发音，选择正确{{ optionType === 'hira' ? '平假名' : '片假名' }}</p>
        <button class="btn-speaker" @click="replay">🔊 再听一次</button>
        <OptionsGrid :options="optionDisplay" :correct="correctAnswer" :selected="selectedAnswer" :disabled="isAnswered"
            @select="handleSelect" />
        <FeedbackText :status="feedback" :correctAnswer="correctAnswer" />
        <button class="btn btn-outline btn-sm" @click="nextQuestion">⏭ 下一题</button>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { getDataset } from '../data/kanaData'
import { generateOptions } from '../utils/helpers'
import { useTTS } from '../composables/useTTS'
import DiffSelector from '../components/DiffSelector.vue'
import OptionsGrid from '../components/OptionsGrid.vue'
import FeedbackText from '../components/FeedbackText.vue'

const store = useAppStore()
const { playPronunciation } = useTTS()

const optionType = ref('hira') // 随机
const correctAnswer = ref('')
const optionDisplay = ref([])
const isAnswered = ref(false)
const selectedAnswer = ref('')
const feedback = ref('')
const currentItem = ref(null)

const diffLabel = computed(() => ({ basic: '初级', intermediate: '中级', advanced: '高级' }[store.difficulty]))

function generateQuestion() {
    const dataset = getDataset(store.difficulty)
    const item = dataset[Math.floor(Math.random() * dataset.length)]
    currentItem.value = item
    optionType.value = Math.random() < 0.5 ? 'hira' : 'kata'
    correctAnswer.value = item[optionType.value]
    optionDisplay.value = generateOptions(correctAnswer.value, dataset, optionType.value).map(opt => opt[optionType.value])
    isAnswered.value = false
    selectedAnswer.value = ''
    feedback.value = ''
    setTimeout(() => playPronunciation(item.hira), 300)
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

function replay() { if (currentItem.value) playPronunciation(currentItem.value.hira) }

function nextQuestion() { generateQuestion() }

watch(() => store.difficulty, generateQuestion)
onMounted(generateQuestion)
</script>
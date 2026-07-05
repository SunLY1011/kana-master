import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
    // 鎸佷箙鍖栫粺璁?    const correctCount = ref(Number(localStorage.getItem('correctCount') || 0))
    const totalCount = ref(Number(localStorage.getItem('totalCount') || 0))
    const bestCombo = ref(Number(localStorage.getItem('bestCombo') || 0))

    // 浼氳瘽鐘舵€?    const comboCount = ref(0)
    const difficulty = ref('basic')

    const accuracyRate = computed(() =>
        totalCount.value > 0 ? Math.round((correctCount.value / totalCount.value) * 100) : 0
    )

    function saveStats() {
        localStorage.setItem('correctCount', correctCount.value)
        localStorage.setItem('totalCount', totalCount.value)
        localStorage.setItem('bestCombo', bestCombo.value)
    }

    function recordAnswer(isCorrect) {
        totalCount.value++
        if (isCorrect) {
            correctCount.value++
            comboCount.value++
            if (comboCount.value > bestCombo.value) bestCombo.value = comboCount.value
        } else {
            comboCount.value = 0
        }
        saveStats()
    }

    function setDifficulty(level) {
        difficulty.value = level
    }

    return {
        correctCount, totalCount, bestCombo, comboCount, accuracyRate,
        difficulty,
        recordAnswer, setDifficulty
    }
})
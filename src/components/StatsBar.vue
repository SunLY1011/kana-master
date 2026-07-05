<template>
    <div class="stats-bar">
        <div class="stat-item"><span class="stat-icon">✅</span><span class="stat-value">{{ store.correctCount
                }}</span><span class="stat-label">正确</span></div>
        <div class="stat-item"><span class="stat-icon">📝</span><span class="stat-value">{{ store.totalCount
                }}</span><span class="stat-label">总题数</span></div>
        <div class="stat-item"><span class="stat-icon">🎯</span><span class="stat-value">{{ store.accuracyRate
                }}%</span><span class="stat-label">正确率</span></div>
        <div class="stat-item"><span class="stat-icon">🔥</span><span class="stat-value"
                :class="{ combo: store.comboCount >= 5 }">{{ store.comboCount }}</span><span
                class="stat-label">连击</span></div>
        <div class="stat-item"><span class="stat-icon">👑</span><span class="stat-value">{{ store.bestCombo
                }}</span><span class="stat-label">最佳连击</span></div>
    </div>
</template>

<script setup>
import { useAppStore } from '../stores/app'
const store = useAppStore()
</script>
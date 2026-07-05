<template>
    <div style="text-align:center">
        <h3 style="color:#8b5e3c;">📋 五十音图（清音）</h3>
        <div class="switch-btn-group">
            <button :class="['btn btn-sm', chartType === 'hira' ? 'btn-primary' : 'btn-outline']"
                @click="chartType = 'hira'">平假名</button>
            <button :class="['btn btn-sm', chartType === 'kata' ? 'btn-primary' : 'btn-outline']"
                @click="chartType = 'kata'">片假名</button>
        </div>
        <KanaTable :type="chartType" @play="handlePlay" />
        <p style="font-size:0.8rem;color:#999;">点击假名听发音 | 浊音・拗音在练习中学习</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import KanaTable from '../components/KanaTable.vue'
import { useTTS } from '../composables/useTTS'
const chartType = ref('hira')
const { playPronunciation } = useTTS()
const handlePlay = (char) => playPronunciation(char)
</script>
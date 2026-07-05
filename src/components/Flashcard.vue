<template>
    <div class="flashcard-container">
        <div class="flashcard" :class="{ flipped }" @click="$emit('flip')">
            <div class="flashcard-face flashcard-front">
                <span class="flashcard-label">{{ frontLabel }}</span>
                <span>{{ front }}</span>
                <span class="flashcard-romaji">{{ romaji }}</span>
            </div>
            <div class="flashcard-face flashcard-back">
                <span class="flashcard-label">{{ backLabel }}</span>
                <span>{{ back }}</span>
                <span class="flashcard-romaji">{{ romaji }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    flipped: Boolean,
    front: String,
    back: String,
    romaji: String,
    frontLabel: String,
    backLabel: String
})
defineEmits(['flip'])
</script>
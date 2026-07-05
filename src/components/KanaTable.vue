<template>
  <div class="kana-table-wrapper">
    <table class="kana-table">
      <thead>
        <tr>
          <th></th>
          <th v-for="col in colLabels" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ri) in rows" :key="row">
          <td class="row-label">{{ rowLabels[ri] }}</td>
          <td v-for="(col, ci) in cols" :key="ci" @click="handleClick(row, col)">
            <template v-if="cellData(row, col)">
              <span class="kana-main">{{ cellData(row, col).char }}</span>
              <span class="romaji-sub">{{ cellData(row, col).romaji }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { seionData } from '../data/kanaData'

const props = defineProps({ type: { type: String, required: true } })
const emit = defineEmits(['play'])

const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n']
const rowLabels = ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行', 'ん']
const cols = [0, 1, 2, 3, 4]
const colLabels = ['a段', 'i段', 'u段', 'e段', 'o段']

const map = {}
seionData.forEach(i => { map[i.row + '_' + i.col] = i })

function cellData(row, col) {
  const item = map[row + '_' + col]
  if (!item) return null
  return {
    char: props.type === 'hira' ? item.hira : item.kata,
    romaji: item.romaji
  }
}

function handleClick(row, col) {
  const item = map[row + '_' + col]
  if (item) {
    const char = props.type === 'hira' ? item.hira : item.kata
    emit('play', char)
  }
}
</script>

<style scoped>
/* 表格样式与全局一致，若有需要可迁移到全局 */
</style>
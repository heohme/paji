<template>
  <div class="hand-matrix">
    <div class="matrix-grid">
      <div
        v-for="(row, rowIndex) in matrix"
        :key="rowIndex"
        class="matrix-row"
      >
        <div
          v-for="(hand, colIndex) in row"
          :key="colIndex"
          class="hand-cell"
          :style="{ backgroundColor: getHandColor(hand) }"
          :class="{ 'selected': selectedHand === hand }"
          @click="handleHandClick(hand)"
          @mouseenter="handleHandHover(hand)"
        >
          <span class="hand-text">{{ hand }}</span>
          <span v-if="getHandFrequency(hand) < 1" class="frequency-badge">
            {{ Math.round(getHandFrequency(hand) * 100) }}%
          </span>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #059669"></div>
        <span>Raise / Open</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #dc2626"></div>
        <span>3-Bet</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #2563eb"></div>
        <span>Call</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #f59e0b"></div>
        <span>Mixed (混合策略)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #9ca3af"></div>
        <span>Fold</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hand, RangeResult } from '../types/range'
import { generateHandMatrix, getHandAction, getActionColor } from '../utils/handUtils'

interface Props {
  range: RangeResult
  selectedHand?: Hand | null
}

interface Emits {
  (e: 'handClick', hand: Hand): void
  (e: 'handHover', hand: Hand): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 生成手牌矩阵
const matrix = computed(() => generateHandMatrix())

// 获取手牌的颜色
const getHandColor = (hand: Hand): string => {
  const handAction = getHandAction(hand, props.range)
  return getActionColor(handAction.action, handAction.frequency)
}

// 获取手牌的频率
const getHandFrequency = (hand: Hand): number => {
  const handAction = getHandAction(hand, props.range)
  return handAction.frequency || 0
}

// 处理手牌点击
const handleHandClick = (hand: Hand) => {
  emit('handClick', hand)
}

// 处理手牌悬停
const handleHandHover = (hand: Hand) => {
  emit('handHover', hand)
}
</script>

<style scoped>
.hand-matrix {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.matrix-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: #e5e7eb;
  padding: 2px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.matrix-row {
  display: flex;
  gap: 2px;
}

.hand-cell {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  font-weight: 600;
}

.hand-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.hand-cell.selected {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
  z-index: 20;
}

.hand-text {
  color: white;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.frequency-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 8px;
  padding: 1px 3px;
  border-radius: 2px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hand-cell {
    width: 36px;
    height: 36px;
  }

  .hand-text {
    font-size: 10px;
  }

  .legend {
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .hand-cell {
    width: 28px;
    height: 28px;
  }

  .hand-text {
    font-size: 8px;
  }

  .frequency-badge {
    font-size: 6px;
  }
}
</style>

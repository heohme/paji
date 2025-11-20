<template>
  <div v-if="hand" class="hand-detail">
    <div class="detail-header">
      <h3 class="hand-title">{{ hand }}</h3>
      <div
        class="action-badge"
        :style="{ backgroundColor: handAction.color }"
      >
        {{ getActionLabel(handAction.action) }}
      </div>
    </div>

    <div class="detail-content">
      <div class="detail-row">
        <span class="detail-label">建议动作：</span>
        <span class="detail-value">{{ handAction.description }}</span>
      </div>

      <div v-if="handAction.frequency && handAction.frequency < 1" class="detail-row">
        <span class="detail-label">频率：</span>
        <span class="detail-value">{{ (handAction.frequency * 100).toFixed(0) }}%</span>
      </div>

      <div class="detail-row">
        <span class="detail-label">手牌类型：</span>
        <span class="detail-value">{{ getHandType(hand) }}</span>
      </div>
    </div>

    <div class="detail-note">
      <p class="note-text">
        {{ getHandNote(handAction.action) }}
      </p>
    </div>
  </div>

  <div v-else class="hand-detail-empty">
    <p>点击手牌查看详细信息</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Hand, RangeResult } from '../types/range'
import { getHandAction, getActionLabel } from '../utils/handUtils'

interface Props {
  hand: Hand | null
  range: RangeResult
}

const props = defineProps<Props>()

const handAction = computed(() => {
  if (!props.hand) {
    return {
      hand: '',
      action: 'fold' as const,
      frequency: 0,
      color: '#6b7280',
      description: ''
    }
  }
  return getHandAction(props.hand, props.range)
})

const getHandType = (hand: Hand): string => {
  if (hand.length === 2) return '口袋对'
  if (hand.endsWith('s')) return '同花'
  if (hand.endsWith('o')) return '不同花'
  return '未知'
}

const getHandNote = (action: string): string => {
  const notes: Record<string, string> = {
    raise: '这是一手强牌，应该主动加注入池，建立底池并获得主动权。',
    '3bet': '面对对手的加注，这手牌足够强可以进行3-bet。既可以作为价值3-bet，也可能作为bluff。',
    call: '这手牌可以跟注对手的加注。通常是为了看翻牌，或者平衡范围。',
    fold: '这手牌在当前场景下不够强，建议弃牌。'
  }
  return notes[action] || '请根据具体情况做出决策。'
}
</script>

<style scoped>
.hand-detail {
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hand-detail-empty {
  padding: 3rem 1.5rem;
  background-color: #f9fafb;
  border-radius: 8px;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.hand-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.action-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-weight: 600;
  color: #111827;
}

.detail-note {
  padding: 1rem;
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
}

.note-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #1e40af;
  margin: 0;
}

@media (max-width: 640px) {
  .hand-detail {
    padding: 1rem;
  }

  .hand-title {
    font-size: 1.5rem;
  }

  .action-badge {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
